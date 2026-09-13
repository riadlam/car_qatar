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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookings,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Booking::class);

        $bookings = Booking::query()
            ->where('user_id', $request->user()->id)
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
            ])
            ->orderByDesc('pickup_at')
            ->paginate(15);

        $blocked = $this->bookings->hasOpenBooking($request->user());

        return response()->json([
            'data' => BookingResource::collection($bookings->getCollection())->resolve(),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
            ],
            'blocked' => $blocked,
            'message' => $blocked ? BookingService::OPEN_BOOKING_MESSAGE : null,
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

        return response()->json([
            'booking' => (new BookingResource($booking))->resolve(),
        ], 201);
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
