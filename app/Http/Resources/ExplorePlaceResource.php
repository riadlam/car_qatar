<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ExplorePlace
 */
class ExplorePlaceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'slug' => $this->slug,
            'title' => $this->title,
            'body' => $this->body,
            'img' => $this->imageUrl(),
            'label' => $this->label,
            'area' => $this->area,
            'formatted_address' => $this->formatted_address,
            'lat' => $this->latitude,
            'lng' => $this->longitude,
            'place_id' => $this->place_id,
            'provider' => $this->provider,
            'show_in_carousel' => (bool) $this->show_in_carousel,
            'show_in_scheduler' => (bool) $this->show_in_scheduler,
            'sort_order' => $this->sort_order,
        ];
    }
}
