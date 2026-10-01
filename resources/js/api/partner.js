import api from '../bootstrap';

export async function fetchPartnerMe() {
    const { data } = await api.get('/partner/me');
    return data.data;
}

export async function fetchPartnerBookings(page = 1) {
    const { data } = await api.get('/partner/bookings', { params: { page } });
    return data;
}

export async function fetchPartnerEarnings() {
    const { data } = await api.get('/partner/earnings');
    return data.data;
}

export async function refreshPartnerPaymentLink(bookingId) {
    const { data } = await api.post(`/partner/bookings/${bookingId}/payment-link`);
    return data.data;
}

export async function fetchGuestPayment(token) {
    const { data } = await api.get(`/pay/${token}`);
    return data;
}

export async function confirmGuestPayment(token) {
    const { data } = await api.post(`/pay/${token}/confirm`);
    return data;
}
