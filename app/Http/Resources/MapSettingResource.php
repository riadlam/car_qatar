<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\MapSetting
 */
class MapSettingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'style_uri' => $this->style_uri,
            'basemap_theme' => $this->basemap_theme,
            'default_latitude' => (float) $this->default_latitude,
            'default_longitude' => (float) $this->default_longitude,
            'default_zoom' => (int) $this->default_zoom,
            'country_codes' => $this->countryCodeList(),
            'language' => $this->language,
            'directions_profile' => $this->directions_profile,
            'show_traffic' => (bool) $this->show_traffic,
            'marker_color' => $this->marker_color,
            'status' => $this->status,
            'access_token' => config('services.mapbox.public_token') ?: null,
            'has_public_token' => filled(config('services.mapbox.public_token')),
        ];
    }
}
