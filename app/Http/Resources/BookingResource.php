<?php

namespace App\Http\Resources;

use App\Enums\UserRole;
use App\Services\Tracking\TrackingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin \App\Models\Booking
 */
class BookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $tracking = app(TrackingService::class);
        $assignment = $this->relationLoaded('rideAssignment') ? $this->rideAssignment : null;
        $bookingStatus = $this->status?->value ?? $this->status;
        $phase = $tracking->phaseFor($assignment, (string) $bookingStatus);
        $car = $assignment?->chauffeur;

        $latestPayment = null;
        if ($this->relationLoaded('payments') && $this->payments->isNotEmpty()) {
            $latestPayment = $this->payments->sortByDesc('id')->first();
        }

        return [
            'id' => $this->id,
            'booking_number' => $this->booking_number,
            'status' => $bookingStatus,
            'payment_status' => $this->payment_status?->value ?? $this->payment_status,
            'phase' => $phase,
            'trip_step' => $tracking->tripStep(
                $this->resource,
                $assignment,
                $car?->current_latitude !== null ? (float) $car->current_latitude : null,
                $car?->current_longitude !== null ? (float) $car->current_longitude : null,
            ),
            'quote_id' => $this->quote_id,
            'service_type_id' => $this->service_type_id,
            'vehicle_class_id' => $this->vehicle_class_id,
            'pickup_at' => $this->pickup_at,
            'timezone' => $this->timezone,
            'passenger_count' => $this->passenger_count,
            'luggage_count' => $this->luggage_count,
            'currency' => $this->currency,
            'subtotal' => $this->subtotal,
            'tax_amount' => $this->tax_amount,
            'fees' => $this->fees,
            'discount' => $this->discount,
            'total_amount' => $this->total_amount,
            'customer_notes' => $this->customer_notes,
            'customer_reference' => $this->customer_reference,
            'preferred_language' => $this->preferred_language,
            'seat_addon_id' => $this->seat_addon_id,
            'billing' => $this->billing,
            'cancelled_at' => $this->cancelled_at,
            'completed_at' => $this->completed_at,
            'cancellation' => $this->cancellationPayload(),
            'booker_name' => $this->bookerName(),
            'guest' => new BookingGuestResource($this->whenLoaded('guest')),
            'guests' => BookingGuestResource::collection($this->whenLoaded('guests')),
            'vehicle_class' => new VehicleClassResource($this->whenLoaded('vehicleClass')),
            'pickup_location' => new LocationResource($this->whenLoaded('pickupLocation')),
            'dropoff_location' => new LocationResource($this->whenLoaded('dropoffLocation')),
            'price_items' => BookingPriceItemResource::collection($this->whenLoaded('priceItems')),
            'service_type' => new ServiceTypeResource($this->whenLoaded('serviceType')),
            'seat_addon' => new SeatAddonResource($this->whenLoaded('seatAddon')),
            'ride_assignment' => $this->when(
                $assignment !== null,
                function () use ($assignment) {
                    return [
                        'id' => $assignment->id,
                        'status' => $assignment->status,
                        'assigned_at' => $assignment->assigned_at,
                        'started_at' => $assignment->started_at,
                        'completed_at' => $assignment->completed_at,
                        'eta_minutes' => $assignment->eta_minutes,
                        'eta_at' => $assignment->eta_at,
                    ];
                },
            ),
            'ride_events' => RideEventResource::collection($this->whenLoaded('rideEvents')),
            'payment' => $this->when($latestPayment !== null, function () use ($latestPayment) {
                $meta = is_array($latestPayment->metadata) ? $latestPayment->metadata : [];

                return [
                    'status' => $latestPayment->status?->value ?? $latestPayment->status,
                    'method' => $latestPayment->method,
                    'brand' => $meta['brand'] ?? $meta['card_brand'] ?? null,
                    'last4' => $meta['last4'] ?? $meta['card_last4'] ?? null,
                    'label' => $this->paymentLabel($latestPayment, $meta),
                ];
            }),
            'chauffeur' => $this->when(
                $assignment !== null,
                function () use ($assignment, $tracking) {
                    $chauffeur = $assignment?->chauffeur;
                    $user = $chauffeur?->user;
                    if (! $chauffeur) {
                        return null;
                    }

                    $avatar = $user?->avatar_path;
                    if ($avatar && ! str_starts_with($avatar, 'http')) {
                        $avatar = Storage::disk('public')->url($avatar);
                    }

                    return [
                        'id' => $chauffeur->id,
                        'name' => $user?->name
                            ?: trim(collect([$user?->first_name, $user?->last_name])->filter()->implode(' ')),
                        'rating' => $chauffeur->rating !== null ? (float) $chauffeur->rating : null,
                        'trips' => (int) ($chauffeur->completed_rides ?? 0),
                        'vehicle_plate' => $assignment?->vehicle?->license_plate,
                        'phone' => $user?->phone,
                        'avatar_url' => $avatar,
                        'latitude' => $chauffeur->current_latitude !== null
                            ? (float) $chauffeur->current_latitude
                            : null,
                        'longitude' => $chauffeur->current_longitude !== null
                            ? (float) $chauffeur->current_longitude
                            : null,
                        'last_location_at' => $chauffeur->last_location_at,
                        'eta_label' => $tracking->chauffeurEtaLabel($assignment),
                    ];
                },
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function bookerName(): ?string
    {
        $user = $this->relationLoaded('user') ? $this->user : $this->user()->first();
        $name = trim((string) ($user?->name ?: ''));
        if ($name === '') {
            $name = trim(collect([$user?->first_name, $user?->last_name])->filter()->implode(' '));
        }

        return $name !== '' ? $name : null;
    }

    /**
     * @return array{reason: string, cancelled_by: string}|null
     */
    private function cancellationPayload(): ?array
    {
        $status = $this->status?->value ?? $this->status;
        if ($status !== 'cancelled') {
            return null;
        }

        $row = $this->relationLoaded('cancellations')
            ? $this->cancellations->sortByDesc('id')->first()
            : $this->cancellations()->with('cancelledBy')->latest('id')->first();

        if (! $row) {
            return null;
        }

        $role = $row->cancelledBy?->role;

        return [
            'reason' => (string) ($row->reason ?: ''),
            'cancelled_by' => $role === UserRole::Chauffeur ? 'chauffeur' : 'customer',
        ];
    }

    /**
     * @param  array<string, mixed>  $meta
     */
    private function paymentLabel(mixed $payment, array $meta): string
    {
        $brand = $meta['brand'] ?? $meta['card_brand'] ?? null;
        $last4 = $meta['last4'] ?? $meta['card_last4'] ?? null;
        if ($brand && $last4) {
            return ucfirst((string) $brand).' •••• '.$last4;
        }
        if ($payment->method) {
            return ucfirst((string) $payment->method);
        }

        return (string) ($payment->status?->value ?? $payment->status ?? 'Pending');
    }
}
