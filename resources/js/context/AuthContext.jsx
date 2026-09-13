import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

const RETURN_KEY = 'auth_return_to';
const PENDING_EMAIL_KEY = 'auth_pending_email';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('auth_user');
        if (!stored) return null;
        try {
            const parsed = JSON.parse(stored);
            // Drop legacy mock sessions
            if (String(parsed?.id || '').startsWith('local_')) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                return null;
            }
            return parsed;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const persistSession = useCallback((nextUser, token) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(nextUser));
        setUser(nextUser);
    }, []);

    const persistUser = useCallback((nextUser) => {
        localStorage.setItem('auth_user', JSON.stringify(nextUser));
        setUser(nextUser);
        return nextUser;
    }, []);

    const clearSession = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (!token || String(token).startsWith('local_')) {
            if (String(token || '').startsWith('local_')) {
                clearSession();
            }
            setLoading(false);
            return;
        }

        authApi
            .me()
            .then((data) => {
                persistUser(data.user);
            })
            .catch(() => {
                clearSession();
            })
            .finally(() => setLoading(false));
    }, [clearSession, persistUser]);

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
            sessionStorage.removeItem(PENDING_EMAIL_KEY);
            return data.user;
        },
        [persistSession],
    );

    /** Signup step 2 — maps CompleteProfile form → API register */
    const completeProfile = useCallback(
        async (profile) => {
            const email = profile.email || getPendingEmail();
            const isCompany = profile.accountType === 'company';
            const isChauffeur = profile.accountType === 'chauffeur';

            const payload = {
                email,
                password: profile.password,
                password_confirmation: profile.passwordConfirm || profile.password,
                account_type: isChauffeur ? 'chauffeur' : isCompany ? 'company' : 'individual',
                title: isCompany ? undefined : profile.title || 'Mr.',
                first_name: isCompany ? undefined : profile.firstName || '',
                last_name: isCompany ? undefined : profile.lastName || '',
                company_name: isCompany ? profile.companyName || '' : undefined,
                phone: profile.phone || '',
                preferred_language: profile.preferredLanguage || null,
            };

            if (isChauffeur) {
                const user = await register(payload);
                return { ...user, application_pending: true };
            }

            return register(payload);
        },
        [getPendingEmail, register],
    );

    /** Profile fields go to the API. Cards are saved through /payment-methods. */
    const updateUser = useCallback(
        async (patch) => {
            const payload = { ...patch };
            if (Object.prototype.hasOwnProperty.call(payload, 'company')) {
                payload.company_name = payload.company;
                delete payload.company;
            }
            delete payload.payment_methods;
            delete payload.has_password;
            delete payload.password_updated_at;

            const data = await authApi.updateProfile(payload);
            persistUser(data.user);
            return data.user;
        },
        [persistUser],
    );

    const updateEmail = useCallback(
        async ({ email, current_password }) => {
            const data = await authApi.updateEmail({ email, current_password });
            persistUser(data.user);
            return data.user;
        },
        [persistUser],
    );

    const updatePassword = useCallback(
        async ({ current_password, password, password_confirmation }) => {
            const data = await authApi.updatePassword({
                current_password,
                password,
                password_confirmation,
            });
            persistSession(data.user, data.token);
            return data.user;
        },
        [persistSession],
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

    const deleteAccount = useCallback(
        async ({ current_password } = {}) => {
            await authApi.deleteAccount({ current_password });
            clearSession();
        },
        [clearSession],
    );

    const refreshUser = useCallback(async () => {
        const data = await authApi.me();
        return persistUser(data.user);
    }, [persistUser]);

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
            updateEmail,
            updatePassword,
            deleteAccount,
            refreshUser,
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
            updateEmail,
            updatePassword,
            deleteAccount,
            refreshUser,
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
