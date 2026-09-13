import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMapConfig, getMapboxToken } from './mapboxClient';
import { getSearchScope } from './searchScopes';

function metersBetween(a, b) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Road entrance when Mapbox has one nearby; otherwise the place itself. */
export function navigablePoint(feature, fallbackLng, fallbackLat) {
    const props = feature?.properties || {};
    const geometry = feature?.geometry?.coordinates || [];
    const placeLng = Number(geometry[0] ?? props.coordinates?.longitude ?? fallbackLng);
    const placeLat = Number(geometry[1] ?? props.coordinates?.latitude ?? fallbackLat);
    const routable = props.coordinates?.routable_points?.[0] || props.routable_points?.[0];
    const roadLng = Number(routable?.longitude);
    const roadLat = Number(routable?.latitude);

    if (Number.isFinite(roadLng) && Number.isFinite(roadLat) && Number.isFinite(placeLng) && Number.isFinite(placeLat)) {
        if (metersBetween({ lat: placeLat, lng: placeLng }, { lat: roadLat, lng: roadLng }) <= 120) {
            return { lng: roadLng, lat: roadLat };
        }
    }

    return {
        lng: Number.isFinite(placeLng) ? placeLng : fallbackLng,
        lat: Number.isFinite(placeLat) ? placeLat : fallbackLat,
    };
}

function newSessionToken() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Mapbox Search Box suggest + retrieve for location autocomplete.
 * @param {{ scope?: string, proximity?: { lat: number, lng: number } }} options
 */
export function useMapboxSearch({ scope = 'qatar', proximity } = {}) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const sessionRef = useRef(newSessionToken());
    const debounceRef = useRef(null);
    const scopeConfig = getSearchScope(scope);

    const clear = useCallback(() => setSuggestions([]), []);

    const suggest = useCallback(
        async (query) => {
            const q = String(query || '').trim();
            if (q.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const config = await fetchMapConfig();
                const token = getMapboxToken();
                if (!token) {
                    setSuggestions([]);
                    return;
                }
                const sc = getSearchScope(scope);
                const prox = proximity?.lng != null ? proximity : sc.proximity;

                const params = new URLSearchParams({
                    q,
                    access_token: token,
                    session_token: sessionRef.current,
                    language: config.language || 'en',
                    limit: '8',
                });

                if (sc.countries?.length) {
                    params.set('country', sc.countries.join(','));
                }
                if (sc.bbox?.length === 4) {
                    params.set('bbox', sc.bbox.join(','));
                }
                if (sc.types?.length) {
                    params.set('types', sc.types.join(','));
                }
                if (sc.poiCategories?.length) {
                    params.set('poi_category', sc.poiCategories.join(','));
                }
                if (prox?.lng != null && prox?.lat != null) {
                    params.set('proximity', `${prox.lng},${prox.lat}`);
                }

                const res = await fetch(
                    `https://api.mapbox.com/search/searchbox/v1/suggest?${params.toString()}`,
                );
                if (!res.ok) throw new Error('suggest failed');
                const data = await res.json();
                setSuggestions(
                    (data.suggestions || []).map((s) => {
                        const name = s.name || '';
                        const placeFormatted = s.place_formatted || '';
                        const full = s.full_address || placeFormatted || name;
                        return {
                            mapbox_id: s.mapbox_id,
                            name,
                            place_formatted: placeFormatted,
                            full_address: full,
                            secondary:
                                placeFormatted && placeFormatted !== name
                                    ? placeFormatted
                                    : full !== name
                                      ? full
                                      : '',
                            feature_type: s.feature_type,
                        };
                    }),
                );
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        },
        [scope, proximity?.lat, proximity?.lng],
    );

    const suggestDebounced = useCallback(
        (query) => {
            window.clearTimeout(debounceRef.current);
            debounceRef.current = window.setTimeout(() => suggest(query), 280);
        },
        [suggest],
    );

    const retrieve = useCallback(async (mapboxId) => {
        await fetchMapConfig();
        const token = getMapboxToken();
        if (!token || !mapboxId) return null;

        const params = new URLSearchParams({
            access_token: token,
            session_token: sessionRef.current,
        });
        const res = await fetch(
            `https://api.mapbox.com/search/searchbox/v1/retrieve/${encodeURIComponent(mapboxId)}?${params.toString()}`,
        );
        if (!res.ok) return null;
        const data = await res.json();
        const feature = data.features?.[0];
        if (!feature) return null;

        const props = feature.properties || {};
        const point = navigablePoint(feature);
        sessionRef.current = newSessionToken();

        return {
            label: props.full_address || props.name || props.place_formatted,
            name: props.name,
            lat: point.lat,
            lng: point.lng,
            place_id: props.mapbox_id || mapboxId,
            provider: 'mapbox',
        };
    }, []);

    useEffect(
        () => () => {
            window.clearTimeout(debounceRef.current);
        },
        [],
    );

    return {
        suggestions,
        loading,
        suggest,
        suggestDebounced,
        retrieve,
        clear,
        scopeConfig,
    };
}

export async function forwardGeocodeClient(query, scope = 'qatar') {
    const q = String(query || '').trim();
    if (q.length < 2) return null;

    const config = await fetchMapConfig();
    const token = getMapboxToken();
    if (!token) return null;
    const sc = getSearchScope(scope);
    const params = new URLSearchParams({
        q,
        access_token: token,
        limit: '1',
        language: config.language || 'en',
    });
    if (sc.countries?.length) params.set('country', sc.countries.join(','));
    if (sc.proximity?.lng != null && sc.proximity?.lat != null) {
        params.set('proximity', `${sc.proximity.lng},${sc.proximity.lat}`);
    }

    const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    const props = feature.properties || {};
    const point = navigablePoint(feature);
    if (point.lat == null || point.lng == null) return null;

    return {
        label: props.full_address || props.place_formatted || props.name || q,
        name: props.name || q,
        lat: point.lat,
        lng: point.lng,
        place_id: props.mapbox_id || feature.id,
        provider: 'mapbox',
    };
}

export async function reverseGeocodeClient(lng, lat) {
    const config = await fetchMapConfig();
    const token = getMapboxToken();
    if (!token) return null;
    const params = new URLSearchParams({
        longitude: String(lng),
        latitude: String(lat),
        access_token: token,
        language: config.language || 'en',
        limit: '1',
        types: 'address,street,poi',
    });
    let res = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?${params}`);
    if (!res.ok) return null;
    let data = await res.json();
    let feature = data.features?.[0];
    if (!feature) {
        params.delete('types');
        res = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?${params}`);
        if (!res.ok) return null;
        data = await res.json();
        feature = data.features?.[0];
    }
    if (!feature) return null;
    const props = feature.properties || {};
    return {
        label: props.full_address || props.place_formatted || props.name,
        name: props.name,
        lat,
        lng,
        place_id: props.mapbox_id || feature.id,
        provider: 'mapbox',
    };
}
