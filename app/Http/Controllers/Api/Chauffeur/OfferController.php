<?php

namespace App\Http\Controllers\Api\Chauffeur;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChauffeurOfferResource;
use App\Models\RideOffer;
use App\Services\Dispatch\DispatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function __construct(
        private readonly DispatchService $dispatch,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $chauffeur = $request->user()->chauffeur;

        if ($this->dispatch->hasOngoingTrip($chauffeur)) {
            $this->dispatch->syncChauffeur($chauffeur);

            return response()->json([
                'data' => [],
                'blocked' => true,
                'message' => 'Finish or cancel your current trip before taking another.',
            ]);
        }

        $this->dispatch->ensureOffersFor($chauffeur);

        $min = $request->query('min_payout');
        $max = $request->query('max_payout');

        $chauffeur = $chauffeur->fresh() ?? $chauffeur;
        $lat = $chauffeur->current_latitude !== null ? (float) $chauffeur->current_latitude : null;
        $lng = $chauffeur->current_longitude !== null ? (float) $chauffeur->current_longitude : null;
        $locationFresh = $lat !== null
            && $lng !== null
            && $chauffeur->last_location_at !== null
            && $chauffeur->last_location_at->gte(now()->subMinutes(DispatchService::LOCATION_MAX_AGE_MINUTES));

        $offers = RideOffer::query()
            ->where('chauffeur_id', $chauffeur->id)
            ->whereIn('status', ['pending', 'offered'])
            ->whereHas('booking', function ($query) use ($min, $max) {
                if (is_numeric($min) && (float) $min > 0) {
                    $query->where('total_amount', '>=', (float) $min);
                }
                if (is_numeric($max)) {
                    $query->where('total_amount', '<=', (float) $max);
                }
            })
            ->with([
                'booking.pickupLocation',
                'booking.dropoffLocation',
                'booking.vehicleClass',
                'booking.serviceType',
                'booking.guest',
                'booking.user',
                'booking.quote',
            ])
            ->orderByDesc('booking_id')
            ->get();

        $radiusEnabled = $this->dispatch->radiusMatchingEnabled();
        $radiusKm = $this->dispatch->radiusKm();

        // Hard filter: never return offers outside Super Admin radius, even if a stale
        // ride_offers row still exists from when matching was paused / GPS was off.
        if ($radiusEnabled) {
            $offers = $offers
                ->filter(function (RideOffer $offer) use ($chauffeur) {
                    $booking = $offer->booking;
                    if (! $booking) {
                        return false;
                    }

                    return $this->dispatch->chauffeurIsWithinOfferRadius($chauffeur, $booking);
                })
                ->values();
        }

        // Nearest pickup first (server-side distance from chauffeur → client pickup).
        if ($locationFresh) {
            $offers = $offers
                ->map(function (RideOffer $offer) use ($lat, $lng) {
                    $pickup = $offer->booking?->pickupLocation;
                    $distance = null;
                    if ($pickup?->latitude !== null && $pickup?->longitude !== null) {
                        $distance = round($this->dispatch->distanceKm(
                            $lat,
                            $lng,
                            (float) $pickup->latitude,
                            (float) $pickup->longitude,
                        ), 2);
                    }
                    $offer->setAttribute('distance_to_pickup_km', $distance);

                    return $offer;
                })
                ->filter(function (RideOffer $offer) use ($radiusEnabled, $radiusKm) {
                    if (! $radiusEnabled) {
                        return true;
                    }
                    $distance = $offer->distance_to_pickup_km;

                    return $distance !== null && $distance <= $radiusKm;
                })
                ->sortBy(fn (RideOffer $offer) => $offer->distance_to_pickup_km ?? PHP_FLOAT_MAX)
                ->values();
        } elseif ($radiusEnabled) {
            // Radius on + stale GPS ⇒ empty list (sync already withdrew DB rows).
            $offers = $offers->filter(fn () => false)->values();
        }

        $response = ChauffeurOfferResource::collection($offers)->response();
        $payload = $response->getData(true);
        $payload['meta'] = [
            'sorted_by' => $locationFresh ? 'nearest_pickup' : null,
            'location_required' => $this->dispatch->radiusMatchingEnabled(),
            'location_fresh' => $locationFresh,
            'radius_km' => $this->dispatch->radiusKm(),
            'message' => ! $locationFresh && $this->dispatch->radiusMatchingEnabled()
                ? 'Enable location so we can show rides nearest to you.'
                : null,
        ];

        return response()->json($payload);
    }

    public function accept(Request $request, RideOffer $offer): JsonResponse
    {
        $assignment = $this->dispatch->accept($offer, $request->user()->chauffeur);

        return response()->json([
            'message' => 'Offer accepted.',
            'assignment_id' => $assignment->id,
            'booking_id' => $assignment->booking_id,
        ]);
    }

    public function reject(Request $request, RideOffer $offer): JsonResponse
    {
        $this->dispatch->reject($offer, $request->user()->chauffeur);

        return response()->json([
            'message' => 'Offer declined.',
        ]);
    }
}
