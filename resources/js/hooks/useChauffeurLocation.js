import { useEffect, useRef } from 'react';
import { postChauffeurLocation } from '../api/bookings';

/**
 * Posts the chauffeur's browser position while the portal is open.
 * Does not block the page if the device refuses location.
 */
export default function useChauffeurLocation(bookingId) {
    const lastPost = useRef(0);
    const bookingRef = useRef(bookingId);
    bookingRef.current = bookingId;

    useEffect(() => {
        if (!navigator.geolocation) return undefined;

        const publish = (position) => {
            if (!position?.coords) return;
            const now = Date.now();
            if (now - lastPost.current < 4000) return;
            lastPost.current = now;
            const payload = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
                recorded_at: new Date(position.timestamp).toISOString(),
            };
            if (bookingRef.current) payload.booking_id = bookingRef.current;
            postChauffeurLocation(payload).catch(() => {});
        };

        const watchId = navigator.geolocation.watchPosition(publish, () => {}, {
            enableHighAccuracy: true,
            maximumAge: 4000,
            timeout: 20000,
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);
}
