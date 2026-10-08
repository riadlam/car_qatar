<?php
/**
 * Upload this file to Octenium cPanel → File Manager → public_html
 * Suggested path: public_html/mail-bridge.php (or the bridge subdomain docroot)
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
const SMTP_HOST = '127.0.0.1';
const SMTP_PORT = 465;
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

    if ($action === 'add_pop' || $action === 'passwd_pop') {
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $password = (string) ($body['password'] ?? '');
        $email = preg_replace('/@.*$/', '', $email) ?: '';
        $email = preg_replace('/[^a-z0-9._+-]/', '', $email) ?: '';

        if ($email === '') {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Username is required.']);
            exit;
        }
        if (strlen($password) < 10
            || ! preg_match('/[a-z]/', $password)
            || ! preg_match('/[A-Z]/', $password)
            || ! preg_match('/[0-9]/', $password)
            || ! preg_match('/[^A-Za-z0-9]/', $password)
        ) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Password must be at least 10 characters and include uppercase, lowercase, a number, and a symbol.']);
            exit;
        }
        if (str_contains(strtolower($password), $email)) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Password must not contain the username.']);
            exit;
        }

        $function = $action === 'add_pop' ? 'add_pop' : 'passwd_pop';
        $params = [
            'email' => $email,
            'password' => $password,
            'domain' => EMAIL_DOMAIN,
        ];
        if ($action === 'add_pop') {
            $params['quota'] = 0;
        }

        $payload = uapi('Email', $function, $params);
        echo json_encode(['ok' => true, 'payload' => $payload]);
        exit;
    }

    if ($action === 'send_mail') {
        $to = strtolower(trim((string) ($body['to'] ?? '')));
        $subject = trim((string) ($body['subject'] ?? ''));
        $html = (string) ($body['html'] ?? '');
        $text = (string) ($body['text'] ?? '');
        $fromEmail = strtolower(trim((string) ($body['from_email'] ?? '')));
        $fromName = trim((string) ($body['from_name'] ?? 'AL MAJD'));
        $smtpUser = trim((string) ($body['smtp_username'] ?? $fromEmail));
        $smtpPass = (string) ($body['smtp_password'] ?? '');

        if ($to === '' || ! filter_var($to, FILTER_VALIDATE_EMAIL)) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Valid recipient email is required.']);
            exit;
        }
        if ($fromEmail === '' || ! filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Valid from email is required.']);
            exit;
        }
        if ($subject === '' || ($html === '' && $text === '')) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Subject and body are required.']);
            exit;
        }
        if ($smtpUser === '' || $smtpPass === '') {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'SMTP credentials are required.']);
            exit;
        }

        sendSmtpMail([
            'to' => $to,
            'subject' => $subject,
            'html' => $html,
            'text' => $text !== '' ? $text : strip_tags($html),
            'from_email' => $fromEmail,
            'from_name' => $fromName !== '' ? $fromName : 'AL MAJD',
            'smtp_username' => $smtpUser,
            'smtp_password' => $smtpPass,
        ]);

        echo json_encode(['ok' => true, 'payload' => ['status' => 1, 'data' => ['sent' => true]]]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Unknown action']);
} catch (Throwable $e) {
    $message = trim((string) $e->getMessage());
    $message = preg_replace('/cpanel|whm|server|hosting|127\.0\.0\.1|:2083|octenium|quantum/i', 'mail service', $message) ?: $message;
    if ($message === '' || preg_match('/curl|ssl|http\s*\d+/i', $message)) {
        $message = 'The mail service rejected this request. Check the username/password and try again.';
    }
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => $message]);
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

/**
 * Send one email via local SMTPS (SSL 465) on the mail host.
 *
 * @param  array{
 *   to: string,
 *   subject: string,
 *   html: string,
 *   text: string,
 *   from_email: string,
 *   from_name: string,
 *   smtp_username: string,
 *   smtp_password: string
 * }  $mail
 */
function sendSmtpMail(array $mail): void
{
    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client(
        'ssl://'.SMTP_HOST.':'.SMTP_PORT,
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT,
        stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ])
    );

    if ($socket === false) {
        throw new RuntimeException('Unable to open local SMTP ('.$errstr.')');
    }

    stream_set_timeout($socket, 20);

    try {
        smtpExpect($socket, [220]);
        smtpCommand($socket, 'EHLO almajdluxurytransport.com', [250]);
        smtpCommand($socket, 'AUTH LOGIN', [334]);
        smtpCommand($socket, base64_encode($mail['smtp_username']), [334]);
        smtpCommand($socket, base64_encode($mail['smtp_password']), [235]);

        smtpCommand($socket, 'MAIL FROM:<'.$mail['from_email'].'>', [250]);
        smtpCommand($socket, 'RCPT TO:<'.$mail['to'].'>', [250, 251]);
        smtpCommand($socket, 'DATA', [354]);

        $boundary = 'b_'.bin2hex(random_bytes(12));
        $fromName = addcslashes($mail['from_name'], '"\\');
        $subject = smtpEncodeHeader($mail['subject']);

        $data = [
            'From: "'.$fromName.'" <'.$mail['from_email'].'>',
            'To: <'.$mail['to'].'>',
            'Subject: '.$subject,
            'MIME-Version: 1.0',
            'Content-Type: multipart/alternative; boundary="'.$boundary.'"',
            'Date: '.date('r'),
            'Message-ID: <'.bin2hex(random_bytes(16)).'@'.EMAIL_DOMAIN.'>',
            '',
            '--'.$boundary,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($mail['text'])),
            '--'.$boundary,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($mail['html'])),
            '--'.$boundary.'--',
            '',
        ];

        $payload = implode("\r\n", $data);
        // Dot-stuff lines that start with '.'
        $payload = preg_replace('/^\./m', '..', $payload) ?: $payload;
        fwrite($socket, $payload."\r\n.\r\n");
        smtpExpect($socket, [250]);
        smtpCommand($socket, 'QUIT', [221, 250]);
    } finally {
        fclose($socket);
    }
}

/**
 * @param  resource  $socket
 * @param  list<int>  $okCodes
 */
function smtpCommand($socket, string $command, array $okCodes): void
{
    fwrite($socket, $command."\r\n");
    smtpExpect($socket, $okCodes);
}

/**
 * @param  resource  $socket
 * @param  list<int>  $okCodes
 */
function smtpExpect($socket, array $okCodes): void
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }

    $code = (int) substr($response, 0, 3);
    if (! in_array($code, $okCodes, true)) {
        $snippet = trim(preg_replace('/\s+/', ' ', $response) ?: 'SMTP error');
        throw new RuntimeException('SMTP '.$snippet);
    }
}

function smtpEncodeHeader(string $value): string
{
    if (preg_match('/^[\x20-\x7E]+$/', $value)) {
        return $value;
    }

    return '=?UTF-8?B?'.base64_encode($value).'?=';
}
