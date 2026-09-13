<?php

namespace App\Http\Resources;

use App\Models\RideAssignment;
use App\Services\Tracking\TrackingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Chauffeur-facing ride card. No billing, payment, or another chauffeur's location.
 *
 * @mixin RideAssignment
 */
class ChauffeurRideResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return self::payload($this->resource);
    }

    /**
     * @return array<string, mixed>
     */
    public static function payload(RideAssignment $assignment): array
    {
        $assignment->loadMissing([
            'booking.pickupLocation',
            'booking.dropoffLocation',
            'booking.serviceType',
            'booking.guest',
            'booking.user',
            'vehicle',
            'chauffeur',
        ]);

        $booking = $assignment->booking;
        $guest = $booking?->guest;
        $owner = $booking?->user;
        $passenger = $guest
            ? trim(collect([$guest->title, $guest->first_name, $guest->last_name])->filter()->implode(' '))
            : trim(collect([$owner?->first_name, $owner?->last_name])->filter()->implode(' '));
        $phone = $guest
            ? (string) ($guest->phone ?: '')
            : (string) ($owner?->phone ?: '');

        $pickup = $booking?->pickupLocation;
        $dropoff = $booking?->dropoffLocation;
        $vehicle = $assignment->vehicle;
        $chauffeur = $assignment->chauffeur;
        $tracking = app(TrackingService::class);

        $eta = $assignment->eta_minutes;
        if ($eta === null && $booking && $chauffeur) {
            $target = $tracking->targetLocation($booking, $assignment);
            $eta = $tracking->estimateEtaMinutes(
                $chauffeur->current_latitude !== null ? (float) $chauffeur->current_latitude : null,
                $chauffeur->current_longitude !== null ? (float) $chauffeur->current_longitude : null,
                $target?->latitude !== null ? (float) $target->latitude : null,
                $target?->longitude !== null ? (float) $target->longitude : null,
            );
        }

        $progress = $booking
            ? $tracking->routeProgress($booking, $chauffeur, $assignment)
            : null;

        $model = trim(collect([$vehicle?->manufacturer, $vehicle?->model])->filter()->implode(' '));

        return [
            'id' => $assignment->id,
            'assignment_id' => $assignment->id,
            'status' => $assignment->status,
            'status_label' => $tracking->chauffeurEtaLabel($assignment) ?: 'Assigned',
            'next_status' => self::nextStatus($assignment->status),
            'booking_id' => $assignment->booking_id,
            'booking_number' => $booking?->booking_number,
            'mode_label' => $booking?->serviceType?->name ?: 'Journey',
            'pickup' => $pickup?->formatted_address ?: $pickup?->name ?: '—',
            'dropoff' => $dropoff?->formatted_address ?: $dropoff?->name ?: '',
            'passenger_name' => $passenger !== '' ? $passenger : 'Passenger',
            'passenger_phone' => $phone,
            'notes' => $booking?->customer_notes ?: '',
            'payout' => $booking?->total_amount !== null ? (float) $booking->total_amount : null,
            'currency' => $booking?->currency ?: '',
            'eta_minutes' => $eta !== null ? (int) $eta : null,
            'progress' => $progress !== null ? round((float) $progress, 3) : null,
            'lat' => self::coord($pickup?->latitude),
            'lng' => self::coord($pickup?->longitude),
            'drop_lat' => self::coord($dropoff?->latitude),
            'drop_lng' => self::coord($dropoff?->longitude),
            'car_lat' => self::coord($chauffeur?->current_latitude),
            'car_lng' => self::coord($chauffeur?->current_longitude),
            'vehicle_label' => $model,
            'plate' => $vehicle?->license_plate ?: '',
        ];
    }

    public static function nextStatus(?string $status): ?string
    {
        return match ($status) {
            'assigned' => 'en_route',
            'en_route' => 'arrived',
            'arrived' => 'in_progress',
            'in_progress' => 'completed',
            default => null,
        };
    }

    private static function coord(mixed $value): ?float
    {
        return $value !== null && $value !== '' ? (float) $value : null;
    }
}
