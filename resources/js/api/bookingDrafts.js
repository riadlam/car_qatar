import api from '../bootstrap';

/**
 * Persist booking/checkout progress in the DB (not browser storage).
 * @param {{ payload: Record<string, string>, return_path?: string }} body
 */
export async function createBookingDraft(body) {
    const { data } = await api.post('/booking-drafts', body);
    return data;
}

export async function getBookingDraft(id) {
    const { data } = await api.get(`/booking-drafts/${id}`);
    return data;
}

export async function claimBookingDraft(id) {
    const { data } = await api.post(`/booking-drafts/${id}/claim`);
    return data;
}
