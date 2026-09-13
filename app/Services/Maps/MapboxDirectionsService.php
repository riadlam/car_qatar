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
}
