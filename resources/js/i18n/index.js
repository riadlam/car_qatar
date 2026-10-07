import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import enLanding from '../locales/en/landing.json';
import enMarketing from '../locales/en/marketing.json';
import enAuth from '../locales/en/auth.json';
import enBooking from '../locales/en/booking.json';
import enAccount from '../locales/en/account.json';
import enJourneys from '../locales/en/journeys.json';
import enChauffeur from '../locales/en/chauffeur.json';
import enPartner from '../locales/en/partner.json';

import arCommon from '../locales/ar/common.json';
import arLanding from '../locales/ar/landing.json';
import arMarketing from '../locales/ar/marketing.json';
import arAuth from '../locales/ar/auth.json';
import arBooking from '../locales/ar/booking.json';
import arAccount from '../locales/ar/account.json';
import arJourneys from '../locales/ar/journeys.json';
import arChauffeur from '../locales/ar/chauffeur.json';
import arPartner from '../locales/ar/partner.json';

export const LANG_STORAGE_KEY = 'almajd_lang';
export const SUPPORTED_LANGS = ['en', 'ar'];

export function applyDocumentLocale(lng) {
    const lang = SUPPORTED_LANGS.includes(lng) ? lng : 'en';
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.classList.toggle('lang-ar', lang === 'ar');
    root.classList.toggle('lang-en', lang === 'en');
}

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: enCommon,
                landing: enLanding,
                marketing: enMarketing,
                auth: enAuth,
                booking: enBooking,
                account: enAccount,
                journeys: enJourneys,
                chauffeur: enChauffeur,
                partner: enPartner,
            },
            ar: {
                common: arCommon,
                landing: arLanding,
                marketing: arMarketing,
                auth: arAuth,
                booking: arBooking,
                account: arAccount,
                journeys: arJourneys,
                chauffeur: arChauffeur,
                partner: arPartner,
            },
        },
        fallbackLng: 'en',
        supportedLngs: SUPPORTED_LANGS,
        defaultNS: 'common',
        ns: [
            'common',
            'landing',
            'marketing',
            'auth',
            'booking',
            'account',
            'journeys',
            'chauffeur',
            'partner',
        ],
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: LANG_STORAGE_KEY,
            caches: ['localStorage'],
        },
    });

applyDocumentLocale(i18n.language);
i18n.on('languageChanged', applyDocumentLocale);

export default i18n;
