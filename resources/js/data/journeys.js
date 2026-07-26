import { VEHICLES } from './bookingVehicles';

export const JOURNEYS_KEY = 'almajd_journeys';

const CDN = 'https://service-catalog-assets.blacklane.com/Service+Catalog+Assets';

function vehicleMeta(id) {
    const v = VEHICLES.find((x) => x.id === id) || VEHICLES[0];
    return {
        vehicle_id: v.id,
        vehicle: v.name,
        vehicle_similar: v.similar,
        vehicle_image: v.main?.lg || v.main?.sm,
        currency: v.currency || 'US$',
    };
}

/**
 * Demo journeys for each tab — realistic premium-chauffeur scenarios.
 * Merged with any bookings saved from checkout.
 */
export const DEMO_JOURNEYS = [
    /* ——— Upcoming ——— */
    {
        id: 'demo_up_1',
        demo: true,
        booking_number: 'AM-48291037',
        status: 'upcoming',
        phase: 'confirmed',
        status_label: 'Confirmed',
        mode: 'airport',
        mode_label: 'Airport transfer',
        pickup: 'Houari Boumediene Airport (ALG) — Arrivals',
        dropoff: 'Hyatt Regency Algiers Airport Hotel',
        date: '2026-07-25',
        date_label: 'Sat, 25 Jul 2026',
        time: '14:40',
        time_label: '2:40 pm',
        arrive_label: '3:25 pm',
        duration_label: '45 min',
        flight: 'AH 6006 · Terminal 1',
        passenger_name: 'For myself',
        for_guest: false,
        ...vehicleMeta('business'),
        price: 128.5,
        payment_label: 'Visa •••• 4242',
        chauffeur: null,
        chauffeur_eta: 'Meet & greet at arrivals',
        notes: 'Name board: AL MAJD',
        actions: ['details', 'edit', 'cancel'],
        lat: 36.6982,
        lng: 3.2144,
    },
    {
        id: 'demo_up_2',
        demo: true,
        booking_number: 'AM-39184720',
        status: 'upcoming',
        phase: 'chauffeur_assigned',
        status_label: 'Chauffeur assigned',
        mode: 'hourly',
        mode_label: 'Hourly hire',
        pickup: 'Embassy of Algeria, New Delhi',
        dropoff: '4 hours · 120 km included',
        date: '2026-07-26',
        date_label: 'Sun, 26 Jul 2026',
        time: '09:00',
        time_label: '9:00 am',
        arrive_label: 'Until 1:00 pm',
        duration_label: '4 hours',
        flight: null,
        passenger_name: 'Mr. Karim Benali',
        for_guest: true,
        ...vehicleMeta('first'),
        price: 412.0,
        payment_label: 'Mastercard •••• 1881',
        chauffeur: {
            name: 'Yassine M.',
            rating: 4.97,
            trips: 1280,
            vehicle_plate: '16-ALG-209',
            phone: '+213555019203',
        },
        chauffeur_eta: 'Chauffeur arrives 15 min early',
        notes: 'Guest prefers quiet cabin',
        actions: ['details', 'contact', 'edit'],
        lat: 28.564641,
        lng: 77.159464,
    },
    {
        id: 'demo_up_3',
        demo: true,
        booking_number: 'AM-77120358',
        status: 'upcoming',
        phase: 'confirmed',
        status_label: 'Confirmed',
        mode: 'transfer',
        mode_label: 'City transfer',
        pickup: 'Four Seasons Hotel Algiers',
        dropoff: 'Palais des Congrès, Pins Maritimes',
        date: '2026-07-28',
        date_label: 'Tue, 28 Jul 2026',
        time: '08:15',
        time_label: '8:15 am',
        arrive_label: '8:40 am',
        duration_label: '25 min',
        flight: null,
        passenger_name: 'Mrs. Sara Mansouri',
        for_guest: true,
        ...vehicleMeta('van'),
        price: 96.2,
        payment_label: 'Visa •••• 4242',
        chauffeur: null,
        chauffeur_eta: 'Assigned 2 hours before pickup',
        notes: 'Board meeting — wait if delayed',
        actions: ['details', 'edit', 'cancel'],
        lat: 36.7695,
        lng: 3.0532,
    },
    {
        id: 'demo_up_4',
        demo: true,
        booking_number: 'AM-55019482',
        status: 'upcoming',
        phase: 'upcoming_soon',
        status_label: 'Starting soon',
        mode: 'airport',
        mode_label: 'Airport transfer',
        pickup: 'Sheraton Club des Pins Resort',
        dropoff: 'Houari Boumediene Airport (ALG) — Departures T1',
        date: '2026-07-24',
        date_label: 'Fri, 24 Jul 2026',
        time: '05:30',
        time_label: '5:30 am',
        arrive_label: '6:10 am',
        duration_label: '40 min',
        flight: 'AF 1255 · Check-in opens 03:30',
        passenger_name: 'For myself',
        for_guest: false,
        ...vehicleMeta('business'),
        price: 142.8,
        payment_label: 'Visa •••• 4242',
        chauffeur: {
            name: 'Amine K.',
            rating: 4.94,
            trips: 860,
            vehicle_plate: '16-ALG-441',
            phone: '+213661204488',
        },
        chauffeur_eta: 'Chauffeur on the way',
        notes: null,
        actions: ['details', 'track', 'contact'],
        lat: 36.7801,
        lng: 2.955,
    },

    /* ——— Past ——— */
    {
        id: 'demo_past_1',
        demo: true,
        booking_number: 'AM-22098411',
        status: 'past',
        phase: 'completed',
        status_label: 'Completed',
        mode: 'airport',
        mode_label: 'Airport transfer',
        pickup: 'Houari Boumediene Airport (ALG) — Arrivals',
        dropoff: 'Sofitel Algiers Hamma Garden',
        date: '2026-07-12',
        date_label: 'Sun, 12 Jul 2026',
        time: '22:10',
        time_label: '10:10 pm',
        arrive_label: '10:55 pm',
        duration_label: '45 min',
        flight: 'TK 652',
        passenger_name: 'For myself',
        for_guest: false,
        ...vehicleMeta('business'),
        price: 135.0,
        payment_label: 'Charged · Visa •••• 4242',
        chauffeur: {
            name: 'Nabil R.',
            rating: 5.0,
            trips: 2104,
            vehicle_plate: '16-ALG-088',
        },
        chauffeur_eta: null,
        notes: null,
        rating: 5,
        receipt: true,
        actions: ['details', 'receipt', 'rebook'],
        lat: 36.6982,
        lng: 3.2144,
    },
    {
        id: 'demo_past_2',
        demo: true,
        booking_number: 'AM-88340129',
        status: 'past',
        phase: 'completed',
        status_label: 'Completed',
        mode: 'hourly',
        mode_label: 'Hourly hire',
        pickup: 'Martyrs’ Memorial, Algiers',
        dropoff: '6 hours · city itinerary',
        date: '2026-07-05',
        date_label: 'Sat, 5 Jul 2026',
        time: '10:00',
        time_label: '10:00 am',
        arrive_label: 'Until 4:00 pm',
        duration_label: '6 hours',
        flight: null,
        passenger_name: 'Mr. Youcef Hadji',
        for_guest: true,
        ...vehicleMeta('first'),
        price: 589.4,
        payment_label: 'Charged · Mastercard •••• 1881',
        chauffeur: {
            name: 'Samir B.',
            rating: 4.91,
            trips: 640,
            vehicle_plate: '16-ALG-512',
            phone: '+213770331122',
        },
        chauffeur_eta: null,
        notes: 'Museum + Casbah stops',
        rating: 4,
        receipt: true,
        actions: ['details', 'receipt', 'rebook'],
        lat: 36.7456,
        lng: 3.0698,
    },
    {
        id: 'demo_past_3',
        demo: true,
        booking_number: 'AM-10447265',
        status: 'past',
        phase: 'completed',
        status_label: 'Completed',
        mode: 'transfer',
        mode_label: 'City transfer',
        pickup: 'Aéroport d’Oran Ahmed Ben Bella',
        dropoff: 'Royal Hotel Oran',
        date: '2026-06-22',
        date_label: 'Mon, 22 Jun 2026',
        time: '13:20',
        time_label: '1:20 pm',
        arrive_label: '1:50 pm',
        duration_label: '30 min',
        flight: 'AH 6120',
        passenger_name: 'For myself',
        for_guest: false,
        ...vehicleMeta('van'),
        price: 88.0,
        payment_label: 'Charged · Visa •••• 4242',
        chauffeur: {
            name: 'Karim T.',
            rating: 4.88,
            trips: 420,
            vehicle_plate: '31-ORN-077',
            phone: '+213550998877',
        },
        chauffeur_eta: null,
        notes: null,
        rating: 5,
        receipt: true,
        actions: ['details', 'receipt', 'rebook'],
        lat: 35.6239,
        lng: -0.6211,
    },

    /* ——— Canceled ——— */
    {
        id: 'demo_cx_1',
        demo: true,
        booking_number: 'AM-66719304',
        status: 'cancelled',
        phase: 'cancelled_user',
        status_label: 'Canceled by you',
        mode: 'transfer',
        mode_label: 'City transfer',
        pickup: 'Hotel El Aurassi',
        dropoff: 'Centre International de Conférences',
        date: '2026-07-18',
        date_label: 'Fri, 18 Jul 2026',
        time: '07:45',
        time_label: '7:45 am',
        arrive_label: '8:05 am',
        duration_label: '20 min',
        flight: null,
        passenger_name: 'For myself',
        for_guest: false,
        ...vehicleMeta('business'),
        price: 72.5,
        payment_label: 'Refunded · Visa •••• 4242',
        chauffeur: null,
        chauffeur_eta: null,
        notes: null,
        cancel_reason: 'Meeting moved online',
        cancel_date_label: 'Canceled 16 Jul · Full refund',
        actions: ['details', 'rebook'],
        lat: 36.7712,
        lng: 3.0501,
    },
    {
        id: 'demo_cx_2',
        demo: true,
        booking_number: 'AM-33980156',
        status: 'cancelled',
        phase: 'cancelled_schedule',
        status_label: 'Canceled — schedule change',
        mode: 'airport',
        mode_label: 'Airport transfer',
        pickup: 'Houari Boumediene Airport (ALG) — Arrivals',
        dropoff: 'Residence Les Pins',
        date: '2026-07-09',
        date_label: 'Wed, 9 Jul 2026',
        time: '01:15',
        time_label: '1:15 am',
        arrive_label: '1:55 am',
        duration_label: '40 min',
        flight: 'QR 1401 · Delayed then canceled',
        passenger_name: 'Mrs. Sara Mansouri',
        for_guest: true,
        ...vehicleMeta('first'),
        price: 198.0,
        payment_label: 'Refunded · Mastercard •••• 1881',
        chauffeur: null,
        chauffeur_eta: null,
        notes: 'Flight canceled by airline',
        cancel_reason: 'Flight canceled by airline',
        cancel_date_label: 'Canceled 9 Jul · Full refund within 3–5 days',
        actions: ['details', 'rebook'],
        lat: 36.6982,
        lng: 3.2144,
    },
];

export function loadJourneys() {
    try {
        const raw = localStorage.getItem(JOURNEYS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveJourneys(list) {
    try {
        localStorage.setItem(JOURNEYS_KEY, JSON.stringify(list));
    } catch {
        /* ignore */
    }
}

export function addJourney(entry) {
    const next = [entry, ...loadJourneys()];
    saveJourneys(next);
    return next;
}

/** User bookings first, then demo scenarios (deduped by id). */
export function getAllJourneys() {
    const saved = loadJourneys().map((j) => ({
        ...j,
        demo: false,
        status_label:
            j.status_label ||
            (j.status === 'past'
                ? 'Completed'
                : j.status === 'cancelled' || j.status === 'canceled'
                  ? 'Canceled'
                  : 'Confirmed'),
        mode_label: j.mode_label || (j.mode === 'hourly' ? 'Hourly hire' : j.mode === 'airport' ? 'Airport transfer' : 'City transfer'),
        currency: j.currency || 'US$',
        actions: j.actions || (j.status === 'upcoming' ? ['details', 'edit'] : ['details', 'rebook']),
        vehicle_image:
            j.vehicle_image ||
            VEHICLES.find((v) => v.id === j.vehicle_id || v.name === j.vehicle)?.main?.sm ||
            `${CDN}/Business+Class/Main/Desktop_Web_Business_Class_Main%402x.png`,
        lat: j.lat || 36.7538,
        lng: j.lng || 3.0588,
    }));
    const savedIds = new Set(saved.map((j) => j.id));
    return [...saved, ...DEMO_JOURNEYS.filter((j) => !savedIds.has(j.id))];
}

export function findJourney(idOrRef) {
    if (!idOrRef) return null;
    const key = decodeURIComponent(String(idOrRef));
    return (
        getAllJourneys().find(
            (j) => j.id === key || j.booking_number === key || j.booking_number?.replace(/^AM-/, '') === key,
        ) || null
    );
}

export function formatMoney(amount, currency = 'US$') {
    if (amount == null || Number.isNaN(Number(amount))) return '—';
    return `${currency}${Number(amount).toFixed(2)}`;
}

/** Build /booking query from a journey so Edit / Book again opens the booking screen prefilled. */
export function bookingPathFromJourney(j) {
    const q = new URLSearchParams();
    if (j.pickup) q.set('pickup', j.pickup);
    if (j.date) q.set('date', j.date);
    if (j.time) q.set('time', j.time);
    if (j.lat != null) q.set('lat', String(j.lat));
    if (j.lng != null) q.set('lng', String(j.lng));
    if (j.vehicle_id) q.set('vehicle', j.vehicle_id);

    const mode = j.mode === 'hourly' ? 'hourly' : j.mode === 'airport' ? 'transfer' : j.mode || 'transfer';
    q.set('mode', mode === 'hourly' ? 'hourly' : 'transfer');

    if (mode === 'hourly') {
        const hours = String(j.duration_label || '').match(/(\d+)\s*hour/i)?.[1] || '4';
        q.set('duration', hours);
    } else if (j.dropoff && !String(j.dropoff).toLowerCase().includes('hour')) {
        q.set('dropoff', j.dropoff);
    }

    return `/booking?${q.toString()}`;
}
