<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'service_type' => ['required_without:service_type_id', 'nullable', 'string', 'max:100'],
            'service_type_id' => ['required_without:service_type', 'nullable', 'integer', 'exists:service_types,id'],
            'pickup' => ['required', 'array'],
            'pickup.label' => ['required_without:pickup.formatted_address', 'nullable', 'string', 'max:500'],
            'pickup.formatted_address' => ['required_without:pickup.label', 'nullable', 'string', 'max:500'],
            'pickup.lat' => ['required', 'numeric', 'between:-90,90'],
            'pickup.lng' => ['required', 'numeric', 'between:-180,180'],
            'pickup.place_id' => ['nullable', 'string', 'max:255'],
            'pickup.type' => ['nullable', 'string', 'max:50'],
            'dropoff' => ['nullable', 'array'],
            'dropoff.label' => ['nullable', 'string', 'max:500'],
            'dropoff.formatted_address' => ['nullable', 'string', 'max:500'],
            'dropoff.lat' => ['nullable', 'numeric', 'between:-90,90'],
            'dropoff.lng' => ['nullable', 'numeric', 'between:-180,180'],
            'dropoff.place_id' => ['nullable', 'string', 'max:255'],
            'dropoff.type' => ['nullable', 'string', 'max:50'],
            'pickup_at' => ['nullable', 'date'],
            'duration' => ['nullable'],
            'duration_minutes' => ['nullable', 'integer', 'min:15'],
            'passengers' => ['nullable', 'integer', 'min:1', 'max:20'],
            'passenger_count' => ['nullable', 'integer', 'min:1', 'max:20'],
            'students' => ['nullable', 'integer', 'min:1', 'max:50'],
            'student_count' => ['nullable', 'integer', 'min:1', 'max:50'],
            'school_term' => ['nullable', 'string', 'max:100'],
            'gulf_destination_id' => ['nullable', 'integer', 'exists:gulf_destinations,id'],
            'gulf_destination' => ['nullable', 'string', 'max:100'],
            'gulf_destination_slug' => ['nullable', 'string', 'max:100'],
            'vehicle_class_id' => ['nullable', 'integer', 'exists:vehicle_classes,id'],
            'vehicle_class' => ['nullable', 'string', 'max:100'],
            'seat_addon' => ['nullable', 'string', 'max:100'],
            'seat_addon_slug' => ['nullable', 'string', 'max:100'],
            'seat_addon_id' => ['nullable', 'integer', 'exists:seat_addons,id'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'legs' => ['nullable', 'array', 'max:10'],
            'legs.*.pickup' => ['nullable', 'array'],
            'legs.*.pickup.label' => ['nullable', 'string', 'max:500'],
            'legs.*.pickup.formatted_address' => ['nullable', 'string', 'max:500'],
            'legs.*.pickup.lat' => ['nullable', 'numeric', 'between:-90,90'],
            'legs.*.pickup.lng' => ['nullable', 'numeric', 'between:-180,180'],
            'legs.*.dropoff' => ['nullable', 'array'],
            'legs.*.dropoff.label' => ['nullable', 'string', 'max:500'],
            'legs.*.dropoff.formatted_address' => ['nullable', 'string', 'max:500'],
            'legs.*.dropoff.lat' => ['nullable', 'numeric', 'between:-90,90'],
            'legs.*.dropoff.lng' => ['nullable', 'numeric', 'between:-180,180'],
            'legs.*.notes' => ['nullable', 'string', 'max:1000'],
            // Explicitly reject client-supplied money fields
            'subtotal' => ['prohibited'],
            'tax' => ['prohibited'],
            'tax_amount' => ['prohibited'],
            'fees' => ['prohibited'],
            'discount' => ['prohibited'],
            'total' => ['prohibited'],
            'total_amount' => ['prohibited'],
        ];
    }
}
