import { useCallback, useEffect, useState } from 'react';
import { createSavedGuest, listSavedGuests } from '../api/guests';
import { useAuth } from '../context/AuthContext';

function normalizeGuest(g) {
    if (!g) return null;
    return {
        id: String(g.id),
        title: g.title || 'Mr.',
        first_name: g.first_name || '',
        last_name: g.last_name || '',
        email: g.email || '',
        phone: g.phone || '',
    };
}

/**
 * Load / create saved guests from the API when authenticated.
 */
export function useSavedGuests() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const refresh = useCallback(async () => {
        if (!isAuthenticated) {
            setGuests([]);
            return [];
        }
        setLoading(true);
        setError('');
        try {
            const rows = await listSavedGuests();
            const list = (Array.isArray(rows) ? rows : []).map(normalizeGuest).filter(Boolean);
            setGuests(list);
            return list;
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    Object.values(err?.response?.data?.errors || {}).flat()[0] ||
                    'Unable to load saved guests.',
            );
            setGuests([]);
            return [];
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (authLoading) return undefined;
        refresh();
        return undefined;
    }, [authLoading, refresh]);

    const addGuest = useCallback(
        async (payload) => {
            if (!isAuthenticated) {
                const err = new Error('Sign in to save guests.');
                err.code = 'auth_required';
                throw err;
            }
            const created = await createSavedGuest({
                title: payload.title,
                first_name: payload.first_name,
                last_name: payload.last_name,
                email: payload.email,
                phone: payload.phone,
            });
            const guest = normalizeGuest(created);
            setGuests((prev) => {
                if (prev.some((g) => g.id === guest.id)) return prev;
                return [...prev, guest];
            });
            return guest;
        },
        [isAuthenticated],
    );

    const findById = useCallback(
        (id) => {
            if (!id) return null;
            return guests.find((g) => String(g.id) === String(id)) || null;
        },
        [guests],
    );

    return {
        guests,
        loading: authLoading || loading,
        error,
        isAuthenticated,
        refresh,
        addGuest,
        findById,
    };
}

export { normalizeGuest };
