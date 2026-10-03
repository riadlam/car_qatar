<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            Log::warning('Google OAuth callback failed', [
                'message' => $e->getMessage(),
            ]);

            return redirect('/login?error=google');
        }

        $email = strtolower(trim((string) $googleUser->getEmail()));
        if ($email === '') {
            return redirect('/login?error=google_email');
        }

        $googleId = (string) $googleUser->getId();
        $name = trim((string) ($googleUser->getName() ?: $googleUser->getNickname() ?: ''));
        $firstName = data_get($googleUser->user, 'given_name');
        $lastName = data_get($googleUser->user, 'family_name');

        if (! $firstName && $name !== '') {
            $parts = preg_split('/\s+/', $name, 2) ?: [];
            $firstName = $parts[0] ?? null;
            $lastName = $parts[1] ?? null;
        }

        $user = DB::transaction(function () use ($email, $googleId, $name, $firstName, $lastName) {
            $user = User::query()->where('google_id', $googleId)->first()
                ?? User::query()->where('email', $email)->first();

            if ($user) {
                $user->forceFill([
                    'google_id' => $user->google_id ?: $googleId,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    'last_login_at' => now(),
                    'name' => $user->name ?: ($name !== '' ? $name : $email),
                    'first_name' => $user->first_name ?: $firstName,
                    'last_name' => $user->last_name ?: $lastName,
                ])->save();

                return $user;
            }

            $user = User::create([
                'name' => $name !== '' ? $name : $email,
                'email' => $email,
                'google_id' => $googleId,
                'password' => null,
                'account_type' => 'individual',
                'title' => 'Mr.',
                'first_name' => $firstName,
                'last_name' => $lastName,
                'phone' => null,
                'preferred_language' => null,
                'language' => 'en',
                'street_address' => null,
                'marketing_emails' => true,
                'booking_notifications' => 'email_sms',
                'status' => 'active',
            ]);

            $user->forceFill([
                'role' => UserRole::Customer,
                'email_verified_at' => now(),
                'last_login_at' => now(),
            ])->save();

            return $user;
        });

        if ($user->role === UserRole::Chauffeur && $user->chauffeur?->status === 'declined') {
            return redirect('/login?error=chauffeur_declined');
        }

        $code = Str::random(64);
        Cache::put('oauth_login:'.$code, [
            'user_id' => $user->id,
        ], now()->addMinutes(2));

        return redirect('/oauth/callback?code='.urlencode($code));
    }

    public function exchange(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:128'],
            'device_name' => ['nullable', 'string', 'max:80'],
        ]);

        $payload = Cache::pull('oauth_login:'.$data['code']);
        if (! is_array($payload) || empty($payload['user_id'])) {
            return response()->json([
                'message' => 'This Google sign-in link has expired. Please try again.',
            ], 422);
        }

        $user = User::query()->with('chauffeur')->find($payload['user_id']);
        if (! $user || $user->status !== 'active') {
            return response()->json([
                'message' => 'Unable to complete Google sign-in.',
            ], 422);
        }

        $token = $user->createToken($data['device_name'] ?? 'web')->plainTextToken;

        return response()->json([
            'user' => (new UserResource($user))->resolve(),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}
