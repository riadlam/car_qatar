<?php

namespace App\Http\Resources;

use App\Models\SchoolTerm;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ServiceType
 */
class ServiceTypeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $durationOptions = $this->whenLoaded(
            'durationOptions',
            fn () => ServiceDurationOptionResource::collection(
                $this->durationOptions->where('status', 'active')->values(),
            )->resolve(),
            [],
        );

        $countOptions = $this->whenLoaded(
            'countOptions',
            fn () => ServiceCountOptionResource::collection(
                $this->countOptions->where('status', 'active')->values(),
            )->resolve(),
            [],
        );

        $termOptions = [];
        if ($this->requires_school_term) {
            $termOptions = SchoolTermResource::collection(
                SchoolTerm::query()
                    ->where('status', 'active')
                    ->orderBy('sort_order')
                    ->get(),
            )->resolve();
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'mode' => $this->mode,
            'requires_dropoff' => (bool) $this->requires_dropoff,
            'allows_multi_stops' => (bool) $this->allows_multi_stops,
            'max_stops' => $this->max_stops,
            'is_hourly' => (bool) $this->is_hourly,
            'requires_flight' => (bool) $this->requires_flight,
            'requires_gulf_destination' => (bool) $this->requires_gulf_destination,
            'requires_school_term' => (bool) $this->requires_school_term,
            'requires_passengers' => (bool) $this->requires_passengers,
            'requires_students' => (bool) $this->requires_students,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
            'duration_options' => $durationOptions,
            'count_options' => $countOptions,
            'term_options' => $termOptions,
        ];
    }
}
