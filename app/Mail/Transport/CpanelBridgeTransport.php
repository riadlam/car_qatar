<?php

namespace App\Mail\Transport;

use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\MessageConverter;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class CpanelBridgeTransport extends AbstractTransport
{
    public function __construct(
        private readonly string $bridgeUrl,
        private readonly string $bridgeSecret,
        private readonly string $smtpUsername,
        private readonly string $smtpPassword,
        private readonly string $fromEmail,
        private readonly string $fromName,
    ) {
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());

        $to = collect($email->getTo())
            ->map(fn (Address $address) => $address->getAddress())
            ->filter()
            ->first();

        if (! is_string($to) || $to === '') {
            throw new RuntimeException('OTP mail is missing a recipient.');
        }

        $from = $email->getFrom()[0] ?? null;
        $fromEmail = $from?->getAddress() ?: $this->fromEmail;
        $fromName = $from?->getName() ?: $this->fromName;

        $html = $email->getHtmlBody();
        $text = $email->getTextBody();
        if (! is_string($html)) {
            $html = '';
        }
        if (! is_string($text)) {
            $text = '';
        }
        if ($html === '' && $text === '') {
            throw new RuntimeException('OTP mail body is empty.');
        }

        try {
            $response = Http::withHeaders([
                'X-Bridge-Secret' => $this->bridgeSecret,
                'Accept' => 'application/json',
            ])
                ->acceptJson()
                ->connectTimeout(8)
                ->timeout(30)
                ->post($this->bridgeUrl, [
                    'action' => 'send_mail',
                    'to' => $to,
                    'subject' => $email->getSubject() ?: 'AL MAJD',
                    'html' => $html !== '' ? $html : nl2br(e($text)),
                    'text' => $text !== '' ? $text : trim(html_entity_decode(strip_tags($html))),
                    'from_email' => $fromEmail,
                    'from_name' => $fromName,
                    'smtp_username' => $this->smtpUsername,
                    'smtp_password' => $this->smtpPassword,
                ]);
        } catch (Throwable) {
            throw new RuntimeException('Unable to reach the mail bridge.');
        }

        $json = $response->json();
        if (! $response->successful() || ! is_array($json) || empty($json['ok'])) {
            $error = is_array($json) ? trim((string) ($json['error'] ?? '')) : '';
            throw new RuntimeException($error !== '' ? $error : 'Mail bridge rejected the message.');
        }
    }

    public function __toString(): string
    {
        return 'cpanel-bridge';
    }
}
