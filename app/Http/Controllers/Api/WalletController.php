<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\WalletTransaction;
use App\Services\Wallet\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function __construct(
        private readonly WalletService $wallets,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $wallet = $this->wallets->ensureWallet($user);
        $wallet->load(['transactions' => fn ($q) => $q->latest('id')->limit(10)]);

        return response()->json([
            'data' => [
                'balance' => (float) $wallet->balance,
                'currency' => $wallet->currency,
                'status' => $wallet->status,
                'transactions' => $wallet->transactions->map(fn ($tx) => $this->serializeTransaction($tx))->values(),
            ],
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['nullable', 'in:credit,debit'],
            'reason' => ['nullable', 'string', 'max:80'],
            'per_page' => ['nullable', 'integer', 'min:5', 'max:50'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $wallet = $this->wallets->ensureWallet($request->user());
        $perPage = (int) ($data['per_page'] ?? 20);

        $query = WalletTransaction::query()
            ->where('wallet_id', $wallet->id)
            ->latest('id');

        if (! empty($data['type'])) {
            $query->where('type', $data['type']);
        }
        if (! empty($data['reason'])) {
            $query->where('reason', $data['reason']);
        }

        $page = $query->paginate($perPage);

        return response()->json([
            'data' => collect($page->items())->map(fn ($tx) => $this->serializeTransaction($tx))->values(),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
                'balance' => (float) $wallet->balance,
                'currency' => $wallet->currency,
                'status' => $wallet->status,
            ],
        ]);
    }

    public function payBooking(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        // Amount is never taken from the request — only a confirm flag.
        $request->validate([
            'confirm' => ['required', 'accepted'],
            'amount' => ['prohibited'],
            'total' => ['prohibited'],
            'total_amount' => ['prohibited'],
        ]);

        $booking = $this->wallets->payBooking($request->user(), $booking);

        return response()->json([
            'message' => 'Booking paid with wallet.',
            'booking' => (new BookingResource($booking))->resolve(),
            'wallet' => [
                'balance' => (float) $this->wallets->ensureWallet($request->user())->fresh()->balance,
                'currency' => $this->wallets->ensureWallet($request->user())->currency,
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeTransaction(WalletTransaction $tx): array
    {
        return [
            'id' => $tx->id,
            'type' => $tx->type,
            'amount' => (float) $tx->amount,
            'balance_after' => (float) $tx->balance_after,
            'currency' => $tx->currency,
            'reason' => $tx->reason,
            'reason_label' => $this->reasonLabel($tx->reason, $tx->type),
            'note' => $tx->note,
            'created_at' => $tx->created_at,
        ];
    }

    private function reasonLabel(?string $reason, ?string $type): string
    {
        return match ($reason) {
            'admin_credit' => 'Funds added by AL MAJD',
            'booking_payment' => 'Trip payment',
            'admin_adjustment' => 'Balance adjustment',
            'refund' => 'Refund',
            default => $type === 'credit' ? 'Credit' : ($type === 'debit' ? 'Debit' : 'Transaction'),
        };
    }
}
