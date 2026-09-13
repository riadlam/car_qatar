<?php

namespace App\Services\Maps;

use App\Models\MapSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MapboxDirectionsService
{
    /**
     * Driving distance and duration for an ordered list of coordinates.
     *
     * @param  list<array{lat: float|int|string, lng: float|int|string}>  $points
     * @return array{distance_km: float, duration_minutes: int}|null
     */
    public function route(array $points): ?array
    {
        $points = array_values(array_filter($points, function ($point) {
            return isset($point['lat'], $point['lng'])
                && is_numeric($point['lat'])
                && is_numeric($point['lng']);
        }));

        if (count($points) < 2) {
            return null;
        }

        $token = config('services.mapbox.secret_token') ?: config('services.mapbox.public_token');
        if (! $token) {
            return null;
        }

        $profile = MapSetting::current()->directions_profile ?: 'mapbox/driving-traffic';
        $coords = collect($points)
            ->map(fn (array $point) => round((float) $point['lng'], 5).','.round((float) $point['lat'], 5))
            ->implode(';');

        $route = $this->cachedRoute($profile, $coords, $token);
        if ($route === null && $profile !== 'mapbox/driving') {
            $route = $this->cachedRoute('mapbox/driving', $coords, $token);
        }
        if ($route === null) {
            return null;
        }

        return [
            'distance_km' => round(((float) $route['distance']) / 1000, 2),
            'duration_minutes' => (int) max(1, round(((float) ($route['duration'] ?? 0)) / 60)),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function cachedRoute(string $profile, string $coords, string $token): ?array
    {
        $key = 'mapbox.route.'.md5($profile.'|'.$coords);
        $cached = Cache::get($key);
        if (is_array($cached) && array_key_exists('route', $cached)) {
            return is_array($cached['route']) ? $cached['route'] : null;
        }

        $route = $this->requestRoute($profile, $coords, $token);
        Cache::put($key, ['route' => $route], $route ? now()->addHours(12) : now()->addMinutes(2));

        return $route;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function requestRoute(string $profile, string $coords, string $token): ?array
    {
        $response = Http::timeout(6)
            ->connectTimeout(3)
            ->acceptJson()
            ->get("https://api.mapbox.com/directions/v5/{$profile}/{$coords}", [
                'overview' => 'false',
                'geometries' => 'polyline',
                'access_token' => $token,
            ]);

        if (! $response->successful()) {
            Log::warning('Mapbox directions failed', [
                'profile' => $profile,
                'status' => $response->status(),
            ]);

            return null;
        }

        $route = $response->json('routes.0');
        if (! is_array($route) || ! isset($route['distance'])) {
            return null;
        }

        return $route;
    }

    /**
     * Snap a GPS fix onto the road so the van matches the route, not a rooftop.
     *
     * @return array{lng: float, lat: float}|null
     */
    public function snapToRoad(float $lng, float $lat, ?float $previousLng = null, ?float $previousLat = null): ?array
    {
        $token = config('services.mapbox.secret_token') ?: config('services.mapbox.public_token');
        if (! $token) {
            return null;
        }

        $current = [round($lng, 6), round($lat, 6)];
        $hasPrevious = $previousLng !== null && $previousLat !== null
            && $this->meters($lat, $lng, $previousLat, $previousLng) <= 2000;
        $points = $hasPrevious
            ? [[round($previousLng, 6), round($previousLat, 6)], $current]
            : [[round($lng - 0.00002, 6), round($lat, 6)], $current];

        $coords = collect($points)->map(fn (array $point) => $point[0].','.$point[1])->implode(';');
        $radiuses = implode(';', array_fill(0, count($points), '30'));

        $response = Http::timeout(6)
            ->connectTimeout(3)
            ->acceptJson()
            ->get('https://api.mapbox.com/matching/v5/mapbox/driving/'.$coords, [
                'geometries' => 'geojson',
                'overview' => 'false',
                'tidy' => 'true',
                'radiuses' => $radiuses,
                'access_token' => $token,
            ]);

        if (! $response->successful()) {
            return null;
        }

        $trace = $response->json('tracepoints.'.(count($points) - 1));
        $location = is_array($trace) ? ($trace['location'] ?? null) : null;
        if (! is_array($location) || count($location) < 2) {
            return null;
        }

        $snappedLng = (float) $location[0];
        $snappedLat = (float) $location[1];
        $moved = $this->meters($lat, $lng, $snappedLat, $snappedLng);
        if ($moved > 40) {
            return null;
        }

        return ['lng' => $snappedLng, 'lat' => $snappedLat];
    }

    private function meters(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earth = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return $earth * (2 * atan2(sqrt($a), sqrt(1 - $a)));
    }
}
