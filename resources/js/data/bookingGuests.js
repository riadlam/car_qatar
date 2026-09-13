/**
 * Guest helpers — list persistence is via /api/saved-guests (see useSavedGuests).
 */

export function findGuestById(id, guests = []) {
    if (!id) return null;
    return guests.find((g) => String(g.id) === String(id)) || null;
}
