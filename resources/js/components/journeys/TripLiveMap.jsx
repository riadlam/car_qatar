import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { addCompactAttribution, fetchMapConfig, hasMapboxToken, mapInitOptions } from '../../maps/mapboxClient';
import { frameRoute } from '../../maps/frameRoute';
import { createHtmlElement, dropMarkerHtml, pinMarkerHtml, vanMarkerHtml } from '../../maps/markers';
import { fetchMapboxDirections, pointAlongLine, setRouteGeoJson } from '../../maps/useMapboxDirections';

function lerpAngle(from, to, t) {
    const diff = ((((to - from) % 360) + 540) % 360) - 180;
    return from + diff * t;
}

/**
 * Live trip map — Mapbox Directions route + live GPS or simulated car motion.
 */
export default function TripLiveMap({
    pickupLabel = 'Pickup',
    dropoffLabel = 'Drop-off',
    lat = 25.2854,
    lng = 51.531,
    dropLat,
    dropLng,
    className = '',
    showCar = false,
    carLoopMs = 48000,
    onCarProgress,
    carLat = null,
    carLng = null,
    liveProgress = null,
    targetLat = null,
    targetLng = null,
}) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const routeCoordsRef = useRef(null);
    const markersRef = useRef({ a: null, b: null, car: null });
    const carStateRef = useRef({ progress: 0.14, heading: 0, lastTs: 0, lastLive: null, routeKey: '' });
    const showCarRef = useRef(showCar);
    const onProgressRef = useRef(onCarProgress);
    const propsRef = useRef({
        carLoopMs,
        carLat,
        carLng,
        liveProgress,
        targetLat,
        targetLng,
        pickupLabel,
        dropoffLabel,
        lat,
        lng,
        dropLat,
        dropLng,
    });

    propsRef.current = {
        carLoopMs,
        carLat,
        carLng,
        liveProgress,
        targetLat,
        targetLng,
        pickupLabel,
        dropoffLabel,
        lat,
        lng,
        dropLat,
        dropLng,
    };
    showCarRef.current = showCar;
    onProgressRef.current = onCarProgress;

    useEffect(() => {
        if (!containerRef.current) return undefined;

        let cancelled = false;
        let raf = 0;
        let map;

        fetchMapConfig().then(async (config) => {
            if (cancelled || !containerRef.current) return;
            if (!hasMapboxToken()) return;
            const color = config.marker_color || '#5b0520';
            const endLat = dropLat ?? lat + 0.022;
            const endLng = dropLng ?? lng + 0.028;

            map = addCompactAttribution(new mapboxgl.Map(
                mapInitOptions(containerRef.current, config, {
                    lat,
                    lng,
                    zoom: 12,
                }),
            ));
            map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
            mapRef.current = map;

            map.on('load', async () => {
                markersRef.current.a = new mapboxgl.Marker({
                    element: createHtmlElement(pinMarkerHtml(pickupLabel, color)),
                    anchor: 'bottom',
                })
                    .setLngLat([lng, lat])
                    .addTo(map);

                markersRef.current.b = new mapboxgl.Marker({
                    element: createHtmlElement(dropMarkerHtml(dropoffLabel)),
                    anchor: 'bottom',
                })
                    .setLngLat([endLng, endLat])
                    .addTo(map);

                let coordinates;
                try {
                    const route = await fetchMapboxDirections(
                        { lat, lng },
                        { lat: endLat, lng: endLng },
                    );
                    coordinates = route?.coordinates;
                } catch {
                    coordinates = null;
                }
                if (!coordinates?.length) {
                    coordinates = [
                        [lng, lat],
                        [endLng, endLat],
                    ];
                }
                if (cancelled) return;

                routeCoordsRef.current = coordinates;
                setRouteGeoJson(map, coordinates, color);
                const frame = () => frameRoute(map, coordinates);
                frame();
                window.requestAnimationFrame(frame);

                const tick = (ts) => {
                    if (cancelled) return;
                    raf = requestAnimationFrame(tick);

                    const coords = routeCoordsRef.current;
                    if (!showCarRef.current || !coords?.length) {
                        if (markersRef.current.car) {
                            markersRef.current.car.remove();
                            markersRef.current.car = null;
                        }
                        return;
                    }

                    const p = propsRef.current;
                    const hasLive =
                        p.carLat != null &&
                        p.carLng != null &&
                        Number.isFinite(Number(p.carLat)) &&
                        Number.isFinite(Number(p.carLng));

                    const destLat = Number.isFinite(Number(p.targetLat)) ? Number(p.targetLat) : Number(p.dropLat ?? p.lat);
                    const destLng = Number.isFinite(Number(p.targetLng)) ? Number(p.targetLng) : Number(p.dropLng ?? p.lng);
                    const approachFromLat = Number.isFinite(Number(p.dropLat)) ? Number(p.dropLat) : Number(p.lat) + 0.02;
                    const approachFromLng = Number.isFinite(Number(p.dropLng)) ? Number(p.dropLng) : Number(p.lng) + 0.02;
                    const fromLat = hasLive ? Number(p.carLat) : approachFromLat;
                    const fromLng = hasLive ? Number(p.carLng) : approachFromLng;
                    const nextKey = `${hasLive ? fromLat.toFixed(3) : 'approach'},${hasLive ? fromLng.toFixed(3) : '0'}>${destLat.toFixed(5)},${destLng.toFixed(5)}`;
                    const state = carStateRef.current;
                    if (nextKey !== state.routeKey && Number.isFinite(destLat) && Number.isFinite(destLng)) {
                        state.routeKey = nextKey;
                        if (!hasLive) state.progress = 0.12;
                        fetchMapboxDirections({ lat: fromLat, lng: fromLng }, { lat: destLat, lng: destLng })
                            .then((route) => {
                                const nextCoords = route?.coordinates?.length
                                    ? route.coordinates
                                    : [[fromLng, fromLat], [destLng, destLat]];
                                if (cancelled) return;
                                routeCoordsRef.current = nextCoords;
                                setRouteGeoJson(map, nextCoords, color);
                                frameRoute(map, nextCoords);
                            })
                            .catch(() => {});
                    }

                    let lngLat;
                    let heading = state.heading;

                    if (!hasLive) {
                        if (!state.lastTs) state.lastTs = ts;
                        const dt = Math.min(40, ts - state.lastTs);
                        state.lastTs = ts;
                        if (state.progress < 0.9) {
                            state.progress += dt / Math.max(28000, p.carLoopMs || 48000);
                        }
                        const pos = pointAlongLine(routeCoordsRef.current, Math.min(0.9, state.progress));
                        if (!pos) return;
                        lngLat = { lng: pos.lng, lat: pos.lat };
                        heading = pos.heading;
                    } else {
                        lngLat = { lng: Number(p.carLng), lat: Number(p.carLat) };
                    }

                    if (state.lastLive) {
                        const dLat = lngLat.lat - state.lastLive.lat;
                        const dLng = lngLat.lng - state.lastLive.lng;
                        if (Math.abs(dLat) + Math.abs(dLng) > 1e-7) {
                            heading = (Math.atan2(dLng, dLat) * 180) / Math.PI;
                        }
                    }
                    state.lastLive = lngLat;
                    const progress =
                        p.liveProgress != null && Number.isFinite(Number(p.liveProgress))
                            ? Number(p.liveProgress)
                            : state.progress;
                    state.progress = progress;
                    if (!tick._lastUi || ts - tick._lastUi > 220) {
                        tick._lastUi = ts;
                        onProgressRef.current?.(progress);
                    }

                    if (!markersRef.current.car) {
                        markersRef.current.car = new mapboxgl.Marker({
                            element: createHtmlElement(vanMarkerHtml()),
                            anchor: 'center',
                        })
                            .setLngLat([lngLat.lng, lngLat.lat])
                            .addTo(map);
                        state.heading = heading;
                    } else {
                        markersRef.current.car.setLngLat([lngLat.lng, lngLat.lat]);
                    }

                    if (!state.lastTs) state.lastTs = ts;
                    const dt = Math.min(40, ts - state.lastTs);
                    state.lastTs = ts;
                    state.heading = lerpAngle(state.heading, heading, Math.min(1, dt / 160));
                    const rot = markersRef.current.car
                        .getElement()
                        ?.querySelector('.almajd-mb-car-rot');
                    if (rot) rot.style.transform = `rotate(${state.heading}deg)`;
                };

                raf = requestAnimationFrame(tick);
            });
        });

        const onResize = () => {
            const map = mapRef.current;
            const coords = routeCoordsRef.current;
            if (!map) return;
            if (coords?.length) frameRoute(map, coords);
            else map.resize();
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            Object.values(markersRef.current).forEach((m) => m?.remove?.());
            markersRef.current = { a: null, b: null, car: null };
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            routeCoordsRef.current = null;
        };
        // Mount once — live props via refs
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`relative isolate overflow-hidden bg-[#e8e6e1] ${className}`}>
            <div ref={containerRef} className="almajd-mb-map absolute inset-0 z-0 h-full w-full" />
        </div>
    );
}
