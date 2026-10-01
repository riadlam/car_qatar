import { useEffect, useRef } from 'react';
import { postChauffeurLocation } from '../api/bookings';

const INTERVAL_MS = 20000;
const MOVE_METERS = 40;

function metersBetween(a, b) {
    if (!a || !b) return Infinity;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Keep chauffeur GPS fresh while browsing offers so the server can filter
 * and sort bookings by nearest pickup. Does not require an active trip.
 */
export default function useChauffeurOfferPresence(enabled) {
    const lastSent = useRef(null);

    useEffect(() => {
        if (!enabled || !navigator.geolocation) return undefined;

        let cancelled = false;
        let watchId = null;
        let intervalId = null;

        const send = (coords, force = false) => {
            if (cancelled || !coords) return;
            const fix = {
                lat: Number(coords.latitude),
                lng: Number(coords.longitude),
            };
            if (!Number.isFinite(fix.lat) || !Number.isFinite(fix.lng)) return;

            const prev = lastSent.current;
            const moved = prev ? metersBetween(prev, fix) : Infinity;
            const stale = prev ? Date.now() - prev.at >= INTERVAL_MS : true;
            if (!force && prev && moved < MOVE_METERS && !stale) return;

            lastSent.current = { ...fix, at: Date.now() };
            postChauffeurLocation({
                latitude: fix.lat,
                longitude: fix.lng,
                accuracy: coords.accuracy,
                heading: coords.heading,
                speed: coords.speed,
                recorded_at: new Date().toISOString(),
            }).catch(() => {});
        };

        const tick = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => send(pos.coords, true),
                () => {},
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
            );
        };

        tick();
        intervalId = window.setInterval(tick, INTERVAL_MS);
        watchId = navigator.geolocation.watchPosition(
            (pos) => send(pos.coords, false),
            () => {},
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
        );

        return () => {
            cancelled = true;
            if (intervalId) window.clearInterval(intervalId);
            if (watchId != null) navigator.geolocation.clearWatch(watchId);
        };
    }, [enabled]);
}
