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
    public function search(string $queryText, int $limit = 8, ?float $proximityLng = null, ?float $proximityLat = null, string $scope = 'qatar'): array
    {
        $token = config('services.mapbox.secret_token') ?: config('services.mapbox.public_token');
        if (! $token || ! filled($queryText)) {
            return [];
        }

        $settings = MapSetting::current();
        $geo = $this->scopeGeo($scope, $settings);
        $params = [
            'q' => $queryText,
            'access_token' => $token,
            'permanent' => 'true',
            'language' => $settings->language ?: 'en',
            'limit' => max(1, min(10, $limit)),
            'country' => $geo['country'],
            'types' => 'poi,address,street,place',
        ];

        if ($proximityLng !== null && $proximityLat !== null) {
            $params['proximity'] = "{$proximityLng},{$proximityLat}";
        } else {
            $params['proximity'] = $geo['proximity'];
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
     * Search Box suggest — finds hotels/POIs the geocoder often misses.
     * Option values must be retrieved with the same session_token.
     *
     * @param  'qatar'|'gulf'  $scope
     * @return list<array{mapbox_id: string, label: string, name: string, session_token: string}>
     */
    public function suggestPlaces(string $queryText, int $limit = 8, string $scope = 'qatar'): array
    {
        $token = config('services.mapbox.secret_token') ?: config('services.mapbox.public_token');
        if (! $token || ! filled($queryText)) {
            return [];
        }

        $settings = MapSetting::current();
        $sessionToken = (string) \Illuminate\Support\Str::uuid();
        $geo = $this->scopeGeo($scope, $settings);
        $params = [
            'q' => $queryText,
            'access_token' => $token,
            'session_token' => $sessionToken,
            'language' => $settings->language ?: 'en',
            'limit' => max(1, min(10, $limit)),
            'country' => $geo['country'],
            'proximity' => $geo['proximity'],
            'bbox' => $geo['bbox'],
        ];

        $response = Http::timeout(12)
            ->acceptJson()
            ->get('https://api.mapbox.com/search/searchbox/v1/suggest', $params);

        if (! $response->successful()) {
            Log::warning('Mapbox Search Box suggest failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [];
        }

        $out = [];
        foreach ($response->json('suggestions') ?? [] as $suggestion) {
            if (! is_array($suggestion) || blank($suggestion['mapbox_id'] ?? null)) {
                continue;
            }
            $name = (string) ($suggestion['name'] ?? '');
            $placeFormatted = (string) ($suggestion['place_formatted'] ?? '');
            $full = (string) ($suggestion['full_address'] ?? '');
            if ($full === '') {
                $full = $placeFormatted !== '' ? $placeFormatted : $name;
            }
            if ($full === '') {
                continue;
            }
            $out[] = [
                'mapbox_id' => (string) $suggestion['mapbox_id'],
                'name' => $name !== '' ? $name : $full,
                'label' => $full,
                'session_token' => $sessionToken,
            ];
        }

        return $out;
    }

    /**
     * @return array{country: string, proximity: string, bbox: string}
     */
    private function scopeGeo(string $scope, MapSetting $settings): array
    {
        if ($scope === 'gulf') {
            return [
                'country' => 'qa,ae,sa,om,kw,bh',
                'proximity' => '55.2708,25.2048', // Dubai — better gulf default for destinations
                'bbox' => '34.4,12.4,60.0,32.2',
            ];
        }

        return [
            'country' => 'qa',
            'proximity' => "{$settings->default_longitude},{$settings->default_latitude}",
            'bbox' => '50.65,24.4,51.75,26.25',
        ];
    }

    /**
     * Resolve a Search Box suggestion to coordinates (must reuse suggest session_token).
     *
     * @return array{place_id: string, name: string, label: string, latitude: float, longitude: float}|null
     */
    public function retrievePlace(string $mapboxId, string $sessionToken): ?array
    {
        $token = config('services.mapbox.secret_token') ?: config('services.mapbox.public_token');
        if (! $token || ! filled($mapboxId) || ! filled($sessionToken)) {
            return null;
        }

        $response = Http::timeout(12)
            ->acceptJson()
            ->get('https://api.mapbox.com/search/searchbox/v1/retrieve/'.rawurlencode($mapboxId), [
                'access_token' => $token,
                'session_token' => $sessionToken,
            ]);

        if (! $response->successful()) {
            Log::warning('Mapbox Search Box retrieve failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        }

        $feature = $response->json('features.0');
        if (! is_array($feature)) {
            return null;
        }

        $props = $feature['properties'] ?? [];
        $coords = $feature['geometry']['coordinates'] ?? null;
        $placeLng = is_array($coords) ? (float) ($coords[0] ?? 0) : null;
        $placeLat = is_array($coords) ? (float) ($coords[1] ?? 0) : null;

        $routable = $props['coordinates']['routable_points'][0] ?? $props['routable_points'][0] ?? null;
        $roadLng = isset($routable['longitude']) ? (float) $routable['longitude'] : null;
        $roadLat = isset($routable['latitude']) ? (float) $routable['latitude'] : null;

        $lng = $roadLng ?? $placeLng;
        $lat = $roadLat ?? $placeLat;
        if ($lng === null || $lat === null) {
            return null;
        }

        $label = $props['full_address']
            ?? $props['place_formatted']
            ?? $props['name']
            ?? null;
        if (! $label) {
            return null;
        }

        return [
            'place_id' => (string) ($props['mapbox_id'] ?? $mapboxId),
            'name' => (string) ($props['name'] ?? $label),
            'label' => (string) $label,
            'latitude' => $lat,
            'longitude' => $lng,
        ];
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
