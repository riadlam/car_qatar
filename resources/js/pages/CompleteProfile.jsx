import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/ui/Skeleton';
import Logo from '../components/landing/Logo';
import { PREFERRED_LANGUAGES } from '../data/languages';

const TITLES = [
    { value: 'Mr.', key: 'mr' },
    { value: 'Mrs.', key: 'mrs' },
    { value: 'Ms.', key: 'ms' },
    { value: 'Mx.', key: 'mx' },
];

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

/**
 * Step 2 — Account type + profile details, then redirect to previous page.
 */
export default function CompleteProfile() {
    const { t } = useTranslation('auth');
    const { t: tCommon } = useTranslation('common');
    const navigate = useNavigate();
    const { getPendingEmail, completeProfile, consumeReturnTo, isAuthenticated, loading } = useAuth();
    const { showToast } = useToast();
    const email = getPendingEmail();

    const [accountType, setAccountType] = useState('individual');
    const [form, setForm] = useState({
        title: 'Mr.',
        firstName: '',
        lastName: '',
        companyName: '',
        preferredLanguage: '',
        phone: '',
        password: '',
        passwordConfirm: '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (loading) return;
        if (!email && !isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [email, navigate, isAuthenticated, loading]);

    useEffect(() => {
        if (loading) return;
        if (isAuthenticated && !email) {
            navigate(consumeReturnTo(), { replace: true });
        }
    }, [isAuthenticated, email, consumeReturnTo, navigate, loading]);

    const firstApiError = (err) => {
        const errors = err?.response?.data?.errors;
        if (errors && typeof errors === 'object') {
            const first = Object.values(errors).flat()[0];
            if (first) return first;
        }
        return err?.response?.data?.message || t('completeProfile.errors.generic');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.phone || form.phone.replace(/\D/g, '').length < 8) {
            setError(t('completeProfile.errors.phone'));
            return;
        }
        if (form.password.length < 8) {
            setError(t('completeProfile.errors.passwordLength'));
            return;
        }
        if (form.password !== form.passwordConfirm) {
            setError(t('completeProfile.errors.passwordMatch'));
            return;
        }
        if (accountType === 'individual') {
            if (!form.firstName.trim() || !form.lastName.trim()) {
                setError(t('completeProfile.errors.nameRequired'));
                return;
            }
        } else if (!form.companyName.trim()) {
            setError(t('completeProfile.errors.companyRequired'));
            return;
        }

        setSubmitting(true);
        try {
            const nextUser = await completeProfile({
                accountType,
                title: accountType === 'company' ? '' : form.title,
                firstName: accountType === 'company' ? '' : form.firstName.trim(),
                lastName: accountType === 'company' ? '' : form.lastName.trim(),
                companyName: accountType === 'company' ? form.companyName.trim() : '',
                preferredLanguage: form.preferredLanguage,
                phone: form.phone,
                email,
                password: form.password,
                passwordConfirm: form.passwordConfirm,
            });
            const greeting =
                accountType === 'company'
                    ? nextUser?.company_name || nextUser?.company || nextUser?.name
                    : nextUser?.first_name || nextUser?.name?.split?.(' ')?.[0];
            showToast(
                greeting
                    ? t('completeProfile.toast.readyNamed', { name: greeting })
                    : t('completeProfile.toast.ready'),
            );
            navigate(consumeReturnTo(), { replace: true });
        } catch (err) {
            setError(firstApiError(err));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Skeleton variant="page" />;
    }

    if (!email) return null;

    const accountTabs = [
        { id: 'individual', label: t('completeProfile.individual') },
        { id: 'company', label: t('completeProfile.company') },
    ];

    return (
        <main className="flex min-h-screen flex-col bg-white text-ink-text">
            <header className="flex items-center justify-between px-6 py-5 lg:px-12">
                <Link to="/" aria-label={t('completeProfile.homeAria')}>
                    <Logo compact inverted />
                </Link>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-geist cursor-pointer text-[14px] font-500 text-muted transition hover:text-ink-text"
                >
                    {t('completeProfile.back')}
                </button>
            </header>

            <div className="flex flex-1 items-start justify-center px-6 pt-8 pb-16 sm:pt-12">
                <div className="w-full max-w-[480px]">
                    <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                        {t('completeProfile.title')}
                    </h1>
                    <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-muted">
                        {t('completeProfile.subtitle')}
                    </p>
                    <p className="font-geist mt-2 m-0 text-[14px] text-ink-text/70">
                        {t('completeProfile.emailLabel')}{' '}
                        <span className="font-500 text-ink-text">{email}</span>
                    </p>

                    <div
                        role="tablist"
                        aria-label={t('completeProfile.accountTypeAria')}
                        className="mt-8 grid grid-cols-2 gap-1 rounded-full border border-[#e0ddd6] bg-[#f7f6f3] p-1"
                    >
                        {accountTabs.map((tab) => {
                            const on = accountType === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={on}
                                    onClick={() => {
                                        setAccountType(tab.id);
                                        setError('');
                                    }}
                                    className={`font-geist min-h-11 cursor-pointer rounded-full px-2 text-[13px] font-500 transition sm:px-3 sm:text-[15px] ${
                                        on
                                            ? 'bg-wine-700 text-white shadow-sm'
                                            : 'text-ink-text hover:bg-white/80'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {accountType === 'company' ? (
                        <p className="font-geist mt-3 m-0 text-[13px] leading-5 text-muted">
                            {t('completeProfile.companyHint')}
                        </p>
                    ) : null}

                    <form onSubmit={onSubmit} className="mt-8 space-y-5">
                        {accountType !== 'company' ? (
                            <>
                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        {t('completeProfile.fields.title')}
                                    </span>
                                    <select
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className={fieldClass}
                                    >
                                        {TITLES.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {t(`completeProfile.titles.${item.key}`)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        {t('completeProfile.fields.firstName')}
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        autoComplete="given-name"
                                        value={form.firstName}
                                        onChange={(e) =>
                                            setForm({ ...form, firstName: e.target.value })
                                        }
                                        className={fieldClass}
                                    />
                                </label>

                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        {t('completeProfile.fields.lastName')}
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        autoComplete="family-name"
                                        value={form.lastName}
                                        onChange={(e) =>
                                            setForm({ ...form, lastName: e.target.value })
                                        }
                                        className={fieldClass}
                                    />
                                </label>
                            </>
                        ) : (
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    {t('completeProfile.fields.companyName')}
                                </span>
                                <input
                                    type="text"
                                    required
                                    autoComplete="organization"
                                    value={form.companyName}
                                    onChange={(e) =>
                                        setForm({ ...form, companyName: e.target.value })
                                    }
                                    className={fieldClass}
                                    placeholder={t('completeProfile.fields.companyPlaceholder')}
                                />
                            </label>
                        )}

                        <fieldset className="m-0 border-0 p-0">
                            <legend className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('completeProfile.fields.preferredLanguage')}{' '}
                                <span className="font-400 text-muted">
                                    {t('completeProfile.fields.optional')}
                                </span>
                            </legend>
                            <div
                                role="radiogroup"
                                aria-label={t('completeProfile.fields.preferredLanguageAria')}
                                className="flex flex-wrap gap-2"
                            >
                                <label
                                    className={`font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 py-2 text-[13px] transition sm:text-[14px] ${
                                        form.preferredLanguage === ''
                                            ? 'border-wine-700 bg-wine-50 text-wine-800 shadow-[0_0_0_1px_#5b0520]'
                                            : 'border-[#e0ddd6] bg-white text-ink-text hover:border-[#c9c5bc]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="signup-language"
                                        className="sr-only"
                                        checked={form.preferredLanguage === ''}
                                        onChange={() =>
                                            setForm({ ...form, preferredLanguage: '' })
                                        }
                                    />
                                    {t('completeProfile.fields.noPreference')}
                                </label>
                                {PREFERRED_LANGUAGES.map((lang) => {
                                    const on = form.preferredLanguage === lang.id;
                                    return (
                                        <label
                                            key={lang.id}
                                            title={tCommon(`lang.${lang.id}`)}
                                            className={`font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 py-2 text-[13px] transition sm:text-[14px] ${
                                                on
                                                    ? 'border-wine-700 bg-wine-50 text-wine-800 shadow-[0_0_0_1px_#5b0520]'
                                                    : 'border-[#e0ddd6] bg-white text-ink-text hover:border-[#c9c5bc]'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="signup-language"
                                                className="sr-only"
                                                checked={on}
                                                onChange={() =>
                                                    setForm({
                                                        ...form,
                                                        preferredLanguage: lang.id,
                                                    })
                                                }
                                            />
                                            {tCommon(`lang.${lang.id}`)}
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>

                        <fieldset className="m-0 border-0 p-0">
                            <legend className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('completeProfile.fields.mobile')}
                            </legend>
                            <PhoneInput
                                defaultCountry="qa"
                                value={form.phone}
                                onChange={(phone) => setForm({ ...form, phone })}
                                forceDialCode
                                className="almajd-phone"
                                inputProps={{
                                    required: true,
                                    name: 'phone',
                                    autoComplete: 'tel',
                                }}
                            />
                            <p className="font-geist mt-2 m-0 text-[13px] leading-5 text-muted">
                                {t('completeProfile.fields.mobileHint')}
                            </p>
                        </fieldset>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('completeProfile.fields.email')}
                            </span>
                            <input
                                type="email"
                                readOnly
                                value={email}
                                className={`${fieldClass} cursor-default bg-[#f7f6f3] text-ink-text/80`}
                            />
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('completeProfile.fields.password')}
                            </span>
                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                minLength={8}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className={fieldClass}
                                placeholder={t('completeProfile.fields.passwordPlaceholder')}
                            />
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('completeProfile.fields.confirmPassword')}
                            </span>
                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                minLength={8}
                                value={form.passwordConfirm}
                                onChange={(e) =>
                                    setForm({ ...form, passwordConfirm: e.target.value })
                                }
                                className={fieldClass}
                            />
                        </label>

                        {error ? (
                            <p className="font-geist m-0 text-[14px] leading-5 text-red-700" role="alert">
                                {error}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="font-geist mt-2 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-6 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:opacity-60"
                        >
                            {submitting ? t('completeProfile.sending') : t('completeProfile.submit')}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
