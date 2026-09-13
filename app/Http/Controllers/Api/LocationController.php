<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ResolveLocationRequest;
use App\Http\Resources\LocationResource;
use App\Services\Booking\BookingService;
use App\Services\Maps\MapboxGeocodingService;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    public function __construct(
        private readonly BookingService $bookings,
        private readonly MapboxGeocodingService $mapbox,
    ) {}

    public function resolve(ResolveLocationRequest $request): JsonResponse
    {
        $input = $this->mapbox->enrichResolveInput($request->validated());
        $location = $this->bookings->resolveOrCreateLocation($input);

        return response()->json([
            'data' => (new LocationResource($location))->resolve(),
        ]);
    }
}
