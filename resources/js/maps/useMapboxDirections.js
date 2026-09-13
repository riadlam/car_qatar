import { fetchMapConfig, getMapboxToken } from './mapboxClient';

/**
 * Fetch a driving route via Mapbox Directions API.
 * @returns {{ coordinates: [lng,lat][], duration: number, distance: number } | null}
 */
export async function fetchMapboxDirections(from, to, waypoints = []) {
    const points = [from, ...waypoints, to].filter((p) => p && p.lat != null && p.lng != null);
    if (points.length < 2) return null;

    const config = await fetchMapConfig();
    const token = getMapboxToken();
    if (!token) return null;
    const profile = config.directions_profile || 'mapbox/driving-traffic';
    const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
    const params = new URLSearchParams({
        geometries: 'geojson',
        overview: 'full',
        access_token: token,
    });

    const res = await fetch(
        `https://api.mapbox.com/directions/v5/${profile}/${coords}?${params.toString()}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route?.geometry?.coordinates?.length) return null;

    return {
        coordinates: route.geometry.coordinates,
        duration: route.duration,
        distance: route.distance,
    };
}

export function ensureRouteLayers(map, color = '#5b0520') {
    if (!map.getSource('almajd-route')) {
        map.addSource('almajd-route', {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} },
        });
        map.addLayer({
            id: 'almajd-route-casing',
            type: 'line',
            source: 'almajd-route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
                'line-color': '#ffffff',
                'line-width': 8,
                'line-opacity': 0.95,
            },
        });
        map.addLayer({
            id: 'almajd-route-line',
            type: 'line',
            source: 'almajd-route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
                'line-color': color,
                'line-width': 4.5,
                'line-opacity': 1,
            },
        });
    } else {
        map.setPaintProperty('almajd-route-line', 'line-color', color);
    }
}

export function setRouteGeoJson(map, coordinates, color = '#5b0520') {
    ensureRouteLayers(map, color);
    map.getSource('almajd-route').setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coordinates || [] },
    });
}

export function pointAlongLine(coordinates, t) {
    if (!coordinates?.length) return null;
    if (coordinates.length === 1) {
        return { lng: coordinates[0][0], lat: coordinates[0][1], heading: 0 };
    }

    const dists = [];
    let total = 0;
    for (let i = 1; i < coordinates.length; i += 1) {
        const [lng0, lat0] = coordinates[i - 1];
        const [lng1, lat1] = coordinates[i];
        const d = Math.hypot(lng1 - lng0, lat1 - lat0);
        dists.push(d);
        total += d;
    }
    if (total <= 0) {
        return { lng: coordinates[0][0], lat: coordinates[0][1], heading: 0 };
    }

    let remain = Math.min(1, Math.max(0, t)) * total;
    for (let i = 0; i < dists.length; i += 1) {
        const d = dists[i];
        if (remain <= d) {
            const ratio = d === 0 ? 0 : remain / d;
            const [lng0, lat0] = coordinates[i];
            const [lng1, lat1] = coordinates[i + 1];
            const lng = lng0 + (lng1 - lng0) * ratio;
            const lat = lat0 + (lat1 - lat0) * ratio;
            const heading = (Math.atan2(lng1 - lng0, lat1 - lat0) * 180) / Math.PI;
            return { lng, lat, heading };
        }
        remain -= d;
    }

    const last = coordinates[coordinates.length - 1];
    const prev = coordinates[coordinates.length - 2];
    return {
        lng: last[0],
        lat: last[1],
        heading: (Math.atan2(last[0] - prev[0], last[1] - prev[1]) * 180) / Math.PI,
    };
}
