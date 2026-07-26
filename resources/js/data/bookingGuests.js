export const GUESTS_KEY = 'almajd_booking_guests';

export const EXAMPLE_GUESTS = [
    {
        id: 'ex_1',
        title: 'Mr.',
        first_name: 'Karim',
        last_name: 'Benali',
        email: 'karim.benali@example.com',
        phone: '+213555123456',
        example: true,
    },
    {
        id: 'ex_2',
        title: 'Mrs.',
        first_name: 'Sara',
        last_name: 'Mansouri',
        email: 'sara.mansouri@example.com',
        phone: '+213661987654',
        example: true,
    },
    {
        id: 'ex_3',
        title: 'Mr.',
        first_name: 'Youcef',
        last_name: 'Hadji',
        email: 'youcef.hadji@example.com',
        phone: '+213770112233',
        example: true,
    },
];

export function loadSavedGuests() {
    try {
        const raw = localStorage.getItem(GUESTS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveGuests(list) {
    try {
        localStorage.setItem(GUESTS_KEY, JSON.stringify(list.filter((g) => !g.example)));
    } catch {
        /* ignore */
    }
}

export function allGuests(saved = loadSavedGuests()) {
    return [...EXAMPLE_GUESTS, ...saved];
}

export function findGuestById(id, saved = loadSavedGuests()) {
    if (!id) return null;
    return allGuests(saved).find((g) => g.id === id) || null;
}
