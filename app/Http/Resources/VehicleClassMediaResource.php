<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\VehicleClassMedia
 */
class VehicleClassMediaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'kind' => $this->kind,
            'key' => $this->key,
            'label' => $this->label,
            'image_lg' => $this->image_lg,
            'image_sm' => $this->image_sm,
            'sort_order' => $this->sort_order,
        ];
    }
}
