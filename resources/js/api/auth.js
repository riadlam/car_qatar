import api from '../bootstrap';

function unwrapUser(data) {
    const user = data.user?.data ?? data.user;
    return { ...data, user };
}

export async function register(payload) {
    const { data } = await api.post('/auth/register', {
        ...payload,
        device_name: 'web',
    });

    return unwrapUser(data);
}

export async function login(payload) {
    const { data } = await api.post('/auth/login', {
        ...payload,
        device_name: 'web',
    });

    return unwrapUser(data);
}

export async function logout() {
    const { data } = await api.post('/auth/logout');

    return data;
}

export async function me() {
    const { data } = await api.get('/auth/me');

    return unwrapUser(data);
}

export async function updateProfile(payload) {
    const { data } = await api.patch('/auth/profile', payload);

    return unwrapUser(data);
}

export async function updateEmail(payload) {
    const { data } = await api.patch('/auth/email', payload);

    return unwrapUser(data);
}

export async function updatePassword(payload) {
    const { data } = await api.patch('/auth/password', {
        ...payload,
        device_name: 'web',
    });

    return unwrapUser(data);
}

export async function deleteAccount(payload) {
    const { data } = await api.delete('/auth/account', { data: payload });

    return data;
}
