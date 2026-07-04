import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

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

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            clearSession();
        }
    }, [clearSession]);

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: Boolean(user),
            login,
            register,
            logout,
        }),
        [user, loading, login, register, logout],
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
