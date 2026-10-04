<?php

namespace App\Services\Cpanel;

use App\Support\MailboxPassword;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class CpanelEmailService
{
    /** @var list<string> */
    private const ANON_WORDS = [
        'octanium', 'vellum', 'nimbus', 'cobalt', 'harbor', 'lumen', 'sable',
        'quartz', 'meridian', 'cascade', 'ember', 'frost', 'glyph', 'helix',
        'ivory', 'jasper', 'kestrel', 'lattice', 'marble', 'nebula', 'onyx',
        'prism', 'quasar', 'ripple', 'solstice', 'timber', 'umbra', 'vortex',
    ];

    public function domain(): string
    {
        return (string) config('services.cpanel.email_domain');
    }

    public function webmailUrl(): string
    {
        return (string) config('services.cpanel.webmail_url');
    }

    public function isConfigured(): bool
    {
        if ($this->usesBridge()) {
            return filled(config('services.cpanel.bridge_url'))
                && filled(config('services.cpanel.bridge_secret'));
        }

        return filled(config('services.cpanel.host'))
            && filled(config('services.cpanel.user'))
            && filled(config('services.cpanel.api_token'));
    }

    public function usesBridge(): bool
    {
        return filled(config('services.cpanel.bridge_url'));
    }

    /**
     * @return list<array{local: string, email: string, domain: string}>
     */
    public function listAccounts(): array
    {
        $domain = $this->domain();
        $payload = $this->uapi('Email', 'list_pops', [
            'domain' => $domain,
        ]);

        $rows = data_get($payload, 'result.data', data_get($payload, 'data', []));
        if (! is_array($rows)) {
            return [];
        }

        $accounts = [];
        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }
            $login = strtolower(trim((string) ($row['login'] ?? '')));
            if ($login === 'main account') {
                continue;
            }

            $email = (string) ($row['email'] ?? $row['login'] ?? '');
            if ($email === '' || ! str_contains($email, '@')) {
                continue;
            }

            [$local, $acctDomain] = array_pad(explode('@', $email, 2), 2, $domain);
            if (strcasecmp($acctDomain, $domain) !== 0) {
                continue;
            }

            $local = strtolower(trim($local));
            if ($local === '') {
                continue;
            }

            $accounts[] = [
                'local' => $local,
                'email' => $local.'@'.$domain,
                'domain' => $domain,
            ];
        }

        usort($accounts, fn (array $a, array $b) => strcmp($a['email'], $b['email']));

        return array_values($accounts);
    }

    /**
     * @return array{local: string, email: string, domain: string, password: string, webmail_url: string}
     */
    public function createAccount(string $localPart, string $password): array
    {
        $domain = $this->domain();
        $local = $this->normalizeLocalPart($localPart);
        $password = trim($password);

        if ($local === '') {
            throw new RuntimeException('Username is required.');
        }
        if ($error = MailboxPassword::validate($password, $local)) {
            throw new RuntimeException($error);
        }

        $this->uapi('Email', 'add_pop', [
            'email' => $local,
            'password' => $password,
            'domain' => $domain,
            'quota' => 0,
        ]);

        return [
            'local' => $local,
            'email' => $local.'@'.$domain,
            'domain' => $domain,
            'password' => $password,
            'webmail_url' => $this->webmailUrl(),
        ];
    }

    /**
     * @return array{email: string, password: string, webmail_url: string}
     */
    public function changePassword(string $localPart, string $password): array
    {
        $domain = $this->domain();
        $local = $this->normalizeLocalPart($localPart);
        $password = trim($password);

        if ($local === '') {
            throw new RuntimeException('Mailbox is required.');
        }
        if ($error = MailboxPassword::validate($password, $local)) {
            throw new RuntimeException($error);
        }

        $this->uapi('Email', 'passwd_pop', [
            'email' => $local,
            'password' => $password,
            'domain' => $domain,
        ]);

        return [
            'email' => $local.'@'.$domain,
            'password' => $password,
            'webmail_url' => $this->webmailUrl(),
        ];
    }

    public function generateSuggestedLocalPart(): string
    {
        $word = self::ANON_WORDS[array_rand(self::ANON_WORDS)];
        $suffix = Str::lower(Str::random(3));

        return $word.$suffix;
    }

    /** @deprecated Use generateSuggestedLocalPart() */
    public function generateAnonymousLocalPart(): string
    {
        return $this->generateSuggestedLocalPart();
    }

    public function generatePassword(int $length = 16): string
    {
        return MailboxPassword::generate($length);
    }

    public function normalizeLocalPart(string $localPart): string
    {
        $local = strtolower(trim($localPart));
        $local = preg_replace('/@.*$/', '', $local) ?: '';
        $local = preg_replace('/[^a-z0-9._+-]/', '', $local) ?: '';

        return $local;
    }

    /**
     * @param  array<string, scalar|null>  $params
     * @return array<string, mixed>
     */
    private function uapi(string $module, string $function, array $params = []): array
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Email service is not configured.');
        }

        if ($this->usesBridge()) {
            return $this->bridgeCall($module, $function, $params);
        }

        try {
            $response = $this->client()->get("/execute/{$module}/{$function}", $params);
        } catch (Throwable) {
            throw new RuntimeException('Unable to reach the mail service. Try again later.');
        }

        if (! $response->successful()) {
            throw new RuntimeException('Unable to reach the mail service. Try again later.');
        }

        return $this->assertUapiOk($response->json());
    }

    /**
     * @param  array<string, scalar|null>  $params
     * @return array<string, mixed>
     */
    private function bridgeCall(string $module, string $function, array $params = []): array
    {
        $action = match ("{$module}::{$function}") {
            'Email::list_pops' => 'list_pops',
            'Email::add_pop' => 'add_pop',
            'Email::passwd_pop' => 'passwd_pop',
            default => null,
        };

        if ($action === null) {
            throw new RuntimeException('Mail action is not supported.');
        }

        $body = ['action' => $action];
        if ($action === 'add_pop' || $action === 'passwd_pop') {
            $body['email'] = (string) ($params['email'] ?? '');
            $body['password'] = (string) ($params['password'] ?? '');
        }

        try {
            $response = Http::withHeaders([
                'X-Bridge-Secret' => (string) config('services.cpanel.bridge_secret'),
                'Accept' => 'application/json',
            ])
                ->acceptJson()
                ->connectTimeout(8)
                ->timeout(25)
                ->post((string) config('services.cpanel.bridge_url'), $body);
        } catch (Throwable) {
            throw new RuntimeException('Unable to reach the mail service. Try again later.');
        }

        $json = $response->json();
        if (is_array($json) && empty($json['ok'])) {
            $message = trim((string) ($json['error'] ?? ''));
            if ($message === 'Unknown action') {
                throw new RuntimeException('Password change is not enabled on the mail bridge yet. Update mail-bridge.php on the mail host.');
            }
            if ($message !== '') {
                throw new RuntimeException($this->sanitizeMailError($message));
            }
        }

        if (! $response->successful()) {
            throw new RuntimeException('Unable to reach the mail service. Try again later.');
        }

        if (! is_array($json) || empty($json['ok'])) {
            throw new RuntimeException('Unable to reach the mail service. Try again later.');
        }

        $payload = $json['payload'] ?? null;
        if (! is_array($payload)) {
            throw new RuntimeException('Unexpected mail service response.');
        }

        return $this->assertUapiOk($payload);
    }

    /**
     * @return array<string, mixed>
     */
    private function assertUapiOk(mixed $json): array
    {
        if (! is_array($json)) {
            throw new RuntimeException('Unexpected mail service response.');
        }

        $status = data_get($json, 'status', data_get($json, 'result.status'));
        $errors = data_get($json, 'errors', data_get($json, 'result.errors'));

        if ((int) $status !== 1) {
            $message = is_array($errors) ? implode(' ', array_filter($errors)) : (string) $errors;
            $message = trim($message) !== '' ? $message : 'Mail account request failed.';
            throw new RuntimeException($this->sanitizeMailError($message));
        }

        return $json;
    }

    private function sanitizeMailError(string $message): string
    {
        $message = preg_replace('/cpanel|whm|server|hosting|127\.0\.0\.1|:2083|octenium|quantum/i', 'mail service', $message) ?: $message;
        $message = trim($message);

        if ($message === '' || strcasecmp($message, 'Mail service request failed') === 0 || strcasecmp($message, 'failed') === 0) {
            return 'The mail service rejected this request. Check the username/password and try again.';
        }

        return $message;
    }

    private function client(): PendingRequest
    {
        $host = (string) config('services.cpanel.host');
        $user = (string) config('services.cpanel.user');
        $token = (string) config('services.cpanel.api_token');
        $verify = (bool) config('services.cpanel.verify_ssl', true);

        return Http::baseUrl($host)
            ->withHeaders([
                'Authorization' => 'cpanel '.$user.':'.$token,
            ])
            ->acceptJson()
            ->connectTimeout(8)
            ->timeout(20)
            ->withOptions([
                'verify' => $verify,
            ]);
    }
}
