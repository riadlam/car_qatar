<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Public guest pay page — no partner commission fields.
 *
 * @mixin \App\Models\Booking
 */
class GuestPaymentBookingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $fees = (float) $this->fees;
        $subtotal = (float) $this->subtotal;

        return [
            'booking_number' => $this->booking_number,
            'status' => $this->status?->value ?? $this->status,
            'payment_status' => $this->payment_status?->value ?? $this->payment_status,
            'pickup_at' => $this->pickup_at,
            'timezone' => $this->timezone,
            'currency' => $this->currency,
            // Absorb fees into display subtotal so base + tax = total with no fee line.
            'subtotal' => round($subtotal + $fees, 2),
            'tax_amount' => $this->tax_amount,
            'total' => $this->total_amount,
            'passenger_count' => $this->passenger_count,
            'guest' => $this->whenLoaded('guest', fn () => $this->guest ? [
                'first_name' => $this->guest->first_name,
                'last_name' => $this->guest->last_name,
            ] : null),
            'pickup_location' => new LocationResource($this->whenLoaded('pickupLocation')),
            'dropoff_location' => new LocationResource($this->whenLoaded('dropoffLocation')),
            'vehicle_class' => new VehicleClassResource($this->whenLoaded('vehicleClass')),
            'service_type' => new ServiceTypeResource($this->whenLoaded('serviceType')),
        ];
    }
}
