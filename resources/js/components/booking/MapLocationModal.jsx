import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Skeleton from '../ui/Skeleton';
import {
    fetchMapConfig,
    hasMapboxToken,
    addCompactAttribution,
    mapInitOptions,
} from '../../maps/mapboxClient';
import { createHtmlElement, simplePinHtml } from '../../maps/markers';
import { bboxToMaxBounds, expandBbox, getSearchScope, pointInBbox } from '../../maps/searchScopes';
import { forwardGeocodeClient, reverseGeocodeClient, useMapboxSearch } from '../../maps/useMapboxSearch';

function LocateIcon({ spinning }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={spinning ? 'animate-spin' : undefined}
        >
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
            <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.75" />
            <path
                d="M12 2.25v3.1M12 18.65v3.1M2.25 12h3.1M18.65 12h3.1"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
        </svg>
    );
}

/**
 * Map selection sheet — Mapbox GL + Search Box (scoped by field).
 */
export default function MapLocationModal({
    open,
    label = 'location',
    initialValue = '',
    initialPlace = null,
    searchScope = 'qatar',
    onClose,
    onSelect,
}) {
    const mapEl = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const initialValueRef = useRef(initialValue);
    const initialPlaceRef = useRef(initialPlace);
    const scopeRef = useRef(getSearchScope(searchScope));
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);
    const [message, setMessage] = useState('');
    const [locating, setLocating] = useState(false);
    const [config, setConfig] = useState(null);
    const scopeConfig = getSearchScope(searchScope);
    const { suggestions, loading, suggestDebounced, retrieve, clear } = useMapboxSearch({
        scope: searchScope,
        proximity: scopeConfig.proximity,
    });

    initialValueRef.current = initialValue;
    initialPlaceRef.current = initialPlace;
    scopeRef.current = scopeConfig;

    const place = useCallback(async (lat, lng, preset = null) => {
        const sc = scopeRef.current;
        if (!pointInBbox(lng, lat, sc.bbox)) {
            setMessage(sc.outOfBoundsMessage);
            return;
        }

        const map = mapRef.current;
        const color = config?.marker_color || '#5b0520';
        if (map) {
            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new mapboxgl.Marker({
                    element: createHtmlElement(simplePinHtml(color)),
                    anchor: 'bottom',
                })
                    .setLngLat([lng, lat])
                    .addTo(map);
            }
            map.easeTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 14) });
        }

        if (preset?.label) {
            setSelected({
                label: preset.label,
                lat,
                lng,
                place_id: preset.place_id || null,
                provider: 'mapbox',
                name: preset.name || preset.label,
            });
            setMessage('');
            return;
        }

        setSelected({ label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng, provider: 'mapbox' });
        try {
            const rev = await reverseGeocodeClient(lng, lat);
            if (rev?.label) {
                setSelected({
                    ...rev,
                    lat,
                    lng,
                });
                setQuery(rev.label);
            }
            setMessage('');
        } catch {
            setMessage('Address lookup unavailable — coordinates will be used.');
        }
    }, [config?.marker_color]);

    useEffect(() => {
        if (!open) return undefined;

        const typed = String(initialValueRef.current || '').trim();
        const preset = initialPlaceRef.current;
        const presetLat = Number(preset?.lat);
        const presetLng = Number(preset?.lng);
        const hasPreset = Number.isFinite(presetLat) && Number.isFinite(presetLng);
        setQuery(typed || preset?.label || '');
        setLocating(false);
        setSelected(
            hasPreset
                ? {
                      label: preset.label || typed,
                      name: preset.name || preset.label || typed,
                      lat: presetLat,
                      lng: presetLng,
                      place_id: preset.place_id || null,
                      provider: 'mapbox',
                  }
                : null,
        );
        setMessage('');
        clear();

        let cancelled = false;
        let map;
        const sc = getSearchScope(searchScope);
        const fitBounds = bboxToMaxBounds(sc.bbox);
        // Padded maxBounds so Mapbox doesn't drop the constraint on wide containers
        const maxBounds = bboxToMaxBounds(expandBbox(sc.bbox, searchScope === 'gulf' ? 0.12 : 0.45));

        const frameToScope = (instance) => {
            if (!instance || cancelled) return;
            instance.resize();
            try {
                instance.setProjection('mercator');
            } catch {
                /* ignore */
            }
            if (maxBounds) instance.setMaxBounds(maxBounds);
            if (sc.minZoom != null) instance.setMinZoom(sc.minZoom);
            if (fitBounds) {
                instance.fitBounds(fitBounds, {
                    padding: 36,
                    duration: 0,
                    maxZoom: sc.fitMaxZoom ?? 11,
                });
            }
        };

        fetchMapConfig().then((cfg) => {
            if (cancelled || !mapEl.current) return;
            if (!hasMapboxToken()) {
                setMessage('Maps unavailable — add the Mapbox public token on the server.');
                return;
            }
            setConfig(cfg);
            map = addCompactAttribution(new mapboxgl.Map(
                mapInitOptions(mapEl.current, cfg, {
                    lng: hasPreset ? presetLng : sc.proximity.lng,
                    lat: hasPreset ? presetLat : sc.proximity.lat,
                    zoom: hasPreset ? 15 : (sc.fitMaxZoom ?? (searchScope === 'gulf' ? 5 : 11)),
                    minZoom: sc.minZoom,
                    maxBounds,
                    ...(hasPreset
                        ? {}
                        : {
                              bounds: fitBounds,
                              fitBoundsOptions: { padding: 36, maxZoom: sc.fitMaxZoom ?? 11 },
                          }),
                    renderWorldCopies: false,
                    projection: 'mercator',
                }),
            ));
            map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
            map.on('click', (e) => place(e.lngLat.lat, e.lngLat.lng));
            mapRef.current = map;

            // Re-assert after Standard style may flip to globe
            try {
                map.setProjection('mercator');
            } catch {
                /* older builds */
            }

            const showExisting = async () => {
                if (cancelled) return;
                map.resize();
                const current = initialPlaceRef.current;
                const lat = Number(current?.lat);
                const lng = Number(current?.lng);
                if (Number.isFinite(lat) && Number.isFinite(lng)) {
                    place(lat, lng, {
                        label: current.label || typed,
                        name: current.name || current.label || typed,
                        place_id: current.place_id,
                    });
                    return;
                }
                if (typed.length >= 2) {
                    try {
                        const found = await forwardGeocodeClient(typed, searchScope);
                        if (cancelled) return;
                        if (found && pointInBbox(found.lng, found.lat, scopeRef.current.bbox)) {
                            place(found.lat, found.lng, found);
                            return;
                        }
                    } catch {
                        /* fall through to the country frame */
                    }
                }
                frameToScope(map);
            };

            const onReady = () => {
                showExisting();
            };

            if (map.loaded()) onReady();
            else map.once('load', onReady);
        });

        return () => {
            cancelled = true;
            markerRef.current = null;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [open, place, clear, searchScope]);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') return null;

    const pickSuggestion = async (s) => {
        const result = await retrieve(s.mapbox_id);
        if (!result) {
            setMessage('Could not load that place — try another or tap the map.');
            return;
        }
        if (!pointInBbox(result.lng, result.lat, scopeConfig.bbox)) {
            setMessage(scopeConfig.outOfBoundsMessage);
            return;
        }
        setQuery(result.label);
        clear();
        place(result.lat, result.lng, result);
    };

    const locateUser = () => {
        if (typeof window === 'undefined' || !window.isSecureContext) {
            setMessage('Location needs a secure page (localhost or HTTPS). Search or tap the map instead.');
            return;
        }
        if (!navigator.geolocation) {
            setMessage('Location is not available in this browser. Search or tap the map instead.');
            return;
        }

        setLocating(true);
        setMessage('Asking for your location…');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocating(false);
                place(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
                setLocating(false);
                setMessage(
                    err?.code === 1
                        ? 'Location permission was denied. Search or tap the map instead.'
                        : 'Could not read your location. Search or tap the map instead.',
                );
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-[210] flex items-end justify-center sm:items-center sm:p-4">
            <button type="button" className="absolute inset-0 border-0 bg-ink/50" aria-label="Close" onClick={onClose} />
            <div className="relative z-[1] flex max-h-[min(92dvh,760px)] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
                <div className="flex items-center justify-between border-b border-[#eef1f3] px-5 py-4">
                    <h2 className="font-fragment m-0 text-[22px] font-400 text-ink-text">Select {label.toLowerCase()}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-2xl text-muted hover:bg-page"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    <div className="relative">
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                suggestDebounced(e.target.value);
                            }}
                            className="font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700"
                            placeholder={scopeConfig.searchHint}
                            aria-label="Search for a place"
                            autoComplete="off"
                        />
                        {loading ? (
                            <span className="absolute top-1/2 right-3 w-16 -translate-y-1/2">
                                <Skeleton variant="inline" />
                            </span>
                        ) : null}
                    </div>

                    {searchScope === 'school' && (
                        <p className="font-geist mt-2 m-0 text-[13px] leading-4 text-muted">
                            Showing schools and universities in Qatar only.
                        </p>
                    )}

                    {suggestions.length > 0 && (
                        <ul className="mt-3 m-0 list-none space-y-1 p-0">
                            {suggestions.map((s) => (
                                <li key={s.mapbox_id}>
                                    <button
                                        type="button"
                                        onClick={() => pickSuggestion(s)}
                                        className="font-geist flex w-full cursor-pointer items-start gap-2 rounded-lg px-3 py-2.5 text-left transition hover:bg-page"
                                    >
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-[15px] leading-5 font-500 text-ink-text">
                                                {s.name}
                                            </span>
                                            {s.secondary ? (
                                                <span className="mt-0.5 block truncate text-[13px] leading-4 text-muted">
                                                    {s.secondary}
                                                </span>
                                            ) : null}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="relative mt-4">
                        <div
                            ref={mapEl}
                            className="almajd-mb-map h-[300px] w-full overflow-hidden rounded-lg border border-[#e0ddd6] bg-[#e8e6e1]"
                        />
                        <button
                            type="button"
                            onClick={locateUser}
                            disabled={locating}
                            aria-label="Use my location"
                            title="Use my location"
                            className="absolute top-2 right-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[10px] bg-white text-ink-text shadow-[0_2px_10px_rgba(15,19,25,0.12)] transition hover:bg-page disabled:cursor-wait disabled:opacity-70"
                        >
                            <LocateIcon spinning={locating} />
                        </button>
                    </div>

                    <p className="font-geist mt-3 m-0 text-[14px] leading-5 text-muted">
                        {message || scopeConfig.mapHint}
                    </p>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#eef1f3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-geist m-0 min-w-0 truncate text-[15px] leading-6 text-ink-text">
                        {selected?.label || 'No location selected yet'}
                    </p>
                    <button
                        type="button"
                        disabled={!selected}
                        onClick={() => selected && onSelect?.(selected)}
                        className="font-geist shrink-0 cursor-pointer rounded-full bg-wine-700 px-6 py-2.5 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Confirm location
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
