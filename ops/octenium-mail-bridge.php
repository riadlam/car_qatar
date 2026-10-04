<?php
/**
 * Upload this file to Octenium cPanel → File Manager → public_html
 * Suggested path: public_html/mail-bridge.php
 *
 * Fill the CONFIG values below (cPanel username, API token, bridge secret).
 * Do not put this file on the VPS — it must run on Octenium where mail/cPanel lives.
 */

declare(strict_types=1);

// ─── CONFIG (edit on Octenium only) ─────────────────────────────────────────
const CPANEL_USER = 'PUT_YOUR_CPANEL_USERNAME_HERE';       // e.g. sgugxvyb (check top-right in cPanel)
const CPANEL_API_TOKEN = 'PUT_YOUR_CREATE_EMAIL_TOKEN_HERE';
const BRIDGE_SECRET = 'PUT_A_LONG_RANDOM_SECRET_HERE';     // same value as CPANEL_BRIDGE_SECRET on VPS
const EMAIL_DOMAIN = 'almajdluxurytransport.com';
const UAPI_BASE = 'https://127.0.0.1:2083';               // local cPanel on this host
// ────────────────────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$given = $_SERVER['HTTP_X_BRIDGE_SECRET'] ?? '';
if ($given === '' || ! hash_equals(BRIDGE_SECRET, $given)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden']);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (! is_array($body)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$action = (string) ($body['action'] ?? '');

try {
    if ($action === 'list_pops') {
        $payload = uapi('Email', 'list_pops', [
            'domain' => EMAIL_DOMAIN,
        ]);
        echo json_encode(['ok' => true, 'payload' => $payload]);
        exit;
    }

    if ($action === 'add_pop') {
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $password = (string) ($body['password'] ?? '');
        $email = preg_replace('/@.*$/', '', $email) ?: '';
        $email = preg_replace('/[^a-z0-9._+-]/', '', $email) ?: '';

        if ($email === '' || strlen($password) < 8) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Invalid username or password']);
            exit;
        }

        $payload = uapi('Email', 'add_pop', [
            'email' => $email,
            'password' => $password,
            'domain' => EMAIL_DOMAIN,
            'quota' => 0,
        ]);
        echo json_encode(['ok' => true, 'payload' => $payload]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Unknown action']);
} catch (Throwable $e) {
    http_response_code(502);
    // Keep message generic — do not leak host/provider details to callers.
    echo json_encode(['ok' => false, 'error' => 'Mail service request failed']);
}

/**
 * @param  array<string, scalar|null>  $params
 * @return array<string, mixed>
 */
function uapi(string $module, string $function, array $params): array
{
    $url = UAPI_BASE.'/execute/'.rawurlencode($module).'/'.rawurlencode($function);
    if ($params !== []) {
        $url .= '?'.http_build_query($params);
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_HTTPHEADER => [
            'Authorization: cpanel '.CPANEL_USER.':'.CPANEL_API_TOKEN,
            'Accept: application/json',
        ],
        // 127.0.0.1 cert will not match; this call stays on localhost only.
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
    ]);

    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($body === false || $code < 200 || $code >= 300) {
        throw new RuntimeException($err !== '' ? $err : 'HTTP '.$code);
    }

    $json = json_decode($body, true);
    if (! is_array($json)) {
        throw new RuntimeException('Bad JSON');
    }

    $status = $json['status'] ?? ($json['result']['status'] ?? null);
    if ((int) $status !== 1) {
        $errors = $json['errors'] ?? ($json['result']['errors'] ?? ['failed']);
        $message = is_array($errors) ? implode(' ', $errors) : (string) $errors;
        throw new RuntimeException($message !== '' ? $message : 'failed');
    }

    return $json;
}
