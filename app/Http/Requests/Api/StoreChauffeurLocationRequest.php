<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreChauffeurLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->chauffeur !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'accuracy' => ['nullable', 'numeric', 'min:0'],
            'heading' => ['nullable', 'numeric', 'between:0,360'],
            'speed' => ['nullable', 'numeric', 'min:0'],
            'recorded_at' => ['nullable', 'date'],
            'booking_id' => ['nullable', 'integer', 'exists:bookings,id'],
        ];
    }
}
