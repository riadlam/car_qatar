import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { LANG_STORAGE_KEY, SUPPORTED_LANGS } from '../i18n';

/**
 * Keeps i18n in sync with authenticated user.language (UI locale).
 * preferred_language remains a chauffeur preference and is not used here.
 */
export default function LocaleSync() {
    const { i18n } = useTranslation();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        const fromUser = user?.language;
        if (fromUser && SUPPORTED_LANGS.includes(fromUser) && fromUser !== i18n.language) {
            void i18n.changeLanguage(fromUser);
            localStorage.setItem(LANG_STORAGE_KEY, fromUser);
        }
    }, [user?.language, loading, i18n]);

    return null;
}
