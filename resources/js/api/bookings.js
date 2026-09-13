import api from '../bootstrap';

export async function listBookings(params = {}) {
    const { data } = await api.get('/bookings', { params });
    return data;
}

export async function listAllBookings() {
    const rows = [];
    let page = 1;
    let last = 1;

    do {
        const res = await listBookings({ page });
        rows.push(...(res.data || []));
        last = Number(res.meta?.last_page) || 1;
        page += 1;
    } while (page <= last);

    return rows;
}

export async function getBooking(id) {
    const { data } = await api.get(`/bookings/${id}`);
    return data.booking || data;
}

export async function getBookingTrack(id) {
    const { data } = await api.get(`/bookings/${id}/track`);
    return data.track || data;
}

export async function createBooking(payload) {
    const { data } = await api.post('/bookings', payload);
    return data.booking || data;
}

export async function cancelBooking(id, payload) {
    const { data } = await api.post(`/bookings/${id}/cancel`, payload);
    return data.booking || data;
}

export async function listCancellationReasons() {
    const { data } = await api.get('/cancellation-reasons');
    return data.data || [];
}

export async function postChauffeurLocation(payload) {
    const { data } = await api.post('/chauffeur/location', payload);
    return data;
}

export async function listChauffeurOffers(params = {}) {
    const { data } = await api.get('/chauffeur/offers', { params });
    return data;
}

export async function acceptChauffeurOffer(id) {
    const { data } = await api.post(`/chauffeur/offers/${id}/accept`);
    return data;
}

export async function rejectChauffeurOffer(id) {
    const { data } = await api.post(`/chauffeur/offers/${id}/reject`);
    return data;
}

export async function listChauffeurRides() {
    const { data } = await api.get('/chauffeur/rides');
    return data;
}

export async function updateChauffeurRideStatus(id, status) {
    const { data } = await api.post(`/chauffeur/rides/${id}/status`, { status });
    return data.ride || null;
}

export async function cancelChauffeurRide(id, payload) {
    const { data } = await api.post(`/chauffeur/rides/${id}/cancel`, payload);
    return data.ride || null;
}

export async function getChauffeurProfile() {
    const { data } = await api.get('/chauffeur/profile');
    return data.profile || data;
}
