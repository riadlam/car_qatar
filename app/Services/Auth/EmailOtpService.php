<?php

namespace App\Services\Auth;

use App\Mail\EmailOtpMail;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class EmailOtpService
{
    public const CODE_TTL_SECONDS = 600;

    public const TOKEN_TTL_SECONDS = 900;

    public const RESEND_COOLDOWN_SECONDS = 60;

    public const MAX_SENDS_PER_HOUR = 5;

    public const MAX_VERIFY_ATTEMPTS = 5;

    public function normalizeEmail(string $email): string
    {
        return Str::lower(trim($email));
    }

    /**
     * Send (or resend) a 6-digit signup OTP. Never returns the code.
     *
     * @return array{cooldown_seconds: int, expires_in: int, resent: bool}
     */
    public function send(string $email, bool $isResend = false): array
    {
        $email = $this->normalizeEmail($email);

        if (User::query()->where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => [__('api.auth.otp_email_taken')],
            ]);
        }

        $cooldownKey = $this->cooldownKey($email);
        if (Cache::has($cooldownKey)) {
            throw ValidationException::withMessages([
                'email' => [__('api.auth.otp_cooldown', ['seconds' => self::RESEND_COOLDOWN_SECONDS])],
            ]);
        }

        $hourKey = $this->hourKey($email);
        $sends = (int) Cache::get($hourKey, 0);
        if ($sends >= self::MAX_SENDS_PER_HOUR) {
            throw ValidationException::withMessages([
                'email' => [__('api.auth.otp_send_limit')],
            ]);
        }

        $code = (string) random_int(100000, 999999);

        Cache::put($this->otpKey($email), [
            'hash' => Hash::make($code),
            'attempts' => 0,
        ], self::CODE_TTL_SECONDS);

        Cache::put($cooldownKey, 1, self::RESEND_COOLDOWN_SECONDS);
        Cache::put($hourKey, $sends + 1, 3600);

        Mail::to($email)->send(new EmailOtpMail($code, (int) (self::CODE_TTL_SECONDS / 60)));

        return [
            'cooldown_seconds' => self::RESEND_COOLDOWN_SECONDS,
            'expires_in' => self::CODE_TTL_SECONDS,
            'resent' => $isResend,
        ];
    }

    /**
     * Verify OTP and return a one-time registration proof token.
     *
     * @return array{email_otp_token: string, expires_in: int}
     */
    public function verify(string $email, string $code): array
    {
        $email = $this->normalizeEmail($email);
        $code = preg_replace('/\D+/', '', $code) ?? '';

        if (strlen($code) !== 6) {
            throw ValidationException::withMessages([
                'code' => [__('api.auth.otp_invalid')],
            ]);
        }

        $payload = Cache::get($this->otpKey($email));
        if (! is_array($payload) || empty($payload['hash'])) {
            throw ValidationException::withMessages([
                'code' => [__('api.auth.otp_expired')],
            ]);
        }

        $attempts = (int) ($payload['attempts'] ?? 0);
        if ($attempts >= self::MAX_VERIFY_ATTEMPTS) {
            Cache::forget($this->otpKey($email));
            throw ValidationException::withMessages([
                'code' => [__('api.auth.otp_locked')],
            ]);
        }

        if (! Hash::check($code, $payload['hash'])) {
            $payload['attempts'] = $attempts + 1;
            Cache::put($this->otpKey($email), $payload, self::CODE_TTL_SECONDS);

            if ($payload['attempts'] >= self::MAX_VERIFY_ATTEMPTS) {
                Cache::forget($this->otpKey($email));
                throw ValidationException::withMessages([
                    'code' => [__('api.auth.otp_locked')],
                ]);
            }

            throw ValidationException::withMessages([
                'code' => [__('api.auth.otp_invalid')],
            ]);
        }

        Cache::forget($this->otpKey($email));

        $token = Str::random(64);
        Cache::put($this->tokenKey($token), $email, self::TOKEN_TTL_SECONDS);

        return [
            'email_otp_token' => $token,
            'expires_in' => self::TOKEN_TTL_SECONDS,
        ];
    }

    /**
     * Consume a one-time registration token. Returns true when it matches the email.
     */
    public function consumeRegistrationToken(string $token, string $expectedEmail): bool
    {
        $token = trim($token);
        if ($token === '') {
            return false;
        }

        $email = Cache::pull($this->tokenKey($token));
        if (! is_string($email) || $email === '') {
            return false;
        }

        return hash_equals($email, $this->normalizeEmail($expectedEmail));
    }

    private function otpKey(string $email): string
    {
        return 'email_otp:code:'.$email;
    }

    private function tokenKey(string $token): string
    {
        return 'email_otp:reg:'.$token;
    }

    private function cooldownKey(string $email): string
    {
        return 'email_otp:cooldown:'.$email;
    }

    private function hourKey(string $email): string
    {
        return 'email_otp:hour:'.$email;
    }
}
