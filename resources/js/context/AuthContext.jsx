import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

const RETURN_KEY = 'auth_return_to';
const PENDING_EMAIL_KEY = 'auth_pending_email';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('auth_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);

    const persistSession = useCallback((nextUser, token) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(nextUser));
        setUser(nextUser);
    }, []);

    const clearSession = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (!token) {
            setLoading(false);
            return;
        }

        // Local mock sessions skip API /me
        if (String(token).startsWith('local_')) {
            setLoading(false);
            return;
        }

        authApi
            .me()
            .then((data) => {
                localStorage.setItem('auth_user', JSON.stringify(data.user));
                setUser(data.user);
            })
            .catch(() => {
                clearSession();
            })
            .finally(() => setLoading(false));
    }, [clearSession]);

    const setReturnTo = useCallback((path) => {
        if (path && path !== '/login' && path !== '/register' && path !== '/complete-profile') {
            sessionStorage.setItem(RETURN_KEY, path);
        }
    }, []);

    const consumeReturnTo = useCallback(() => {
        const path = sessionStorage.getItem(RETURN_KEY) || '/';
        sessionStorage.removeItem(RETURN_KEY);
        return path;
    }, []);

    const setPendingEmail = useCallback((email) => {
        sessionStorage.setItem(PENDING_EMAIL_KEY, email);
    }, []);

    const getPendingEmail = useCallback(() => sessionStorage.getItem(PENDING_EMAIL_KEY) || '', []);

    const login = useCallback(
        async (credentials) => {
            const data = await authApi.login(credentials);
            persistSession(data.user, data.token);
            return data.user;
        },
        [persistSession],
    );

    const register = useCallback(
        async (payload) => {
            const data = await authApi.register(payload);
            persistSession(data.user, data.token);
            return data.user;
        },
        [persistSession],
    );

    /** Local profile completion (no backend yet) */
    const completeProfile = useCallback(
        (profile) => {
            const email = profile.email || getPendingEmail();
            const nextUser = {
                id: `local_${Date.now()}`,
                email,
                name: [profile.firstName, profile.lastName].filter(Boolean).join(' '),
                title: profile.title,
                first_name: profile.firstName,
                last_name: profile.lastName,
                phone: profile.phone,
                company: '',
                street_address: '',
                has_password: true,
                payment_methods: [],
                marketing_emails: true,
                booking_notifications: 'email_sms',
                language: 'en',
            };
            persistSession(nextUser, `local_${Date.now()}`);
            sessionStorage.removeItem(PENDING_EMAIL_KEY);
            return nextUser;
        },
        [getPendingEmail, persistSession],
    );

    /** Merge account fields into the current user and persist */
    const updateUser = useCallback(
        (patch) => {
            setUser((current) => {
                if (!current) return current;
                const next = { ...current, ...patch };
                localStorage.setItem('auth_user', JSON.stringify(next));
                return next;
            });
        },
        [],
    );

    const logout = useCallback(async () => {
        const token = localStorage.getItem('auth_token');
        try {
            if (token && !String(token).startsWith('local_')) {
                await authApi.logout();
            }
        } finally {
            clearSession();
        }
    }, [clearSession]);

    const deleteAccount = useCallback(async () => {
        await logout();
    }, [logout]);

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: Boolean(user),
            login,
            register,
            logout,
            completeProfile,
            updateUser,
            deleteAccount,
            setReturnTo,
            consumeReturnTo,
            setPendingEmail,
            getPendingEmail,
        }),
        [
            user,
            loading,
            login,
            register,
            logout,
            completeProfile,
            updateUser,
            deleteAccount,
            setReturnTo,
            consumeReturnTo,
            setPendingEmail,
            getPendingEmail,
        ],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
