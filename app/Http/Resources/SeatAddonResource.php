<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\SeatAddon
 */
class SeatAddonResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'label' => $this->label,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
            'default_price' => $this->default_price,
            'currency' => $this->currency,
        ];
    }
}
