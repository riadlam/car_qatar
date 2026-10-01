import api from '../bootstrap';

/**
 * Submit a "Leave a message" contact form (public).
 * @param {{ name: string, email: string, phone?: string, subject?: string, message: string }} body
 */
export async function sendContactMessage(body) {
    const { data } = await api.post('/contact-messages', body);
    return data;
}
