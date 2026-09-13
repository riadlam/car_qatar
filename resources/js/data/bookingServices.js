/** Fallback service tabs / gulf list when catalog API is unavailable. */
export const SERVICE_TABS = [
    { id: 'one_way', label: 'One way', mode: 'transfer' },
    { id: 'multi_stops', label: 'Multi-stops', mode: 'transfer' },
    { id: 'by_hour', label: 'By the hour', mode: 'hourly' },
    { id: 'city_tour', label: 'City tour', mode: 'hourly' },
    { id: 'arab_gulf_trips', label: 'Arab gulf trips', mode: 'transfer' },
    { id: 'school_chauffeured', label: 'School chauffeured', mode: 'transfer' },
];

export const HOUR_OPTIONS = [
    ...Array.from({ length: 12 }, (_, i) => {
        const hours = i + 1;
        return { value: String(hours), label: `${hours} ${hours === 1 ? 'hour' : 'hours'}` };
    }),
    { value: 'full_day', label: 'Full day' },
];

export const CITY_TOUR_HOUR_OPTIONS = HOUR_OPTIONS.slice(0, 4);

export const PASSENGER_OPTIONS = ['1', '2', '3', '4'].map((v) => ({ value: v, label: v }));

export const STUDENT_OPTIONS = PASSENGER_OPTIONS;

function citySlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export const GULF_DESTINATIONS = [
    { name: 'Dubai', lat: 25.204849, lng: 55.270783 },
    { name: 'Abu Dhabi', lat: 24.453884, lng: 54.377344 },
    { name: 'Riyadh', lat: 24.713552, lng: 46.675296 },
    { name: 'Dammam', lat: 26.420683, lng: 50.088794 },
    { name: 'Al-Ahsa', lat: 25.383, lng: 49.586 },
    { name: 'Muscat', lat: 23.588, lng: 58.3829 },
    { name: 'Salalah', lat: 17.01505, lng: 54.0924 },
    { name: 'Kuwait City', lat: 29.375859, lng: 47.977405 },
].map((city) => {
    const slug = citySlug(city.name);
    return { value: slug, label: city.name, slug, lat: city.lat, lng: city.lng };
});

export const SCHOOL_TERMS = [
    { value: 'one_semester', label: 'One semester (half year)' },
    { value: 'two_semesters', label: 'Two semesters (school year)' },
];

/** Pickup/drop-off pairs allowed on a multi-stops trip */
export const MAX_STOPS = 3;

export function durationLabel(value) {
    const match = HOUR_OPTIONS.find((o) => o.value === String(value));
    return match ? match.label : '2 hours';
}

/** Numeric hours for ETA math — a full day counts as 12 hours */
export function durationHours(value) {
    if (String(value) === 'full_day') return 12;
    return Number(value) || 2;
}

export function serviceMode(serviceId) {
    return SERVICE_TABS.find((t) => t.id === serviceId)?.mode || 'transfer';
}

export function serviceLabel(serviceId) {
    return SERVICE_TABS.find((t) => t.id === serviceId)?.label || 'One way';
}
