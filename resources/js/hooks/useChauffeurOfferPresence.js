import { useCallback, useEffect, useRef, useState } from 'react';
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
 *
 * @param {boolean} enabled
 * @param {{ onLocationPosted?: () => void }} [options]
 */
export default function useChauffeurOfferPresence(enabled, options = {}) {
    const { onLocationPosted } = options;
    const lastSent = useRef(null);
    const onPostedRef = useRef(onLocationPosted);
    onPostedRef.current = onLocationPosted;
    const [gpsStatus, setGpsStatus] = useState('idle'); // idle | watching | denied | unsupported | error
    const [gpsBusy, setGpsBusy] = useState(false);
    const [gpsNote, setGpsNote] = useState('');

    const send = useCallback((coords, force = false) => {
        if (!coords) return Promise.resolve(false);
        const fix = {
            lat: Number(coords.latitude),
            lng: Number(coords.longitude),
        };
        if (!Number.isFinite(fix.lat) || !Number.isFinite(fix.lng)) return Promise.resolve(false);

        const prev = lastSent.current;
        const moved = prev ? metersBetween(prev, fix) : Infinity;
        const stale = prev ? Date.now() - prev.at >= INTERVAL_MS : true;
        if (!force && prev && moved < MOVE_METERS && !stale) return Promise.resolve(true);

        lastSent.current = { ...fix, at: Date.now() };
        return postChauffeurLocation({
            latitude: fix.lat,
            longitude: fix.lng,
            accuracy: coords.accuracy,
            heading: coords.heading,
            speed: coords.speed,
            recorded_at: new Date().toISOString(),
        })
            .then(() => {
                setGpsStatus('watching');
                setGpsNote('');
                onPostedRef.current?.();
                return true;
            })
            .catch(() => false);
    }, []);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setGpsStatus('unsupported');
            setGpsNote('This browser cannot share location.');
            return Promise.resolve(false);
        }

        setGpsBusy(true);
        setGpsNote('Allow the location prompt if it appears.');

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    send(pos.coords, true)
                        .then((ok) => {
                            setGpsBusy(false);
                            if (ok) {
                                setGpsStatus('watching');
                                setGpsNote('');
                            } else {
                                setGpsStatus('error');
                                setGpsNote('Could not save your location. Try again.');
                            }
                            resolve(ok);
                        })
                        .catch(() => {
                            setGpsBusy(false);
                            setGpsStatus('error');
                            resolve(false);
                        });
                },
                (error) => {
                    setGpsBusy(false);
                    if (error?.code === 1) {
                        setGpsStatus('denied');
                        setGpsNote(
                            'Location is blocked. Open site settings, allow Location, then tap Enable location again.',
                        );
                    } else {
                        setGpsStatus('error');
                        setGpsNote('Could not get your position. Move outdoors or try again.');
                    }
                    resolve(false);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
            );
        });
    }, [send]);

    useEffect(() => {
        if (!enabled || !navigator.geolocation) {
            if (enabled && !navigator.geolocation) setGpsStatus('unsupported');
            return undefined;
        }

        let cancelled = false;
        let watchId = null;
        let intervalId = null;

        const tick = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    if (!cancelled) send(pos.coords, true);
                },
                (error) => {
                    if (cancelled) return;
                    if (error?.code === 1) setGpsStatus((s) => (s === 'watching' ? s : 'denied'));
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
            );
        };

        tick();
        intervalId = window.setInterval(tick, INTERVAL_MS);
        watchId = navigator.geolocation.watchPosition(
            (pos) => {
                if (!cancelled) send(pos.coords, false);
            },
            () => {},
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
        );

        return () => {
            cancelled = true;
            if (intervalId) window.clearInterval(intervalId);
            if (watchId != null) navigator.geolocation.clearWatch(watchId);
        };
    }, [enabled, send]);

    return {
        gpsStatus,
        gpsBusy,
        gpsNote,
        requestLocation,
    };
}
