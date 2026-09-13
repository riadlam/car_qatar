import { useEffect, useRef } from 'react';
import { postChauffeurLocation } from '../api/bookings';

const MOVE_METERS = 8;
const JITTER_METERS = 3;
const MIN_SEND_MS = 1000;
const ARRIVAL_METERS = 5;

function metersBetween(a, b) {
    if (!a || !b || a.lat == null || b.lat == null) return Infinity;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371000 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function point(lat, lng) {
    const latitude = Number(lat);
    const longitude = Number(lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { lat: latitude, lng: longitude };
}

/**
 * Device GPS while a trip is active. The local map follows every fix.
 * The passenger map is updated over the websocket about once a second while moving, never from a trail.
 * Does not block the page if the device refuses location.
 *
 * @param {{ bookingId: number|string, pickup?: {lat:number,lng:number}|null, dropoff?: {lat:number,lng:number}|null, onFix?: (fix: {lat:number,lng:number,heading:number|null}) => void }|null} trip
 */
export default function useChauffeurLocation(trip) {
    const tripRef = useRef(trip);
    tripRef.current = trip;
    const sentRef = useRef(null);

    useEffect(() => {
        if (!trip?.bookingId || !navigator.geolocation) return undefined;

        sentRef.current = null;

        const publish = (position) => {
            const current = tripRef.current;
            if (!current?.bookingId || !position?.coords) return;

            const fix = point(position.coords.latitude, position.coords.longitude);
            if (!fix) return;

            current.onFix?.({
                lat: fix.lat,
                lng: fix.lng,
                heading: Number.isFinite(position.coords.heading) ? position.coords.heading : null,
            });

            const sent = sentRef.current;
            const pickup = point(current.pickup?.lat, current.pickup?.lng);
            const dropoff = point(current.dropoff?.lat, current.dropoff?.lng);
            const nearPickup = pickup ? metersBetween(fix, pickup) <= ARRIVAL_METERS : false;
            const nearDropoff = dropoff ? metersBetween(fix, dropoff) <= ARRIVAL_METERS : false;
            const distance = sent ? metersBetween(fix, sent) : Infinity;
            const elapsed = sent ? Date.now() - sent.at : Infinity;
            const arrival = (nearPickup && !sent?.nearPickup) || (nearDropoff && !sent?.nearDropoff);
            const moving = distance >= MOVE_METERS || (distance >= JITTER_METERS && elapsed >= MIN_SEND_MS);

            if (sent && !moving && !arrival) return;

            sentRef.current = { ...fix, nearPickup, nearDropoff, at: Date.now() };
            postChauffeurLocation({
                booking_id: current.bookingId,
                latitude: fix.lat,
                longitude: fix.lng,
                accuracy: position.coords.accuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
                recorded_at: new Date(position.timestamp).toISOString(),
            }).catch(() => {});
        };

        const watchId = navigator.geolocation.watchPosition(publish, () => {}, {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 20000,
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, [trip?.bookingId]);
}
