import { useEffect, useId, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function shortPlace(label) {
    if (!label) return 'STOP';
    const cleaned = String(label).replace(/,.*/, '').trim();
    return cleaned.length > 16 ? `${cleaned.slice(0, 14)}…` : cleaned;
}

function pinIconA(label) {
    return L.divIcon({
        className: 'almajd-map-marker',
        iconSize: [120, 48],
        iconAnchor: [60, 44],
        html: `<div class="almajd-pin-wrap">
            <span class="almajd-pin-label">${escapeHtml(shortPlace(label))}</span>
            <svg width="26" height="34" viewBox="0 0 23 32" fill="none" aria-hidden="true">
              <circle cx="11.29" cy="11.29" r="11.29" fill="#f0c5d2"/>
              <line x1="11.5" y1="20.4" x2="11.5" y2="29.6" stroke="#5b0520" stroke-width="3" stroke-linecap="round"/>
              <circle cx="11.29" cy="11.29" r="9.4" fill="#5b0520"/>
              <circle cx="11.29" cy="11.29" r="4.7" fill="#FBF8F2"/>
            </svg>
          </div>`,
    });
}

function pinIconB(label) {
    return L.divIcon({
        className: 'almajd-map-marker',
        iconSize: [120, 42],
        iconAnchor: [60, 28],
        html: `<div class="almajd-pin-wrap">
            <span class="almajd-pin-label">${escapeHtml(shortPlace(label))}</span>
            <span class="almajd-pin-b"><span class="almajd-pin-b-dot"></span></span>
          </div>`,
    });
}

/** Top-down luxury sedan — nose up; rotate via .almajd-car-rot */
function carIcon() {
    return L.divIcon({
        className: 'almajd-map-marker almajd-car-marker',
        iconSize: [52, 52],
        iconAnchor: [26, 26],
        html: `<div class="almajd-car-wrap">
            <div class="almajd-car-glow"></div>
            <div class="almajd-car-rot">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                <ellipse cx="21" cy="24" rx="9.5" ry="15" fill="rgba(15,19,25,0.16)"/>
                <path d="M21 4.8c-2.35 0-4.25.7-5.45 2-1.3 1.45-2 3.65-2.1 6.3l-.35 9.2c-.06 1.55.32 2.75 1.2 3.6.8.8 2 1.25 3.45 1.35l3.25.22 3.25-.22c1.45-.1 2.65-.55 3.45-1.35.88-.85 1.26-2.05 1.2-3.6l-.35-9.2c-.1-2.65-.8-4.85-2.1-6.3C25.25 5.5 23.35 4.8 21 4.8Z" fill="#1a0a10"/>
                <path d="M21 6.2c-1.9 0-3.35.5-4.3 1.55-1 1.1-1.55 2.9-1.65 5.2l-.28 8.35c-.04 1.1.22 1.95.78 2.5.5.5 1.35.85 2.4.95l3.05.2 3.05-.2c1.05-.1 1.9-.45 2.4-.95.56-.55.82-1.4.78-2.5l-.28-8.35c-.1-2.3-.65-4.1-1.65-5.2C24.35 6.7 22.9 6.2 21 6.2Z" fill="#5b0520"/>
                <path d="M17.05 12.6c.4-1.85 1.5-2.85 3.95-2.85s3.55 1 3.95 2.85l.6 3.7c.1.6-.28 1.1-.82 1.15h-7.46c-.54-.05-.92-.55-.82-1.15l.6-3.7Z" fill="#f7d6e0"/>
                <path d="M16.85 24.8c.28 1.5 1.25 2.3 4.15 2.3s3.87-.8 4.15-2.3l.38-1.85c.08-.45-.22-.82-.65-.88h-7.76c-.43.06-.73.43-.65.88l.38 1.85Z" fill="#f0c5d2" fill-opacity="0.7"/>
                <rect x="14.7" y="18.2" width="2.35" height="3.7" rx="1.05" fill="#0f1319" fill-opacity="0.32"/>
                <rect x="24.95" y="18.2" width="2.35" height="3.7" rx="1.05" fill="#0f1319" fill-opacity="0.32"/>
                <path d="M19 8.35h4" stroke="#FBF8F2" stroke-width="1.6" stroke-linecap="round"/>
                <circle cx="21" cy="21" r="1.2" fill="#FBF8F2" fill-opacity="0.28"/>
              </svg>
            </div>
          </div>`,
    });
}

function lerpAngle(from, to, t) {
    const diff = ((((to - from) % 360) + 540) % 360) - 180;
    return from + diff * t;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function pointAlong(latLngs, t) {
    if (!latLngs?.length) return null;
    if (latLngs.length === 1) return { latlng: L.latLng(latLngs[0]), heading: 0 };
    const clamped = Math.min(1, Math.max(0, t));
    let total = 0;
    const segs = [];
    for (let i = 0; i < latLngs.length - 1; i += 1) {
        const a = L.latLng(latLngs[i]);
        const b = L.latLng(latLngs[i + 1]);
        const d = a.distanceTo(b);
        segs.push({ a, b, d });
        total += d;
    }
    if (total <= 0) return { latlng: L.latLng(latLngs[0]), heading: 0 };
    let remain = clamped * total;
    for (let i = 0; i < segs.length; i += 1) {
        const { a, b, d } = segs[i];
        if (remain <= d || i === segs.length - 1) {
            const u = d > 0 ? Math.min(1, remain / d) : 0;
            const lat = a.lat + (b.lat - a.lat) * u;
            const lng = a.lng + (b.lng - a.lng) * u;
            const heading = (Math.atan2(b.lng - a.lng, b.lat - a.lat) * 180) / Math.PI;
            return { latlng: L.latLng(lat, lng), heading };
        }
        remain -= d;
    }
    const last = latLngs[latLngs.length - 1];
    return { latlng: L.latLng(last), heading: 0 };
}

async function fetchRoadRoute(start, end) {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('route failed');
    const data = await res.json();
    const coords = data?.routes?.[0]?.geometry?.coordinates;
    if (!coords?.length) throw new Error('no geometry');
    return coords.map(([lng, lat]) => [lat, lng]);
}

function setCarTransform(marker, heading) {
    const el = marker?.getElement()?.querySelector('.almajd-car-rot');
    if (el) el.style.transform = `rotate(${heading}deg)`;
}

/**
 * Leaflet map with OSRM road route between A (pickup) and B (dropoff).
 * Live car uses RAF streaming motion (websocket-feel), not polling jumps.
 */
export default function RouteMap({
    pickupLabel = 'Pickup',
    dropoffLabel = 'Drop-off',
    lat = 28.564641,
    lng = 77.159464,
    dropLat,
    dropLng,
    className = '',
    showCar = false,
    /** Full loop duration in ms when live-tracking */
    carLoopMs = 52000,
    onCarProgress,
    fitPaddingTopLeft = [24, 28],
    fitPaddingBottomRight = [24, 48],
}) {
    const mapEl = useRef(null);
    const mapRef = useRef(null);
    const layersRef = useRef({ route: null, a: null, b: null, car: null });
    const routePtsRef = useRef(null);
    const carStateRef = useRef({ progress: 0.12, heading: 0, lastTs: 0 });
    const onProgressRef = useRef(onCarProgress);
    const reactId = useId().replace(/:/g, '');
    const [ready, setReady] = useState(false);

    const endLat = dropLat ?? lat + 0.022;
    const endLng = dropLng ?? lng + 0.028;

    useEffect(() => {
        onProgressRef.current = onCarProgress;
    }, [onCarProgress]);

    useEffect(() => {
        if (!mapEl.current || mapRef.current) return undefined;

        const map = L.map(mapEl.current, {
            zoomControl: false,
            attributionControl: false,
            dragging: true,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
        }).setView([lat, lng], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd',
        }).addTo(map);

        mapRef.current = map;
        setReady(true);

        const onResize = () => map.invalidateSize();
        window.addEventListener('resize', onResize);

        const ro =
            typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => {
                      map.invalidateSize();
                  })
                : null;
        if (ro && mapEl.current) ro.observe(mapEl.current);

        requestAnimationFrame(() => map.invalidateSize());

        return () => {
            window.removeEventListener('resize', onResize);
            ro?.disconnect();
            map.remove();
            mapRef.current = null;
            layersRef.current = { route: null, a: null, b: null, car: null };
            routePtsRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !ready) return undefined;

        let cancelled = false;

        const draw = async () => {
            const start = { lat, lng };
            const end = { lat: endLat, lng: endLng };

            const prev = layersRef.current;
            if (prev.route) map.removeLayer(prev.route);
            if (prev.a) map.removeLayer(prev.a);
            if (prev.b) map.removeLayer(prev.b);
            if (prev.car) map.removeLayer(prev.car);

            let latLngs;
            try {
                latLngs = await fetchRoadRoute(start, end);
            } catch {
                latLngs = [
                    [start.lat, start.lng],
                    [end.lat, end.lng],
                ];
            }
            if (cancelled) return;

            routePtsRef.current = latLngs;

            const route = L.polyline(latLngs, {
                color: '#5b0520',
                weight: 4,
                opacity: 0.9,
                lineJoin: 'round',
                lineCap: 'round',
            }).addTo(map);

            const a = L.marker([start.lat, start.lng], {
                icon: pinIconA(pickupLabel),
                interactive: false,
            }).addTo(map);

            const b = L.marker([end.lat, end.lng], {
                icon: pinIconB(dropoffLabel),
                interactive: false,
            }).addTo(map);

            let car = null;
            if (showCar) {
                const pos = pointAlong(latLngs, carStateRef.current.progress);
                if (pos) {
                    car = L.marker(pos.latlng, {
                        icon: carIcon(),
                        interactive: false,
                        zIndexOffset: 800,
                    }).addTo(map);
                    carStateRef.current.heading = pos.heading;
                    requestAnimationFrame(() => setCarTransform(car, pos.heading));
                }
            }

            layersRef.current = { route, a, b, car };

            const bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, {
                paddingTopLeft: fitPaddingTopLeft,
                paddingBottomRight: fitPaddingBottomRight,
                maxZoom: 15,
                animate: false,
            });
            map.invalidateSize();
            requestAnimationFrame(() => map.invalidateSize());
        };

        draw();
        return () => {
            cancelled = true;
        };
    }, [
        ready,
        lat,
        lng,
        endLat,
        endLng,
        pickupLabel,
        dropoffLabel,
        showCar,
        fitPaddingTopLeft,
        fitPaddingBottomRight,
    ]);

    // Smooth RAF stream — continuous motion like a live location socket
    useEffect(() => {
        if (!ready || !showCar) return undefined;

        let raf = 0;
        let lastUiEmit = 0;
        carStateRef.current.lastTs = 0;

        const tick = (ts) => {
            const map = mapRef.current;
            const pts = routePtsRef.current;
            const state = carStateRef.current;

            if (!map || !pts?.length) {
                raf = requestAnimationFrame(tick);
                return;
            }

            if (!state.lastTs) state.lastTs = ts;
            const dt = Math.min(48, ts - state.lastTs);
            state.lastTs = ts;

            // Steady cruise + tiny noise so it feels live, not robotic
            const speed = 1 / Math.max(12000, carLoopMs);
            const jitter = Math.sin(ts / 900) * 0.000015;
            state.progress += dt * (speed + jitter);
            if (state.progress >= 0.92) state.progress = 0.1;

            const pos = pointAlong(pts, state.progress);
            if (pos) {
                let car = layersRef.current.car;
                if (!car) {
                    car = L.marker(pos.latlng, {
                        icon: carIcon(),
                        interactive: false,
                        zIndexOffset: 800,
                    }).addTo(map);
                    layersRef.current.car = car;
                    state.heading = pos.heading;
                } else {
                    car.setLatLng(pos.latlng);
                }

                // Smooth heading (no icon rebuild)
                state.heading = lerpAngle(state.heading, pos.heading, Math.min(1, dt / 140));
                setCarTransform(car, state.heading);
            }

            if (ts - lastUiEmit > 200) {
                lastUiEmit = ts;
                onProgressRef.current?.(state.progress);
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            const car = layersRef.current.car;
            if (car && mapRef.current) {
                mapRef.current.removeLayer(car);
                layersRef.current.car = null;
            }
        };
    }, [ready, showCar, carLoopMs]);

    return (
        <div
            className={`relative z-0 isolate overflow-hidden bg-[#e8e6e1] ${className}`}
            data-map={reactId}
            style={{ zIndex: 0 }}
        >
            <div ref={mapEl} className="almajd-route-map absolute inset-0 z-0 h-full w-full" />
        </div>
    );
}
