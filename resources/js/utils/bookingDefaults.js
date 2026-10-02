import { reverseGeocodeClient } from '../maps/useMapboxSearch';

/** Local YYYY-MM-DD for date inputs. */
export function todayLocal(date = new Date()) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Next sensible pickup time (HH:MM), rounded up to 15 minutes,
 * at least `leadMinutes` from now.
 */
export function defaultPickupTime(leadMinutes = 20) {
    const d = new Date();
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + leadMinutes);
    const rounded = Math.ceil(d.getMinutes() / 15) * 15;
    if (rounded === 60) {
        d.setHours(d.getHours() + 1);
        d.setMinutes(0);
    } else {
        d.setMinutes(rounded);
    }
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Resolve current device location into a Mapbox place label + coords.
 * Returns null if permission denied / unavailable.
 */
export function detectCurrentPickup(options = {}) {
    const {
        timeout = 12000,
        maximumAge = 60000,
        enableHighAccuracy = true,
    } = options;

    return new Promise((resolve) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = Number(pos.coords.latitude);
                    const lng = Number(pos.coords.longitude);
                    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                        resolve(null);
                        return;
                    }
                    const place = await reverseGeocodeClient(lng, lat);
                    resolve({
                        label: place?.label || place?.name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                        coords: { lat, lng },
                        place_id: place?.place_id || null,
                    });
                } catch {
                    resolve(null);
                }
            },
            () => resolve(null),
            { enableHighAccuracy, timeout, maximumAge },
        );
    });
}
