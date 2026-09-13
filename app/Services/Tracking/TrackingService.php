<?php

namespace App\Services\Tracking;

use App\Models\Booking;
use App\Models\Chauffeur;
use App\Models\Location;
use App\Models\RideAssignment;

class TrackingService
{
    public const ARRIVAL_METERS = 5;

    /** Far enough to count as real movement, not GPS jitter. */
    public const MOVE_METERS = 8;

    /** Ignore tiny noise. A parked van must not stream. */
    public const JITTER_METERS = 3;

    /** Fastest a moving van may update the live map. */
    public const LIVE_MIN_SECONDS = 1;

    /**
     * Rough road ETA from haversine distance at ~35 km/h average city speed.
     */
    public function estimateEtaMinutes(?float $fromLat, ?float $fromLng, ?float $toLat, ?float $toLng): ?int
    {
        if ($fromLat === null || $fromLng === null || $toLat === null || $toLng === null) {
            return null;
        }

        $km = $this->haversineKm($fromLat, $fromLng, $toLat, $toLng);
        if ($km <= 0) {
            return 1;
        }

        return max(1, (int) round(($km / 35) * 60));
    }

    public function haversineKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earth = 6371.0;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return 2 * $earth * asin(min(1, sqrt($a)));
    }

    public function metersBetween(?float $lat1, ?float $lng1, ?float $lat2, ?float $lng2): ?float
    {
        if ($lat1 === null || $lng1 === null || $lat2 === null || $lng2 === null) {
            return null;
        }

        return $this->haversineKm($lat1, $lng1, $lat2, $lng2) * 1000;
    }

    /**
     * Accept a GPS fix only when the van actually moved, or when this fix can advance the trip.
     */
    public function shouldAcceptFix(
        Chauffeur $chauffeur,
        float $lat,
        float $lng,
        ?float $pickupLat,
        ?float $pickupLng,
        ?float $dropoffLat,
        ?float $dropoffLng,
        ?string $status,
    ): bool {
        if ($chauffeur->current_latitude === null || $chauffeur->current_longitude === null) {
            return true;
        }

        $moved = $this->metersBetween(
            (float) $chauffeur->current_latitude,
            (float) $chauffeur->current_longitude,
            $lat,
            $lng,
        );

        if (in_array($status, ['assigned', 'en_route'], true) && $this->withinMeters($lat, $lng, $pickupLat, $pickupLng)) {
            return true;
        }

        if ($status === 'in_progress' && $this->withinMeters($lat, $lng, $dropoffLat, $dropoffLng)) {
            return true;
        }

        if ($moved === null || $moved < self::JITTER_METERS) {
            return false;
        }

        if ($moved >= self::MOVE_METERS) {
            return true;
        }

        return $chauffeur->last_location_at === null
            || $chauffeur->last_location_at->lte(now()->subSeconds(self::LIVE_MIN_SECONDS));
    }

    public function withinMeters(?float $lat1, ?float $lng1, ?float $lat2, ?float $lng2, float $meters = self::ARRIVAL_METERS): bool
    {
        $distance = $this->metersBetween($lat1, $lng1, $lat2, $lng2);

        return $distance !== null && $distance <= $meters;
    }

    public function dropoffPoint(Booking $booking): ?Location
    {
        $dropoff = $booking->relationLoaded('dropoffLocation')
            ? $booking->dropoffLocation
            : $booking->dropoffLocation()->first();

        if ($dropoff?->latitude !== null && $dropoff?->longitude !== null) {
            return $dropoff;
        }

        $booking->loadMissing('stops.location');
        $stop = $booking->stops->sortByDesc('sequence')->first();

        return $stop?->location;
    }

    /**
     * waiting | to_pickup | to_dropoff
     */
    public function tripStep(Booking $booking, ?RideAssignment $assignment, ?float $carLat = null, ?float $carLng = null): string
    {
        $status = $assignment?->status;
        if (! $assignment || ! in_array($status, ['assigned', 'en_route', 'arrived', 'in_progress'], true)) {
            return 'waiting';
        }

        if (in_array($status, ['arrived', 'in_progress'], true)) {
            return 'to_dropoff';
        }

        $pickup = $booking->relationLoaded('pickupLocation')
            ? $booking->pickupLocation
            : $booking->pickupLocation()->first();

        if ($this->withinMeters(
            $carLat,
            $carLng,
            $pickup?->latitude !== null ? (float) $pickup->latitude : null,
            $pickup?->longitude !== null ? (float) $pickup->longitude : null,
        )) {
            return 'to_dropoff';
        }

        return 'to_pickup';
    }

    /**
     * @return array{trip_step: string, service_type: ?string, chauffeur_id: ?int, chauffeur_latitude: ?float, chauffeur_longitude: ?float, distance_to_pickup_m: ?int}
     */
    public function cancelSnapshot(Booking $booking): array
    {
        $booking->loadMissing(['pickupLocation', 'dropoffLocation', 'serviceType', 'rideAssignment.chauffeur']);
        $assignment = $booking->rideAssignment;
        $chauffeur = $assignment?->chauffeur;
        $carLat = $chauffeur?->current_latitude !== null ? (float) $chauffeur->current_latitude : null;
        $carLng = $chauffeur?->current_longitude !== null ? (float) $chauffeur->current_longitude : null;
        $pickup = $booking->pickupLocation;
        $meters = $this->metersBetween(
            $carLat,
            $carLng,
            $pickup?->latitude !== null ? (float) $pickup->latitude : null,
            $pickup?->longitude !== null ? (float) $pickup->longitude : null,
        );

        return [
            'trip_step' => $this->tripStep($booking, $assignment, $carLat, $carLng),
            'service_type' => $booking->serviceType?->name,
            'chauffeur_id' => $chauffeur?->id,
            'chauffeur_latitude' => $carLat,
            'chauffeur_longitude' => $carLng,
            'distance_to_pickup_m' => $meters !== null ? (int) round($meters) : null,
        ];
    }

    /**
     * Progress 0–1 from chauffeur toward current target (pickup if en_route, else dropoff).
     */
    public function routeProgress(Booking $booking, ?Chauffeur $chauffeur, ?RideAssignment $assignment): ?float
    {
        if (! $chauffeur?->current_latitude || ! $chauffeur?->current_longitude) {
            return null;
        }

        $pickup = $booking->pickupLocation;
        $dropoff = $booking->dropoffLocation;
        $status = $assignment?->status;

        $target = in_array($status, ['in_progress', 'arrived'], true) && $dropoff
            ? $dropoff
            : $pickup;

        if (! $target?->latitude || ! $target?->longitude) {
            return null;
        }

        $origin = $status === 'in_progress' && $pickup?->latitude
            ? $pickup
            : null;

        $carLat = (float) $chauffeur->current_latitude;
        $carLng = (float) $chauffeur->current_longitude;
        $toLat = (float) $target->latitude;
        $toLng = (float) $target->longitude;

        if ($origin?->latitude && $origin?->longitude) {
            $total = $this->haversineKm(
                (float) $origin->latitude,
                (float) $origin->longitude,
                $toLat,
                $toLng,
            );
            $remaining = $this->haversineKm($carLat, $carLng, $toLat, $toLng);
            if ($total <= 0.01) {
                return 0.5;
            }

            return max(0.05, min(0.95, 1 - ($remaining / $total)));
        }

        // En route to pickup: invent a soft progress from remaining distance (cap 25 km → ~0.1)
        $remaining = $this->haversineKm($carLat, $carLng, $toLat, $toLng);

        return max(0.08, min(0.85, 1 - min(1, $remaining / 25)));
    }

    public function targetLocation(Booking $booking, ?RideAssignment $assignment): ?Location
    {
        $status = $assignment?->status;
        if (in_array($status, ['in_progress'], true)) {
            return $booking->dropoffLocation;
        }

        return $booking->pickupLocation;
    }

    public function refreshAssignmentEta(RideAssignment $assignment, Booking $booking, Chauffeur $chauffeur): void
    {
        $target = $this->targetLocation($booking, $assignment);
        $minutes = $this->estimateEtaMinutes(
            $chauffeur->current_latitude !== null ? (float) $chauffeur->current_latitude : null,
            $chauffeur->current_longitude !== null ? (float) $chauffeur->current_longitude : null,
            $target?->latitude !== null ? (float) $target->latitude : null,
            $target?->longitude !== null ? (float) $target->longitude : null,
        );

        if ($minutes === null) {
            return;
        }

        $assignment->forceFill([
            'eta_minutes' => $minutes,
            'eta_at' => now()->addMinutes($minutes),
        ])->save();
    }

    /**
     * Map assignment / booking status → UI phase id used by the track timeline.
     */
    public function phaseFor(?RideAssignment $assignment, string $bookingStatus): string
    {
        if ($bookingStatus === 'cancelled') {
            return 'cancelled';
        }
        if ($bookingStatus === 'completed' || $assignment?->status === 'completed') {
            return 'completed';
        }

        return match ($assignment?->status) {
            'en_route', 'arrived', 'in_progress' => 'upcoming_soon',
            'assigned' => 'chauffeur_assigned',
            default => match ($bookingStatus) {
                'chauffeur_assigned', 'in_progress' => $bookingStatus === 'in_progress'
                    ? 'upcoming_soon'
                    : 'chauffeur_assigned',
                'confirmed', 'pending_payment', 'draft' => 'confirmed',
                default => 'confirmed',
            },
        };
    }

    public function chauffeurEtaLabel(?RideAssignment $assignment): ?string
    {
        return match ($assignment?->status) {
            'en_route' => 'Chauffeur on the way',
            'arrived' => 'Chauffeur has arrived',
            'in_progress' => 'Ride in progress',
            'assigned' => 'Chauffeur assigned',
            'completed' => 'Ride completed',
            default => $assignment ? 'Chauffeur assigned' : null,
        };
    }
}
