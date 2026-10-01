<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
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
        $wallet->load(['transactions' => fn ($q) => $q->latest('id')->limit(30)]);

        return response()->json([
            'data' => [
                'balance' => (float) $wallet->balance,
                'currency' => $wallet->currency,
                'status' => $wallet->status,
                'transactions' => $wallet->transactions->map(fn ($tx) => [
                    'id' => $tx->id,
                    'type' => $tx->type,
                    'amount' => (float) $tx->amount,
                    'balance_after' => (float) $tx->balance_after,
                    'currency' => $tx->currency,
                    'reason' => $tx->reason,
                    'note' => $tx->note,
                    'created_at' => $tx->created_at,
                ]),
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
}
