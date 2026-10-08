<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CancelBookingRequest;
use App\Http\Requests\Api\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\BookingTrackResource;
use App\Models\Booking;
use App\Models\CancellationReason;
use App\Models\Quote;
use App\Services\Booking\BookingService;
use App\Services\Wallet\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookings,
        private readonly WalletService $wallets,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Booking::class);

        $user = $request->user();
        $query = Booking::query()
            ->with([
                'guest',
                'vehicleClass',
                'pickupLocation',
                'dropoffLocation',
                'priceItems',
                'serviceType',
                'seatAddon',
                'rideAssignment.chauffeur.user',
                'rideAssignment.vehicle',
                'cancellations.cancelledBy',
                'payments',
                'user',
                'paymentLinks',
                'review',
            ])
            ->orderByDesc('pickup_at');

        if ($user->role === \App\Enums\UserRole::PartnerAdmin) {
            $partnerIds = $user->partners()->pluck('partners.id');
            $query->whereIn('partner_id', $partnerIds);
        } else {
            $query->where('user_id', $user->id);
        }

        $bookings = $query->paginate(15);

        return response()->json([
            'data' => BookingResource::collection($bookings->getCollection())->resolve(),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
            'blocked' => false,
            'message' => null,
        ]);
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $data = $request->validated();
        $quote = Quote::query()->findOrFail($data['quote_id']);

        $booking = $this->bookings->convertQuoteToBooking(
            $request->user(),
            $quote,
            $data,
        );

        $paidWithWallet = false;
        if (! empty($data['pay_with_wallet'])) {
            $booking = $this->wallets->payBooking($request->user(), $booking);
            $paidWithWallet = true;
        }

        $payload = [
            'booking' => (new BookingResource($booking))->resolve(),
            'paid_with_wallet' => $paidWithWallet,
        ];

        if ($booking->partner_id && ! $paidWithWallet && $booking->payment_status?->value !== 'paid') {
            $link = $booking->paymentLinks->filter(fn ($l) => $l->isUsable())->sortByDesc('id')->first()
                ?? $booking->paymentLinks()->latest('id')->first();
            if ($link) {
                $payload['payment_link'] = [
                    'url' => app(\App\Services\Partners\BookingPaymentLinkService::class)->publicUrl($link),
                    'expires_at' => $link->expires_at?->toIso8601String(),
                ];
            }
        }

        if ($paidWithWallet) {
            $wallet = $this->wallets->ensureWallet($request->user())->fresh();
            $payload['wallet'] = [
                'balance' => (float) $wallet->balance,
                'currency' => $wallet->currency,
            ];
        }

        return response()->json($payload, 201);
    }

    public function show(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        $booking->load([
            'guest',
            'guests',
            'vehicleClass.amenities',
            'pickupLocation',
            'dropoffLocation',
            'priceItems',
            'serviceType',
            'seatAddon',
            'stops.location',
            'hourlyBooking',
            'payments',
            'rideEvents' => fn ($q) => $q->orderBy('recorded_at'),
            'rideAssignment.chauffeur.user',
            'rideAssignment.vehicle',
            'cancellations.cancelledBy',
            'user',
            'review',
        ]);

        return response()->json([
            'booking' => (new BookingResource($booking))->resolve(),
        ]);
    }

    public function track(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        $booking->load([
            'pickupLocation',
            'dropoffLocation',
            'rideAssignment.chauffeur.user',
            'rideAssignment.vehicle',
            'rideEvents' => fn ($q) => $q->orderByDesc('recorded_at')->limit(40),
        ]);

        return response()->json([
            'track' => (new BookingTrackResource($booking))->resolve(),
        ]);
    }

    public function cancel(CancelBookingRequest $request, Booking $booking): JsonResponse
    {
        $this->authorize('cancel', $booking);

        $reason = CancellationReason::snapshotFor(
            $request->user(),
            $request->validated('reason_id'),
            $request->validated('note'),
        );

        $booking = $this->bookings->cancelBooking(
            $request->user(),
            $booking,
            $reason,
        );

        return response()->json([
            'booking' => (new BookingResource($booking))->resolve(),
            'message' => 'Booking cancelled.',
        ]);
    }
}
