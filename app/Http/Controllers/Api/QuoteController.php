<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreQuoteRequest;
use App\Http\Resources\QuoteResource;
use App\Models\Quote;
use App\Services\Booking\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class QuoteController extends Controller
{
    public function __construct(
        private readonly BookingService $bookings,
    ) {}

    public function store(StoreQuoteRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = Auth::guard('sanctum')->user();

        if (! empty($data['vehicle_class_id']) || ! empty($data['vehicle_class'])) {
            $quote = $this->bookings->createQuote($user, $data);

            return response()->json([
                'quote' => (new QuoteResource($quote))->resolve(),
            ], 201);
        }

        $quotes = $this->bookings->createQuotesForAllClasses($user, $data);

        return response()->json([
            'quotes' => QuoteResource::collection($quotes)->resolve(),
            'options' => QuoteResource::collection($quotes)->resolve(),
        ], 201);
    }

    public function show(Quote $quote): JsonResponse
    {
        $this->authorize('view', $quote);

        $quote->load([
            'items',
            'vehicleClass.amenities',
            'vehicleClass.media',
            'serviceType',
            'pickupLocation',
            'dropoffLocation',
            'gulfDestination',
        ]);

        return response()->json([
            'quote' => (new QuoteResource($quote))->resolve(),
        ]);
    }
}
