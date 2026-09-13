<?php

namespace App\Http\Resources;

use App\Models\RideOffer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Chauffeur-facing offer card. Never includes another chauffeur's location.
 *
 * @mixin RideOffer
 */
class ChauffeurOfferResource extends JsonResource
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
    public static function payload(RideOffer $offer): array
    {
        $offer->loadMissing([
            'booking.pickupLocation',
            'booking.dropoffLocation',
            'booking.vehicleClass',
            'booking.serviceType',
            'booking.guest',
            'booking.user',
            'booking.quote',
        ]);

        $booking = $offer->booking;
        $pickupAt = $booking?->pickup_at;
        $tz = $booking?->timezone ?: config('app.timezone');
        $local = $pickupAt?->copy()->timezone($tz);
        $guest = $booking?->guest;
        $owner = $booking?->user;
        $passenger = $guest
            ? trim(collect([$guest->title, $guest->first_name, $guest->last_name])->filter()->implode(' '))
            : trim(collect([$owner?->first_name, $owner?->last_name])->filter()->implode(' '));
        $distance = data_get($booking?->quote?->metadata, 'distance_km');
        $when = 'later';
        if ($local) {
            if ($local->isToday()) {
                $when = 'today';
            } elseif ($local->isTomorrow()) {
                $when = 'tomorrow';
            }
        }

        return [
            'id' => $offer->id,
            'booking_id' => $offer->booking_id,
            'status' => $offer->status,
            'status_label' => 'New offer',
            'mode' => $booking?->serviceType?->mode ?: 'transfer',
            'mode_label' => $booking?->serviceType?->name ?: 'Journey',
            'date_label' => $local?->format('D, j M Y') ?: '',
            'time_label' => $local?->format('g:i a') ?: '',
            'when' => $when,
            'pickup' => $booking?->pickupLocation?->formatted_address
                ?: $booking?->pickupLocation?->name
                ?: '—',
            'dropoff' => $booking?->dropoffLocation?->formatted_address
                ?: $booking?->dropoffLocation?->name
                ?: '',
            'vehicle_class' => $booking?->vehicleClass?->name ?: '',
            'passenger_name' => $passenger !== '' ? $passenger : 'Passenger',
            'notes' => $booking?->customer_notes,
            'payout' => $booking?->total_amount !== null ? (float) $booking->total_amount : null,
            'currency' => $booking?->currency ?: '',
            'distance_km' => $distance !== null ? (float) $distance : null,
            'booking_number' => $booking?->booking_number,
            'offered_at' => $offer->offered_at,
        ];
    }
}
