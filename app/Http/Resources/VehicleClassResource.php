<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\VehicleClass
 */
class VehicleClassResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'similar_label' => $this->similar_label,
            'description' => $this->description,
            'passengers' => $this->passengers,
            'luggage' => $this->luggage,
            'image_lg' => $this->image_lg,
            'image_sm' => $this->image_sm,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
            'amenities' => AmenityResource::collection($this->whenLoaded('amenities')),
            'media' => VehicleClassMediaResource::collection($this->whenLoaded('media')),
        ];
    }
}
