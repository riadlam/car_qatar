import {
    INCLUDED as FALLBACK_INCLUDED,
    SEAT_ADDONS as FALLBACK_SEAT_ADDONS,
    VEHICLES as FALLBACK_VEHICLES,
} from '../data/bookingVehicles';
import {
    GULF_DESTINATIONS as FALLBACK_GULF,
    SERVICE_TABS as FALLBACK_SERVICE_TABS,
} from '../data/bookingServices';

function formatCurrencySymbol(currency) {
    if (!currency || currency === 'USD') return 'US$';
    return currency;
}

function mediaByKind(media = [], kind) {
    return [...media]
        .filter((m) => m.kind === kind)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

/**
 * Map API vehicle class (+ amenities/media) → Booking card shape.
 */
export function mapVehicleClassToCard(vc) {
    if (!vc) return null;
    const highlights = mediaByKind(vc.media, 'highlight').map((m) => ({
        lg: m.image_lg,
        sm: m.image_sm,
        caption: m.label || '',
    }));
    const luggageOptions = mediaByKind(vc.media, 'luggage').map((m) => ({
        id: m.key || `luggage_${m.id}`,
        label: m.label || '',
        image: { lg: m.image_lg, sm: m.image_sm },
    }));
    const seatingOptions = mediaByKind(vc.media, 'seating').map((m) => ({
        id: m.key || `seating_${m.id}`,
        label: m.label || '',
        image: { lg: m.image_lg, sm: m.image_sm },
    }));

    return {
        id: vc.slug,
        api_id: vc.id,
        name: vc.name,
        similar: vc.similar_label || '',
        passengers: vc.passengers,
        luggage: vc.luggage,
        total: 0,
        base: 0,
        leadTime: 0,
        tax: 0,
        currency: 'US$',
        main: {
            lg: vc.image_lg,
            sm: vc.image_sm,
        },
        highlights,
        description: vc.description || '',
        luggageOptions,
        seatingOptions,
        included: (vc.amenities || []).map((a) => ({
            id: a.slug,
            label: a.label,
            icon: a.icon || a.slug,
        })),
    };
}

export function mapSeatAddon(addon) {
    return {
        id: addon.slug,
        label: addon.label,
        price: Number(addon.default_price || 0),
        currency: formatCurrencySymbol(addon.currency),
    };
}

export function mapServiceType(st) {
    const durationOptions = (st.duration_options || []).map((o) => ({
        value: String(o.value),
        label: o.label,
    }));
    const countOptions = (st.count_options || []).map((o) => ({
        kind: o.kind,
        value: String(o.value),
        label: o.label,
    }));
    const termOptions = (st.term_options || []).map((o) => ({
        value: String(o.value),
        label: o.label,
    }));

    return {
        id: st.slug,
        label: st.name,
        mode: st.mode || 'transfer',
        max_stops: st.max_stops ?? null,
        requires_dropoff: Boolean(st.requires_dropoff),
        allows_multi_stops: Boolean(st.allows_multi_stops),
        is_hourly: Boolean(st.is_hourly),
        requires_gulf_destination: Boolean(st.requires_gulf_destination),
        requires_school_term: Boolean(st.requires_school_term),
        requires_passengers: Boolean(st.requires_passengers),
        requires_students: Boolean(st.requires_students),
        duration_options: durationOptions,
        count_options: countOptions,
        term_options: termOptions,
        passenger_options: countOptions.filter((o) => o.kind === 'passenger'),
        student_options: countOptions.filter((o) => o.kind === 'student'),
    };
}

export function mapGulfDestination(d) {
    return {
        value: d.slug,
        label: d.name,
        slug: d.slug,
        id: d.id,
        lat: d.latitude != null ? Number(d.latitude) : null,
        lng: d.longitude != null ? Number(d.longitude) : null,
    };
}

export function fallbackVehicles() {
    return FALLBACK_VEHICLES;
}

export function fallbackIncluded() {
    return FALLBACK_INCLUDED;
}

export function fallbackSeatAddons() {
    return FALLBACK_SEAT_ADDONS.map((s) => ({ ...s, price: 0, currency: 'US$' }));
}

export function fallbackServiceTabs() {
    return FALLBACK_SERVICE_TABS;
}

export function fallbackGulfDestinations() {
    return FALLBACK_GULF;
}

export { formatCurrencySymbol };
