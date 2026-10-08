import { useEffect, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { canAccessChauffeurPortal, isCustomer, isPartnerAdmin } from '../utils/roles';
import SiteLayout from '../components/landing/SiteLayout';
import AddCardModal from '../components/account/AddCardModal';
import { deletePaymentMethod, firstApiError, getPaymentMethods } from '../api/checkout';
import Skeleton from '../components/ui/Skeleton';
import WalletHistory from '../components/wallet/WalletHistory';
import { useAuth } from '../context/AuthContext';
import { PREFERRED_LANGUAGES } from '../data/languages';

const TITLES = [
    { value: 'Mr.', key: 'mr' },
    { value: 'Mrs.', key: 'mrs' },
    { value: 'Ms.', key: 'ms' },
    { value: 'Mx.', key: 'mx' },
];
const LANGUAGES = ['en', 'ar'];

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

function Section({ title, children, action }) {
    return (
        <section className="border-b border-[#ececec] py-8 last:border-b-0">
            <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-ink-text sm:text-[24px]">
                    {title}
                </h2>
                {action}
            </div>
            {children}
        </section>
    );
}

function Row({ label, value, onEdit }) {
    const { t } = useTranslation('account');
    return (
        <div className="flex flex-col gap-1 border-b border-[#f3f3f4] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
                <p className="font-geist m-0 text-[13px] font-500 tracking-[0.04em] text-muted uppercase">
                    {label}
                </p>
                <p className="font-geist mt-1 m-0 break-words text-[16px] leading-6 text-ink-text">
                    {value || t('empty')}
                </p>
            </div>
            {onEdit ? (
                <button
                    type="button"
                    onClick={onEdit}
                    className="font-geist shrink-0 cursor-pointer self-start text-[14px] font-500 text-wine-700 underline-offset-2 hover:underline sm:self-center"
                >
                    {t('edit')}
                </button>
            ) : null}
        </div>
    );
}

function EditModal({ open, title, onClose, children, onSave, saveLabel, saving = false, error }) {
    const { t } = useTranslation('account');
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-ink-text/45 p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="font-fragment m-0 text-[22px] leading-8 font-400 text-ink-text">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('modals.closeAria')}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-black/5"
                    >
                        ×
                    </button>
                </div>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await onSave();
                    }}
                    className="space-y-4"
                >
                    {error ? (
                        <p className="font-geist m-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[14px] text-rose-700">
                            {error}
                        </p>
                    ) : null}
                    {children}
                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] px-5 py-2 text-[15px] font-500"
                        >
                            {t('modals.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-5 py-2 text-[15px] font-500 text-white hover:bg-wine-600 disabled:opacity-60"
                        >
                            {saving ? t('modals.saving') : saveLabel || t('modals.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function displayName(user, empty) {
    if (user?.account_type === 'company') {
        return user.company || user.company_name || user.name || empty;
    }
    const parts = [user?.title, user?.first_name || user?.name, user?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();
    return parts || user?.name || empty;
}

export default function Account() {
    const { t } = useTranslation('account');
    const { t: tCommon } = useTranslation('common');
    const { t: tAuth } = useTranslation('auth');
    const navigate = useNavigate();
    const {
        user,
        loading,
        isAuthenticated,
        updateUser,
        updateEmail,
        updatePassword,
        deleteAccount,
        refreshUser,
        setReturnTo,
        logout,
    } = useAuth();

    const [edit, setEdit] = useState(null);
    const [draft, setDraft] = useState({});
    const [cardOpen, setCardOpen] = useState(false);
    const [cards, setCards] = useState([]);
    const [cardError, setCardError] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const onLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch {
            navigate('/login', { replace: true });
        } finally {
            setLoggingOut(false);
        }
    };

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            setReturnTo('/account');
            navigate('/login?from=%2Faccount', { replace: true });
        }
    }, [loading, isAuthenticated, navigate, setReturnTo]);

    useEffect(() => {
        if (loading || !isAuthenticated) return undefined;
        let cancelled = false;
        refreshUser().catch(() => {
            if (!cancelled) {
                /* keep cached session if refresh fails transiently */
            }
        });
        return () => {
            cancelled = true;
        };
    }, [loading, isAuthenticated, refreshUser]);

    useEffect(() => {
        if (!isAuthenticated) return undefined;
        let cancelled = false;
        getPaymentMethods()
            .then((methods) => {
                if (!cancelled) setCards(methods);
            })
            .catch(() => {
                if (!cancelled) setCards([]);
            });
        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, user]);

    if (loading || !user) {
        return <Skeleton variant="page" />;
    }

    const empty = t('empty');
    const companyName = user.company || user.company_name || '';
    const langCode = user.language || 'en';
    const langLabel = LANGUAGES.includes(langCode)
        ? tCommon(`lang.${langCode}`)
        : tCommon('lang.en');
    const bookingLabel =
        user.booking_notifications === 'email'
            ? t('notifications.onEmail')
            : user.booking_notifications === 'sms'
              ? t('notifications.onSms')
              : user.booking_notifications === 'off'
                ? t('notifications.off')
                : t('notifications.onEmailSms');

    const preferredLangLabel = (() => {
        if (!user.preferred_language) return empty;
        if (PREFERRED_LANGUAGES.some((l) => l.id === user.preferred_language)) {
            return tCommon(`lang.${user.preferred_language}`);
        }
        return user.preferred_language;
    })();

    const accountTypeLabel =
        user.account_type === 'company'
            ? t('accountTypes.company')
            : user.account_type === 'chauffeur'
              ? t('accountTypes.chauffeur')
              : t('accountTypes.individual');

    const chauffeurStatus =
        user.role === 'chauffeur' && user.chauffeur_status && user.chauffeur_status !== 'active'
            ? t(`chauffeurStatus.${user.chauffeur_status}`, {
                  defaultValue: user.chauffeur_status,
              })
            : null;

    const openEdit = (key, initial) => {
        setDraft(initial);
        setEdit(key);
        setPasswordMsg('');
    };

    const closeEdit = () => {
        setEdit(null);
        setDraft({});
        setPasswordMsg('');
        setSaving(false);
    };

    const apiErrorMessage = (err, fallback = t('errors.generic')) => {
        const errors = err?.response?.data?.errors;
        if (errors && typeof errors === 'object') {
            const first = Object.values(errors).flat()[0];
            if (first) return first;
        }
        return err?.response?.data?.message || fallback;
    };

    const saveProfile = async (patch) => {
        setSaving(true);
        setPasswordMsg('');
        try {
            await updateUser(patch);
            closeEdit();
        } catch (err) {
            setPasswordMsg(apiErrorMessage(err));
            setSaving(false);
        }
    };

    return (
        <SiteLayout className="relative min-w-0 overflow-x-clip bg-white">
            <div id="top" className="bg-white pt-[96px] pb-16 lg:pt-[120px] lg:pb-24">
                <div className="mx-auto max-w-[720px] px-6 lg:px-0">
                    <h1 className="font-fragment m-0 text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text sm:text-[40px] sm:leading-[48px]">
                        {t('title')}
                    </h1>
                    <p className="font-geist mt-2 m-0 text-[16px] leading-6 text-muted">
                        {t('subtitle')}
                    </p>
                    <p className="font-geist mt-1 m-0 text-[14px] leading-5 text-muted">{user.email}</p>
                    {chauffeurStatus ? (
                        <p className="font-geist mt-4 m-0 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[13px] font-500 text-amber-900">
                            {chauffeurStatus}
                        </p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-3">
                        {isCustomer(user) ? (
                            <Link
                                to="/journeys"
                                className="font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-500 text-ink-text transition hover:border-ink-text/30"
                            >
                                {tCommon('nav.journeys')}
                            </Link>
                        ) : null}
                        {canAccessChauffeurPortal(user) ? (
                            <Link
                                to="/chauffeur"
                                className="font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-500 text-ink-text transition hover:border-ink-text/30"
                            >
                                {t('chauffeurPortal')}
                            </Link>
                        ) : null}
                        {isPartnerAdmin(user) ? (
                            <Link
                                to="/partner"
                                className="font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-500 text-ink-text transition hover:border-ink-text/30"
                            >
                                {t('partnerPortal')}
                            </Link>
                        ) : null}
                        <button
                            type="button"
                            onClick={onLogout}
                            disabled={loggingOut}
                            className="font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-[14px] font-500 text-ink-text transition hover:border-ink-text/30 disabled:opacity-60"
                        >
                            {loggingOut ? t('signingOut') : t('logOut')}
                        </button>
                    </div>

                    <div className="mt-10 border-t border-[#ececec]">
                        <Section title={t('sections.personal')}>
                            <Row label={t('fields.accountType')} value={accountTypeLabel} />
                            <Row
                                label={t('fields.name')}
                                value={displayName(user, empty)}
                                onEdit={() =>
                                    user.account_type === 'company'
                                        ? openEdit('company', { company: companyName })
                                        : openEdit('name', {
                                              title: user.title || 'Mr.',
                                              first_name: user.first_name || '',
                                              last_name: user.last_name || '',
                                          })
                                }
                            />
                            <Row
                                label={t('fields.mobile')}
                                value={user.phone || empty}
                                onEdit={() => openEdit('phone', { phone: user.phone || '' })}
                            />
                            {user.account_type === 'company' ? (
                                <Row
                                    label={t('fields.company')}
                                    value={companyName || empty}
                                    onEdit={() =>
                                        openEdit('company', { company: companyName })
                                    }
                                />
                            ) : null}
                            <Row
                                label={t('fields.preferredLanguage')}
                                value={preferredLangLabel}
                                onEdit={() =>
                                    openEdit('preferred_language', {
                                        preferred_language: user.preferred_language || '',
                                    })
                                }
                            />
                            <Row
                                label={t('fields.streetAddress')}
                                value={user.street_address || empty}
                                onEdit={() =>
                                    openEdit('address', {
                                        street_address: user.street_address || '',
                                    })
                                }
                            />
                        </Section>

                        <Section title={t('sections.email')}>
                            <Row
                                label={t('fields.email')}
                                value={user.email}
                                onEdit={() =>
                                    openEdit('email', {
                                        email: user.email || '',
                                        current_password: '',
                                    })
                                }
                            />
                        </Section>

                        <Section title={t('sections.password')}>
                            <Row
                                label={t('fields.password')}
                                value={t('fields.passwordMasked')}
                                onEdit={() =>
                                    openEdit('password', {
                                        current: '',
                                        next: '',
                                        confirm: '',
                                    })
                                }
                            />
                        </Section>

                        {(isCustomer(user) || isPartnerAdmin(user) || canAccessChauffeurPortal(user)) ? (
                            <Section title={t('sections.wallet')}>
                                <WalletHistory helperText={t('wallet.helper')} />
                            </Section>
                        ) : null}

                        <Section
                            title={t('sections.paymentMethods')}
                            action={
                                <button
                                    type="button"
                                    onClick={() => setCardOpen(true)}
                                    className="font-geist cursor-pointer text-[14px] font-500 text-wine-700 underline-offset-2 hover:underline"
                                >
                                    {t('cards.add')}
                                </button>
                            }
                        >
                            {cardError ? (
                                <p className="font-geist mb-3 m-0 text-[14px] text-rose-700">{cardError}</p>
                            ) : null}
                            {cards.length === 0 ? (
                                <p className="font-geist m-0 border border-dashed border-[#e5e5e5] px-4 py-8 text-center text-[15px] text-muted">
                                    {t('cards.empty')}
                                </p>
                            ) : (
                                <ul className="m-0 list-none space-y-3 p-0">
                                    {cards.map((card) => (
                                        <li
                                            key={card.id}
                                            className="flex items-center justify-between gap-4 rounded-xl border border-[#e8e8ea] px-4 py-4"
                                        >
                                            <div>
                                                <p className="font-geist m-0 text-[15px] font-500 text-ink-text">
                                                    {card.brand} •••• {card.last4}
                                                </p>
                                                <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                                    {card.name} ·{' '}
                                                    {t('cards.exp', { expiry: card.expiry })}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setCardError('');
                                                    try {
                                                        await deletePaymentMethod(card.id);
                                                        setCards((current) =>
                                                            current.filter((item) => item.id !== card.id),
                                                        );
                                                    } catch (err) {
                                                        setCardError(
                                                            firstApiError(err, t('cards.removeError')),
                                                        );
                                                    }
                                                }}
                                                className="font-geist cursor-pointer text-[14px] font-500 text-wine-700 hover:underline"
                                            >
                                                {t('cards.remove')}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>

                        <Section title={t('sections.notifications')}>
                            <Row
                                label={t('fields.marketingEmails')}
                                value={
                                    user.marketing_emails === false
                                        ? t('notifications.off')
                                        : t('notifications.on')
                                }
                                onEdit={() =>
                                    openEdit('marketing', {
                                        marketing_emails: user.marketing_emails !== false,
                                    })
                                }
                            />
                            <Row
                                label={t('fields.bookingNotifications')}
                                value={bookingLabel}
                                onEdit={() =>
                                    openEdit('booking', {
                                        booking_notifications:
                                            user.booking_notifications || 'email_sms',
                                    })
                                }
                            />
                        </Section>

                        <Section title={t('sections.communicationLanguage')}>
                            <Row
                                label={t('fields.language')}
                                value={langLabel}
                                onEdit={() =>
                                    openEdit('language', { language: user.language || 'en' })
                                }
                            />
                        </Section>

                        <section className="py-8">
                            <button
                                type="button"
                                onClick={() => openEdit('delete', { current_password: '' })}
                                className="font-geist cursor-pointer text-[16px] font-500 text-rose-700 underline-offset-2 hover:underline"
                            >
                                {t('sections.danger')}
                            </button>
                        </section>
                    </div>
                </div>
            </div>

            {/* Name */}
            <EditModal
                open={edit === 'name'}
                title={t('modals.editName')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={() =>
                    saveProfile({
                        title: draft.title,
                        first_name: draft.first_name.trim(),
                        last_name: draft.last_name.trim(),
                    })
                }
            >
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        {tAuth('completeProfile.fields.title')}
                    </span>
                    <select
                        className={fieldClass}
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    >
                        {TITLES.map((item) => (
                            <option key={item.value} value={item.value}>
                                {t(`titles.${item.key}`)}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        {tAuth('completeProfile.fields.firstName')}
                    </span>
                    <input
                        required
                        className={fieldClass}
                        value={draft.first_name}
                        onChange={(e) => setDraft({ ...draft, first_name: e.target.value })}
                    />
                </label>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        {tAuth('completeProfile.fields.lastName')}
                    </span>
                    <input
                        required
                        className={fieldClass}
                        value={draft.last_name}
                        onChange={(e) => setDraft({ ...draft, last_name: e.target.value })}
                    />
                </label>
            </EditModal>

            {/* Phone */}
            <EditModal
                open={edit === 'phone'}
                title={t('modals.editMobile')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={() => saveProfile({ phone: draft.phone })}
            >
                <PhoneInput
                    defaultCountry="dz"
                    value={draft.phone || ''}
                    onChange={(phone) => setDraft({ ...draft, phone })}
                    forceDialCode
                    className="almajd-phone"
                />
            </EditModal>

            {/* Company */}
            <EditModal
                open={edit === 'company'}
                title={t('modals.editCompany')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={() => saveProfile({ company: draft.company.trim() })}
            >
                <input
                    className={fieldClass}
                    placeholder={t('modals.companyPlaceholder')}
                    value={draft.company}
                    onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                />
            </EditModal>

            {/* Preferred language */}
            <EditModal
                open={edit === 'preferred_language'}
                title={t('modals.preferredLanguage')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={() =>
                    saveProfile({ preferred_language: draft.preferred_language || null })
                }
            >
                <div
                    role="radiogroup"
                    aria-label={t('fields.preferredLanguage')}
                    className="flex flex-wrap gap-2"
                >
                    <label
                        className={`font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 py-2 text-[14px] ${
                            !draft.preferred_language
                                ? 'border-wine-700 bg-wine-50 text-wine-800'
                                : 'border-[#e0ddd6] bg-white text-ink-text'
                        }`}
                    >
                        <input
                            type="radio"
                            name="acct-pref-lang"
                            className="sr-only"
                            checked={!draft.preferred_language}
                            onChange={() => setDraft({ ...draft, preferred_language: '' })}
                        />
                        {t('languages.noPreference')}
                    </label>
                    {PREFERRED_LANGUAGES.map((lang) => {
                        const on = draft.preferred_language === lang.id;
                        return (
                            <label
                                key={lang.id}
                                className={`font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 py-2 text-[14px] ${
                                    on
                                        ? 'border-wine-700 bg-wine-50 text-wine-800'
                                        : 'border-[#e0ddd6] bg-white text-ink-text'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="acct-pref-lang"
                                    className="sr-only"
                                    checked={on}
                                    onChange={() =>
                                        setDraft({ ...draft, preferred_language: lang.id })
                                    }
                                />
                                {tCommon(`lang.${lang.id}`)}
                            </label>
                        );
                    })}
                </div>
            </EditModal>

            {/* Address */}
            <EditModal
                open={edit === 'address'}
                title={t('modals.editAddress')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={() => saveProfile({ street_address: draft.street_address.trim() })}
            >
                <textarea
                    rows={3}
                    className={fieldClass}
                    placeholder={t('modals.addressPlaceholder')}
                    value={draft.street_address}
                    onChange={(e) => setDraft({ ...draft, street_address: e.target.value })}
                />
            </EditModal>

            {/* Email */}
            <EditModal
                open={edit === 'email'}
                title={t('modals.editEmail')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={async () => {
                    setSaving(true);
                    setPasswordMsg('');
                    try {
                        await updateEmail({
                            email: draft.email.trim(),
                            current_password: draft.current_password || '',
                        });
                        closeEdit();
                    } catch (err) {
                        setPasswordMsg(apiErrorMessage(err));
                        setSaving(false);
                    }
                }}
            >
                <input
                    type="email"
                    required
                    className={fieldClass}
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                />
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        {t('fields.currentPassword')}
                    </span>
                    <input
                        type="password"
                        required
                        className={fieldClass}
                        value={draft.current_password || ''}
                        onChange={(e) => setDraft({ ...draft, current_password: e.target.value })}
                    />
                </label>
            </EditModal>

            {/* Password */}
            <EditModal
                open={edit === 'password'}
                title={t('modals.changePassword')}
                onClose={closeEdit}
                saveLabel={t('modals.updatePassword')}
                saving={saving}
                error={passwordMsg}
                onSave={async () => {
                    if ((draft.next || '').length < 8) {
                        setPasswordMsg(t('errors.passwordLength'));
                        return;
                    }
                    if (draft.next !== draft.confirm) {
                        setPasswordMsg(t('errors.passwordMatch'));
                        return;
                    }
                    setSaving(true);
                    setPasswordMsg('');
                    try {
                        await updatePassword({
                            current_password: draft.current,
                            password: draft.next,
                            password_confirmation: draft.confirm,
                        });
                        closeEdit();
                    } catch (err) {
                        setPasswordMsg(apiErrorMessage(err));
                        setSaving(false);
                    }
                }}
            >
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        {t('fields.currentPassword')}
                    </span>
                    <input
                        type="password"
                        required
                        className={fieldClass}
                        value={draft.current}
                        onChange={(e) => setDraft({ ...draft, current: e.target.value })}
                    />
                </label>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        {t('fields.newPassword')}
                    </span>
                    <input
                        type="password"
                        required
                        minLength={8}
                        className={fieldClass}
                        value={draft.next}
                        onChange={(e) => setDraft({ ...draft, next: e.target.value })}
                    />
                </label>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        {t('fields.confirmPassword')}
                    </span>
                    <input
                        type="password"
                        required
                        minLength={8}
                        className={fieldClass}
                        value={draft.confirm}
                        onChange={(e) => setDraft({ ...draft, confirm: e.target.value })}
                    />
                </label>
            </EditModal>

            {/* Marketing */}
            <EditModal
                open={edit === 'marketing'}
                title={t('modals.marketingEmails')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={() => saveProfile({ marketing_emails: draft.marketing_emails })}
            >
                <label className="font-geist flex cursor-pointer items-center gap-3 text-[15px]">
                    <input
                        type="checkbox"
                        checked={!!draft.marketing_emails}
                        onChange={(e) =>
                            setDraft({ ...draft, marketing_emails: e.target.checked })
                        }
                        className="h-4 w-4 accent-[#5b0520]"
                    />
                    {t('fields.marketingEmails')}
                </label>
            </EditModal>

            {/* Booking notifications */}
            <EditModal
                open={edit === 'booking'}
                title={t('modals.bookingNotifications')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={() =>
                    saveProfile({ booking_notifications: draft.booking_notifications })
                }
            >
                <select
                    className={fieldClass}
                    value={draft.booking_notifications}
                    onChange={(e) =>
                        setDraft({ ...draft, booking_notifications: e.target.value })
                    }
                >
                    <option value="email_sms">{t('notifications.onEmailSms')}</option>
                    <option value="email">{t('notifications.onEmail')}</option>
                    <option value="sms">{t('notifications.onSms')}</option>
                    <option value="off">{t('notifications.off')}</option>
                </select>
            </EditModal>

            {/* Language */}
            <EditModal
                open={edit === 'language'}
                title={t('modals.communicationLanguage')}
                onClose={closeEdit}
                saving={saving}
                error={passwordMsg}
                onSave={() => saveProfile({ language: draft.language })}
            >
                <select
                    className={fieldClass}
                    value={draft.language}
                    onChange={(e) => setDraft({ ...draft, language: e.target.value })}
                >
                    {LANGUAGES.map((code) => (
                        <option key={code} value={code}>
                            {tCommon(`lang.${code}`)}
                        </option>
                    ))}
                </select>
            </EditModal>

            {/* Delete */}
            <EditModal
                open={edit === 'delete'}
                title={t('modals.deleteAccount')}
                onClose={closeEdit}
                saveLabel={t('delete.confirm')}
                saving={saving}
                error={passwordMsg}
                onSave={async () => {
                    setSaving(true);
                    setPasswordMsg('');
                    try {
                        await deleteAccount({ current_password: draft.current_password || '' });
                        navigate('/', { replace: true });
                    } catch (err) {
                        setPasswordMsg(apiErrorMessage(err));
                        setSaving(false);
                    }
                }}
            >
                <p className="font-geist m-0 text-[15px] leading-6 text-muted">
                    {t('delete.warning')}
                </p>
                <label className="block">
                    <span className="font-geist mb-1.5 block text-[14px] font-500">
                        {t('fields.currentPassword')}
                    </span>
                    <input
                        type="password"
                        required
                        className={fieldClass}
                        value={draft.current_password || ''}
                        onChange={(e) => setDraft({ ...draft, current_password: e.target.value })}
                    />
                </label>
            </EditModal>

            <AddCardModal
                open={cardOpen}
                onClose={() => setCardOpen(false)}
                onSave={(card) => setCards((current) => [...current, card])}
            />
        </SiteLayout>
    );
}
