<?php

namespace App\Services\Maps;

use App\Models\MapSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MapboxGeocodingService
{
    public function reverse(float $longitude, float $latitude): ?array
    {
        $token = config('services.mapbox.secret_token') ?: config('services.mapbox.public_token');
        if (! $token) {
            return null;
        }

        $settings = MapSetting::current();
        $query = [
            'longitude' => $longitude,
            'latitude' => $latitude,
            'access_token' => $token,
            'permanent' => 'true',
            'language' => $settings->language ?: 'en',
            'limit' => 1,
            'types' => 'address,street,poi',
        ];

        $response = Http::timeout(12)
            ->acceptJson()
            ->get('https://api.mapbox.com/search/geocode/v6/reverse', $query);

        if (! $response->successful()) {
            Log::warning('Mapbox reverse geocode failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        }

        return $this->normalizeFeature($response->json('features.0'));
    }

    public function forward(string $queryText, ?float $proximityLng = null, ?float $proximityLat = null): ?array
    {
        $results = $this->search($queryText, 1, $proximityLng, $proximityLat);

        return $results[0] ?? null;
    }

    /**
     * Forward geocode returning up to $limit permanent features (Qatar-biased via map settings).
     *
     * @return list<array<string, mixed>>
     */
    public function search(string $queryText, int $limit = 8, ?float $proximityLng = null, ?float $proximityLat = null): array
    {
        $token = config('services.mapbox.secret_token') ?: config('services.mapbox.public_token');
        if (! $token || ! filled($queryText)) {
            return [];
        }

        $settings = MapSetting::current();
        $params = [
            'q' => $queryText,
            'access_token' => $token,
            'permanent' => 'true',
            'language' => $settings->language ?: 'en',
            'limit' => max(1, min(10, $limit)),
            // Explore places are Qatar-focused by product default
            'country' => 'qa',
        ];

        if ($proximityLng !== null && $proximityLat !== null) {
            $params['proximity'] = "{$proximityLng},{$proximityLat}";
        } else {
            $params['proximity'] = "{$settings->default_longitude},{$settings->default_latitude}";
        }

        $response = Http::timeout(12)
            ->acceptJson()
            ->get('https://api.mapbox.com/search/geocode/v6/forward', $params);

        if (! $response->successful()) {
            Log::warning('Mapbox forward search failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [];
        }

        $out = [];
        foreach ($response->json('features') ?? [] as $feature) {
            $normalized = $this->normalizeFeature(is_array($feature) ? $feature : null);
            if ($normalized) {
                $out[] = $normalized;
            }
        }

        return $out;
    }

    /**
     * Enrich resolve payload with permanent Mapbox place data when possible.
     *
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    public function enrichResolveInput(array $input): array
    {
        $lat = isset($input['lat']) ? (float) $input['lat'] : (isset($input['latitude']) ? (float) $input['latitude'] : null);
        $lng = isset($input['lng']) ? (float) $input['lng'] : (isset($input['longitude']) ? (float) $input['longitude'] : null);
        $label = $input['formatted_address'] ?? $input['label'] ?? $input['name'] ?? null;

        $feature = null;
        if ($lat !== null && $lng !== null) {
            $feature = $this->reverse($lng, $lat);
        } elseif (filled($label)) {
            $feature = $this->forward((string) $label);
        }

        if (! $feature) {
            return array_merge($input, [
                'provider' => $input['provider'] ?? 'mapbox',
            ]);
        }

        $keepPin = $lat !== null && $lng !== null;
        $pinLat = $keepPin ? $lat : (float) ($feature['routable_latitude'] ?? $feature['latitude']);
        $pinLng = $keepPin ? $lng : (float) ($feature['routable_longitude'] ?? $feature['longitude']);

        return array_merge($input, [
            'lat' => $pinLat,
            'lng' => $pinLng,
            'latitude' => $pinLat,
            'longitude' => $pinLng,
            'formatted_address' => $feature['label'],
            'label' => $feature['label'],
            'name' => $feature['name'] ?? $feature['label'],
            'place_id' => $feature['place_id'],
            'provider' => 'mapbox',
            'metadata' => array_merge($input['metadata'] ?? [], [
                'mapbox' => $feature['raw'] ?? null,
            ]),
        ]);
    }

    /**
     * @param  array<string, mixed>|null  $feature
     * @return array<string, mixed>|null
     */
    private function normalizeFeature(?array $feature): ?array
    {
        if (! $feature) {
            return null;
        }

        $coords = $feature['geometry']['coordinates'] ?? null;
        if (! is_array($coords) || count($coords) < 2) {
            return null;
        }

        $props = $feature['properties'] ?? [];
        $routable = $props['coordinates']['routable_points'][0] ?? null;
        $label = $props['full_address']
            ?? $props['place_formatted']
            ?? $props['name']
            ?? $feature['place_name']
            ?? null;

        if (! $label) {
            return null;
        }

        return [
            'place_id' => $props['mapbox_id'] ?? $feature['id'] ?? null,
            'name' => $props['name'] ?? $label,
            'label' => $label,
            'longitude' => (float) $coords[0],
            'latitude' => (float) $coords[1],
            'routable_longitude' => isset($routable['longitude']) ? (float) $routable['longitude'] : null,
            'routable_latitude' => isset($routable['latitude']) ? (float) $routable['latitude'] : null,
            'raw' => [
                'id' => $feature['id'] ?? null,
                'feature_type' => $props['feature_type'] ?? null,
                'context' => $props['context'] ?? null,
            ],
        ];
    }
}
