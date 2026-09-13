<?php

namespace App\Http\Resources;

use App\Services\Tracking\TrackingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Lightweight poll payload for the live track page.
 *
 * @mixin \App\Models\Booking
 */
class BookingTrackResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $tracking = app(TrackingService::class);
        $assignment = $this->rideAssignment;
        $chauffeur = $assignment?->chauffeur;
        $bookingStatus = $this->status?->value ?? $this->status;
        $phase = $tracking->phaseFor($assignment, (string) $bookingStatus);
        $progress = $tracking->routeProgress($this->resource, $chauffeur, $assignment);

        $etaMinutes = $assignment?->eta_minutes;
        if ($etaMinutes === null && $chauffeur) {
            $target = $tracking->targetLocation($this->resource, $assignment);
            $etaMinutes = $tracking->estimateEtaMinutes(
                $chauffeur->current_latitude !== null ? (float) $chauffeur->current_latitude : null,
                $chauffeur->current_longitude !== null ? (float) $chauffeur->current_longitude : null,
                $target?->latitude !== null ? (float) $target->latitude : null,
                $target?->longitude !== null ? (float) $target->longitude : null,
            );
        }

        return [
            'booking_id' => $this->id,
            'booking_number' => $this->booking_number,
            'status' => $bookingStatus,
            'phase' => $phase,
            'assignment_status' => $assignment?->status,
            'chauffeur_eta' => $tracking->chauffeurEtaLabel($assignment),
            'eta_minutes' => $etaMinutes,
            'eta_at' => $assignment?->eta_at,
            'progress' => $progress,
            'chauffeur' => $chauffeur ? [
                'id' => $chauffeur->id,
                'name' => $chauffeur->user?->name
                    ?: trim(collect([$chauffeur->user?->first_name, $chauffeur->user?->last_name])->filter()->implode(' ')),
                'latitude' => $chauffeur->current_latitude !== null
                    ? (float) $chauffeur->current_latitude
                    : null,
                'longitude' => $chauffeur->current_longitude !== null
                    ? (float) $chauffeur->current_longitude
                    : null,
                'heading' => null,
                'last_location_at' => $chauffeur->last_location_at,
                'phone' => $chauffeur->user?->phone,
                'vehicle_plate' => $assignment?->vehicle?->license_plate,
            ] : null,
            'pickup' => $this->whenLoaded('pickupLocation', fn () => [
                'label' => $this->pickupLocation?->formatted_address ?? $this->pickupLocation?->name,
                'latitude' => $this->pickupLocation?->latitude !== null
                    ? (float) $this->pickupLocation->latitude
                    : null,
                'longitude' => $this->pickupLocation?->longitude !== null
                    ? (float) $this->pickupLocation->longitude
                    : null,
            ]),
            'dropoff' => $this->whenLoaded('dropoffLocation', fn () => [
                'label' => $this->dropoffLocation?->formatted_address ?? $this->dropoffLocation?->name,
                'latitude' => $this->dropoffLocation?->latitude !== null
                    ? (float) $this->dropoffLocation->latitude
                    : null,
                'longitude' => $this->dropoffLocation?->longitude !== null
                    ? (float) $this->dropoffLocation->longitude
                    : null,
            ]),
            'events' => $this->relationLoaded('rideEvents')
                ? RideEventResource::collection($this->rideEvents)->resolve()
                : [],
            'polled_at' => now()->toIso8601String(),
        ];
    }
}
