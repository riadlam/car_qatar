import api from '../bootstrap';

export async function getHealth() {
    const { data } = await api.get('/health');

    return data;
}
