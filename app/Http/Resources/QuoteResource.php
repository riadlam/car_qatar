<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Quote
 */
class QuoteResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quote_number' => $this->quote_number,
            'status' => $this->status?->value ?? $this->status,
            'service_type_id' => $this->service_type_id,
            'vehicle_class_id' => $this->vehicle_class_id,
            'pickup_at' => $this->pickup_at,
            'timezone' => $this->timezone,
            'duration_minutes' => $this->duration_minutes,
            'distance_km' => $this->metadata['distance_km'] ?? null,
            'route_duration_minutes' => $this->metadata['route_duration_minutes'] ?? null,
            'route_status' => $this->metadata['route_status'] ?? null,
            'passenger_count' => $this->passenger_count,
            'student_count' => $this->student_count,
            'school_term' => $this->school_term,
            'gulf_destination_id' => $this->gulf_destination_id,
            'currency' => $this->currency,
            'subtotal' => $this->subtotal,
            'tax_amount' => $this->tax_amount,
            'fees' => $this->fees,
            'discount' => $this->discount,
            'total' => $this->total,
            'expires_at' => $this->expires_at,
            'service_type' => new ServiceTypeResource($this->whenLoaded('serviceType')),
            'vehicle_class' => new VehicleClassResource($this->whenLoaded('vehicleClass')),
            'pickup_location' => new LocationResource($this->whenLoaded('pickupLocation')),
            'dropoff_location' => new LocationResource($this->whenLoaded('dropoffLocation')),
            'gulf_destination' => new GulfDestinationResource($this->whenLoaded('gulfDestination')),
            'items' => QuoteItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
