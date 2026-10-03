import api from '../bootstrap';

export async function getWallet() {
    const { data } = await api.get('/wallet');
    return data.data;
}

/**
 * Paginated wallet ledger. Optional type: 'credit' | 'debit'.
 */
export async function getWalletTransactions({ page = 1, perPage = 20, type, reason } = {}) {
    const { data } = await api.get('/wallet/transactions', {
        params: {
            page,
            per_page: perPage,
            ...(type ? { type } : {}),
            ...(reason ? { reason } : {}),
        },
    });
    return {
        transactions: data.data || [],
        meta: data.meta || {},
    };
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
