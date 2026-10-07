import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { LANG_STORAGE_KEY, SUPPORTED_LANGS } from '../i18n';

export function useChangeLanguage() {
    const { i18n } = useTranslation();
    const { isAuthenticated, updateUser } = useAuth();

    return useCallback(
        async (lng) => {
            const next = SUPPORTED_LANGS.includes(lng) ? lng : 'en';
            await i18n.changeLanguage(next);
            localStorage.setItem(LANG_STORAGE_KEY, next);
            if (isAuthenticated) {
                try {
                    await updateUser({ language: next });
                } catch {
                    // UI locale still applied even if profile sync fails
                }
            }
        },
        [i18n, isAuthenticated, updateUser],
    );
}
