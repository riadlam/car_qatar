<?php

namespace App\Services\Partners;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\BookingPaymentLink;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BookingPaymentLinkService
{
    public const TTL_HOURS = 72;

    public function mint(Booking $booking, bool $revokeExisting = true): BookingPaymentLink
    {
        return DB::transaction(function () use ($booking, $revokeExisting) {
            if ($revokeExisting) {
                BookingPaymentLink::query()
                    ->where('booking_id', $booking->id)
                    ->whereNull('consumed_at')
                    ->whereNull('revoked_at')
                    ->update(['revoked_at' => now()]);
            }

            return BookingPaymentLink::query()->create([
                'booking_id' => $booking->id,
                'token' => $this->uniqueToken(),
                'expires_at' => now()->addHours(self::TTL_HOURS),
            ]);
        });
    }

    public function findUsable(string $token): BookingPaymentLink
    {
        $link = BookingPaymentLink::query()
            ->where('token', $token)
            ->with([
                'booking.guest',
                'booking.pickupLocation',
                'booking.dropoffLocation',
                'booking.vehicleClass',
                'booking.serviceType',
            ])
            ->first();

        if (! $link || ! $link->isUsable()) {
            throw ValidationException::withMessages([
                'token' => ['This payment link is invalid or has expired.'],
            ]);
        }

        $booking = $link->booking;
        if (! $booking || $booking->status !== BookingStatus::PendingPayment) {
            throw ValidationException::withMessages([
                'token' => ['This booking is no longer awaiting payment.'],
            ]);
        }

        return $link;
    }

    /**
     * Secure guest confirm until a PSP is connected. Consumes the link and confirms the booking.
     */
    public function confirmWithoutCharge(BookingPaymentLink $link): Booking
    {
        return DB::transaction(function () use ($link) {
            $locked = BookingPaymentLink::query()->whereKey($link->id)->lockForUpdate()->firstOrFail();

            if (! $locked->isUsable()) {
                throw ValidationException::withMessages([
                    'token' => ['This payment link is invalid or has expired.'],
                ]);
            }

            $booking = Booking::query()->whereKey($locked->booking_id)->lockForUpdate()->firstOrFail();

            if ($booking->status !== BookingStatus::PendingPayment) {
                throw ValidationException::withMessages([
                    'token' => ['This booking is no longer awaiting payment.'],
                ]);
            }

            $locked->forceFill(['consumed_at' => now()])->save();

            $billing = $booking->billing ?? [];
            $billing['payment_note'] = 'awaiting_psp';
            $billing['guest_confirmed_at'] = now()->toIso8601String();

            $booking->forceFill([
                'status' => BookingStatus::Confirmed,
                'payment_status' => PaymentStatus::Authorized,
                'billing' => $billing,
            ])->save();

            $fresh = $booking->fresh([
                'guest',
                'pickupLocation',
                'dropoffLocation',
                'vehicleClass',
                'serviceType',
            ]);

            app(\App\Services\Dispatch\DispatchService::class)->syncBooking($fresh);

            return $fresh;
        });
    }

    public function publicUrl(BookingPaymentLink $link): string
    {
        return rtrim((string) config('app.url'), '/').'/pay/'.$link->token;
    }

    private function uniqueToken(): string
    {
        do {
            $token = Str::random(64);
        } while (BookingPaymentLink::query()->where('token', $token)->exists());

        return $token;
    }
}
