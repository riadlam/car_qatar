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

export const GULF_DESTINATIONS = [
    'Dubai',
    'Abu Dhabi',
    'Riyadh',
    'Dammam',
    'Al-Ahsa',
    'Muscat',
    'Salalah',
    'Kuwait City',
].map((city) => ({ value: city, label: city }));

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
