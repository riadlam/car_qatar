<?php

namespace App\Services\Wallet;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingPaymentLink;
use App\Models\Payment;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\Dispatch\DispatchService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class WalletService
{
    public function __construct(
        private readonly DispatchService $dispatch,
    ) {}

    public function ensureWallet(User $user, string $currency = 'QAR'): Wallet
    {
        return Wallet::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'currency' => strtoupper($currency),
                'status' => 'active',
            ],
        );
    }

    /**
     * Admin credit — amount must come from trusted admin input only.
     */
    public function credit(
        User $target,
        float $amount,
        User $admin,
        string $note = '',
        string $reason = 'admin_credit',
        ?string $idempotencyKey = null,
    ): WalletTransaction {
        $amount = round($amount, 2);
        if ($amount <= 0) {
            throw ValidationException::withMessages([
                'amount' => ['Credit amount must be greater than zero.'],
            ]);
        }

        if (! $admin->role?->canAccessAdmin()) {
            throw ValidationException::withMessages([
                'amount' => ['Only staff can credit wallets.'],
            ]);
        }

        if (! in_array($target->role, [UserRole::Customer, UserRole::PartnerAdmin], true)) {
            throw ValidationException::withMessages([
                'user_id' => ['Wallets are only for customers and partners.'],
            ]);
        }

        return DB::transaction(function () use ($target, $amount, $admin, $note, $reason, $idempotencyKey) {
            if ($idempotencyKey) {
                $existing = WalletTransaction::query()->where('idempotency_key', $idempotencyKey)->first();
                if ($existing) {
                    return $existing;
                }
            }

            $wallet = $this->ensureWallet($target);
            $wallet = Wallet::query()->whereKey($wallet->id)->lockForUpdate()->firstOrFail();

            if (! $wallet->isActive()) {
                throw ValidationException::withMessages([
                    'wallet' => ['This wallet is frozen.'],
                ]);
            }

            $balance = round((float) $wallet->balance + $amount, 2);
            $wallet->forceFill(['balance' => $balance])->save();

            $tx = new WalletTransaction([
                'wallet_id' => $wallet->id,
                'type' => 'credit',
                'currency' => $wallet->currency,
                'reason' => $reason,
                'created_by' => $admin->id,
                'note' => $note !== '' ? $note : null,
                'idempotency_key' => $idempotencyKey,
            ]);
            $tx->forceFill([
                'amount' => $amount,
                'balance_after' => $balance,
            ])->save();

            return $tx->fresh(['wallet', 'createdBy']);
        });
    }

    /**
     * Pay a booking from the authenticated user's wallet.
     * Amount is ALWAYS taken from booking.total_amount (never from the client).
     */
    public function payBooking(User $payer, Booking $booking, ?string $idempotencyKey = null): Booking
    {
        return DB::transaction(function () use ($payer, $booking, $idempotencyKey) {
            $booking = Booking::query()->whereKey($booking->id)->lockForUpdate()->firstOrFail();

            $this->assertPayerOwnsBooking($payer, $booking);

            if ($booking->payment_status === PaymentStatus::Paid) {
                return $booking->fresh(['payments', 'guest', 'partner']);
            }

            $payableStatuses = [
                BookingStatus::PendingPayment,
                BookingStatus::Confirmed,
                BookingStatus::ChauffeurAssigned,
            ];
            if (! in_array($booking->status, $payableStatuses, true)) {
                throw ValidationException::withMessages([
                    'booking' => ['This booking cannot be paid with wallet in its current status.'],
                ]);
            }

            $amount = round((float) $booking->total_amount, 2);
            if ($amount <= 0) {
                throw ValidationException::withMessages([
                    'booking' => ['Booking total is invalid.'],
                ]);
            }

            $key = $idempotencyKey ?: 'booking-pay-'.$booking->id;
            $existing = WalletTransaction::query()->where('idempotency_key', $key)->first();
            if ($existing) {
                return $booking->fresh(['payments', 'guest', 'partner']);
            }

            $wallet = $this->ensureWallet($payer, $booking->currency ?: 'QAR');
            $wallet = Wallet::query()->whereKey($wallet->id)->lockForUpdate()->firstOrFail();

            if (! $wallet->isActive()) {
                throw ValidationException::withMessages([
                    'wallet' => ['Your wallet is frozen. Contact support.'],
                ]);
            }

            if (strcasecmp((string) $wallet->currency, (string) $booking->currency) !== 0) {
                throw ValidationException::withMessages([
                    'wallet' => ['Wallet currency does not match this booking.'],
                ]);
            }

            $balance = round((float) $wallet->balance, 2);
            if ($balance < $amount) {
                throw ValidationException::withMessages([
                    'wallet' => [
                        sprintf(
                            'Insufficient wallet balance. Need %s %.2f, available %.2f.',
                            $booking->currency,
                            $amount,
                            $balance,
                        ),
                    ],
                ]);
            }

            $newBalance = round($balance - $amount, 2);
            $wallet->forceFill(['balance' => $newBalance])->save();

            $tx = new WalletTransaction([
                'wallet_id' => $wallet->id,
                'type' => 'debit',
                'currency' => $wallet->currency,
                'reason' => 'booking_payment',
                'reference_type' => Booking::class,
                'reference_id' => $booking->id,
                'created_by' => $payer->id,
                'note' => 'Payment for booking '.$booking->booking_number,
                'idempotency_key' => $key,
                'metadata' => [
                    'booking_number' => $booking->booking_number,
                    'booking_total' => $amount,
                ],
            ]);
            $tx->forceFill([
                'amount' => $amount,
                'balance_after' => $newBalance,
            ])->save();

            $payment = new Payment([
                'booking_id' => $booking->id,
                'user_id' => $payer->id,
                'currency' => $booking->currency,
                'method' => 'wallet',
                'provider' => 'wallet',
                'provider_payment_id' => 'WTX-'.$tx->id,
                'paid_at' => now(),
                'metadata' => [
                    'wallet_transaction_id' => $tx->id,
                    'wallet_id' => $wallet->id,
                ],
            ]);
            $payment->forceFill([
                'amount' => $amount,
                'status' => PaymentStatus::Paid,
            ])->save();

            $wasPendingPayment = $booking->status === BookingStatus::PendingPayment;

            $booking->forceFill([
                'payment_status' => PaymentStatus::Paid,
                'status' => $wasPendingPayment ? BookingStatus::Confirmed : $booking->status,
            ])->save();

            BookingPaymentLink::query()
                ->where('booking_id', $booking->id)
                ->whereNull('consumed_at')
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);

            $fresh = $booking->fresh([
                'payments',
                'guest',
                'guests',
                'vehicleClass',
                'pickupLocation',
                'dropoffLocation',
                'priceItems',
                'serviceType',
                'partner',
                'paymentLinks',
            ]);

            if ($wasPendingPayment) {
                $this->dispatch->syncBooking($fresh);
            }

            return $fresh;
        });
    }

    public function canPayBooking(User $payer, Booking $booking): bool
    {
        try {
            $this->assertPayerOwnsBooking($payer, $booking);
        } catch (ValidationException) {
            return false;
        }

        if ($booking->payment_status === PaymentStatus::Paid) {
            return false;
        }

        $wallet = Wallet::query()->where('user_id', $payer->id)->first();
        if (! $wallet || ! $wallet->isActive()) {
            return false;
        }

        if (strcasecmp((string) $wallet->currency, (string) $booking->currency) !== 0) {
            return false;
        }

        return round((float) $wallet->balance, 2) >= round((float) $booking->total_amount, 2);
    }

    private function assertPayerOwnsBooking(User $payer, Booking $booking): void
    {
        if ((int) $booking->user_id === (int) $payer->id) {
            return;
        }

        if ((int) $booking->booked_by_user_id === (int) $payer->id) {
            return;
        }

        if (
            $payer->role === UserRole::PartnerAdmin
            && $booking->partner_id
            && $payer->partners()->where('partners.id', $booking->partner_id)->exists()
        ) {
            return;
        }

        throw ValidationException::withMessages([
            'booking' => ['You cannot pay this booking from your wallet.'],
        ]);
    }

    /**
     * Admin-only balance decrease (corrections). Prefer refunds for bookings.
     */
    public function adminDebit(
        User $target,
        float $amount,
        User $admin,
        string $note,
    ): WalletTransaction {
        $amount = round($amount, 2);
        if ($amount <= 0) {
            throw new InvalidArgumentException('Amount must be positive.');
        }
        if (! $admin->role?->canAccessAdmin()) {
            throw ValidationException::withMessages(['amount' => ['Only staff can adjust wallets.']]);
        }
        if (trim($note) === '') {
            throw ValidationException::withMessages(['note' => ['A note is required for admin debits.']]);
        }

        return DB::transaction(function () use ($target, $amount, $admin, $note) {
            $wallet = $this->ensureWallet($target);
            $wallet = Wallet::query()->whereKey($wallet->id)->lockForUpdate()->firstOrFail();
            $balance = round((float) $wallet->balance, 2);
            if ($balance < $amount) {
                throw ValidationException::withMessages([
                    'amount' => ['Insufficient balance for this adjustment.'],
                ]);
            }
            $newBalance = round($balance - $amount, 2);
            $wallet->forceFill(['balance' => $newBalance])->save();

            $tx = new WalletTransaction([
                'wallet_id' => $wallet->id,
                'type' => 'debit',
                'currency' => $wallet->currency,
                'reason' => 'admin_adjustment',
                'created_by' => $admin->id,
                'note' => $note,
            ]);
            $tx->forceFill([
                'amount' => $amount,
                'balance_after' => $newBalance,
            ])->save();

            return $tx->fresh();
        });
    }
}
