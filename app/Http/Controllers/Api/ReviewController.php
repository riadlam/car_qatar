<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreReviewRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\Reviews\ReviewService;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviews,
    ) {}

    public function store(StoreReviewRequest $request, Booking $booking): JsonResponse
    {
        $this->authorize('review', $booking);

        $booking->loadMissing('rideAssignment');
        $review = $this->reviews->submit($request->user(), $booking, $request->validated());

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
            'message' => __('api.review.submitted'),
            'review' => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at,
            ],
            'booking' => (new BookingResource($booking))->resolve(),
        ], 201);
    }
}
