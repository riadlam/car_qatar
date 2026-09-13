import api from '../bootstrap';

/**
 * Create quotes for all vehicle classes (or one if vehicle_class set).
 * @param {object} payload
 */
export async function createQuotes(payload) {
    const { data } = await api.post('/quotes', payload);
    return data;
}

export async function getQuote(id) {
    const { data } = await api.get(`/quotes/${id}`);
    return data.quote || data;
}
