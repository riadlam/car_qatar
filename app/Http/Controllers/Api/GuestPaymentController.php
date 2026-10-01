<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GuestPaymentBookingResource;
use App\Services\Partners\BookingPaymentLinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuestPaymentController extends Controller
{
    public function __construct(
        private readonly BookingPaymentLinkService $links,
    ) {}

    public function show(string $token): JsonResponse
    {
        $link = $this->links->findUsable($token);
        $booking = $link->booking;

        return response()->json([
            'data' => (new GuestPaymentBookingResource($booking))->resolve(),
            'expires_at' => $link->expires_at?->toIso8601String(),
        ]);
    }

    public function confirm(Request $request, string $token): JsonResponse
    {
        $link = $this->links->findUsable($token);
        $booking = $this->links->confirmWithoutCharge($link);

        return response()->json([
            'message' => 'Booking confirmed. Payment will be processed when online payments are enabled.',
            'data' => (new GuestPaymentBookingResource($booking))->resolve(),
        ]);
    }
}
