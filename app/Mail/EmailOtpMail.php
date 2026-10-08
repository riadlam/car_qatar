<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $code,
        public readonly int $expiresMinutes = 10,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your AL MAJD confirmation code',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.email-otp',
            with: [
                'code' => $this->code,
                'expiresMinutes' => $this->expiresMinutes,
            ],
        );
    }
}
