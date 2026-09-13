import mapboxgl from 'mapbox-gl';

function toLngLat(point) {
    if (Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1])) {
        return point;
    }
    if (point && Number.isFinite(Number(point.lng)) && Number.isFinite(Number(point.lat))) {
        return [Number(point.lng), Number(point.lat)];
    }
    return null;
}

function paddingFor(map) {
    const el = map.getContainer();
    const width = el?.clientWidth || 320;
    const height = el?.clientHeight || 220;
    const side = Math.round(Math.min(52, Math.max(22, width * 0.09)));
    const bottom = Math.round(Math.min(36, Math.max(16, height * 0.08)));
    const top = Math.round(Math.min(72, Math.max(42, height * 0.18)));

    return { top, bottom, left: side, right: side + 6 };
}

/**
 * Frame every point and the path between them.
 * Zooms out as far as the route needs, without a country-wide view
 * or a street-level crop that hides a pin.
 */
export function frameRoute(map, points, { animate = false } = {}) {
    if (!map || !points?.length) return;

    map.resize();

    const coords = points.map(toLngLat).filter(Boolean);
    if (!coords.length) return;

    const bounds = new mapboxgl.LngLatBounds(coords[0], coords[0]);
    coords.forEach((coord) => bounds.extend(coord));

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const latSpan = Math.abs(ne.lat - sw.lat);
    const lngSpan = Math.abs(ne.lng - sw.lng);
    // Short hops still get a little air so the line and pins stay readable.
    if (latSpan < 0.01 || lngSpan < 0.01) {
        const padLat = Math.max(0.0035, (0.01 - latSpan) / 2);
        const padLng = Math.max(0.0035, (0.01 - lngSpan) / 2);
        bounds.extend([sw.lng - padLng, sw.lat - padLat]);
        bounds.extend([ne.lng + padLng, ne.lat + padLat]);
    }

    map.fitBounds(bounds, {
        padding: paddingFor(map),
        maxZoom: 14.2,
        duration: animate ? 420 : 0,
    });
}
