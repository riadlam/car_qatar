<?php

namespace App\Services\Cpanel;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

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
        return filled(config('services.cpanel.host'))
            && filled(config('services.cpanel.user'))
            && filled(config('services.cpanel.api_token'));
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
            $email = (string) ($row['email'] ?? $row['login'] ?? '');
            if ($email === '' || ! str_contains($email, '@')) {
                $user = (string) ($row['user'] ?? $row['login'] ?? '');
                if ($user === '') {
                    continue;
                }
                $email = str_contains($user, '@') ? $user : $user.'@'.$domain;
            }

            [$local, $acctDomain] = array_pad(explode('@', $email, 2), 2, $domain);
            if (strcasecmp($acctDomain, $domain) !== 0) {
                continue;
            }

            $accounts[] = [
                'local' => $local,
                'email' => strtolower($local.'@'.$domain),
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
        if (strlen($password) < 8) {
            throw new RuntimeException('Password must be at least 8 characters.');
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

    public function generateAnonymousLocalPart(): string
    {
        $word = self::ANON_WORDS[array_rand(self::ANON_WORDS)];
        $suffix = Str::lower(Str::random(3));

        return $word.$suffix;
    }

    public function generatePassword(int $length = 16): string
    {
        $length = max(12, min(32, $length));

        return Str::password($length, symbols: true);
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

        $response = $this->client()->get("/execute/{$module}/{$function}", $params);

        if (! $response->successful()) {
            throw new RuntimeException('Unable to reach the mail service. Try again later.');
        }

        $json = $response->json();
        if (! is_array($json)) {
            throw new RuntimeException('Unexpected mail service response.');
        }

        $status = data_get($json, 'status', data_get($json, 'result.status'));
        $errors = data_get($json, 'errors', data_get($json, 'result.errors'));

        if ((int) $status !== 1) {
            $message = is_array($errors) ? implode(' ', array_filter($errors)) : (string) $errors;
            $message = trim($message) !== '' ? $message : 'Mail account request failed.';
            // Never leak host/provider wording from raw cPanel errors when possible.
            $message = preg_replace('/cpanel|whm|server|hosting/i', 'mail service', $message) ?: $message;
            throw new RuntimeException($message);
        }

        return $json;
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
