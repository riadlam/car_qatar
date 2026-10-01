import api from '../bootstrap';

export async function getWallet() {
    const { data } = await api.get('/wallet');
    return data.data;
}

/**
 * Pay an existing booking with wallet. Amount is never sent — server uses booking.total_amount.
 */
export async function payBookingWithWallet(bookingId) {
    const { data } = await api.post(`/bookings/${bookingId}/pay-with-wallet`, {
        confirm: true,
    });
    return data;
}
