import api from '../bootstrap';

export async function register(payload) {
    const { data } = await api.post('/auth/register', {
        ...payload,
        device_name: 'web',
    });

    return data;
}

export async function login(payload) {
    const { data } = await api.post('/auth/login', {
        ...payload,
        device_name: 'web',
    });

    return data;
}

export async function logout() {
    const { data } = await api.post('/auth/logout');

    return data;
}

export async function me() {
    const { data } = await api.get('/auth/me');

    return data;
}
