import api from '../bootstrap';

export async function listSavedGuests() {
    const { data } = await api.get('/saved-guests');
    return data.data || data;
}

export async function createSavedGuest(payload) {
    const { data } = await api.post('/saved-guests', payload);
    return data.data || data.guest || data;
}

export async function updateSavedGuest(id, payload) {
    const { data } = await api.patch(`/saved-guests/${id}`, payload);
    return data.data || data.guest || data;
}

export async function deleteSavedGuest(id) {
    await api.delete(`/saved-guests/${id}`);
}
