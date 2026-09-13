import api from '../bootstrap';

export async function getPaymentMethods() {
    const { data } = await api.get('/payment-methods');
    return data.data || [];
}

export async function createPaymentMethod(payload) {
    const { data } = await api.post('/payment-methods', payload);
    return data.data;
}

export async function deletePaymentMethod(id) {
    await api.delete(`/payment-methods/${id}`);
}

export async function getBillingProfile() {
    const { data } = await api.get('/billing-profile');
    return data.data;
}

export async function saveBillingProfile(payload) {
    const { data } = await api.put('/billing-profile', payload);
    return data.data;
}

export function firstApiError(err, fallback = 'Something went wrong.') {
    const errors = err?.response?.data?.errors;
    if (errors && typeof errors === 'object') {
        const first = Object.values(errors).flat()[0];
        if (first) return first;
    }
    return err?.response?.data?.message || fallback;
}
