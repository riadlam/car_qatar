import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/ui/Skeleton';
import Logo from '../components/landing/Logo';
import { PREFERRED_LANGUAGES } from '../data/languages';

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Mx.'];

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

/**
 * Step 2 — Account type + profile details, then redirect to previous page.
 */
export default function CompleteProfile() {
    const navigate = useNavigate();
    const { getPendingEmail, completeProfile, consumeReturnTo, isAuthenticated, user, loading } = useAuth();
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
    const [submitted, setSubmitted] = useState(false);

    const pendingReview =
        submitted ||
        (isAuthenticated && user?.account_type === 'chauffeur' && user?.chauffeur_status === 'pending');
    const declined =
        isAuthenticated && user?.account_type === 'chauffeur' && user?.chauffeur_status === 'declined';

    useEffect(() => {
        if (loading) return;
        if (!email && !pendingReview && !declined && !isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [email, navigate, pendingReview, declined, isAuthenticated, loading]);

    useEffect(() => {
        if (loading || pendingReview || declined) return;
        if (isAuthenticated && !email) {
            navigate(consumeReturnTo(), { replace: true });
        }
    }, [isAuthenticated, email, consumeReturnTo, navigate, loading, pendingReview, declined]);

    const firstApiError = (err) => {
        const errors = err?.response?.data?.errors;
        if (errors && typeof errors === 'object') {
            const first = Object.values(errors).flat()[0];
            if (first) return first;
        }
        return err?.response?.data?.message || 'Unable to create your account. Please try again.';
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.phone || form.phone.replace(/\D/g, '').length < 8) {
            setError('Please enter a valid mobile number.');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (form.password !== form.passwordConfirm) {
            setError('Passwords do not match.');
            return;
        }
        const isPerson = accountType === 'individual' || accountType === 'chauffeur';
        if (isPerson) {
            if (!form.firstName.trim() || !form.lastName.trim()) {
                setError('Please enter your first and last name.');
                return;
            }
        } else if (!form.companyName.trim()) {
            setError('Please enter your company name.');
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
            if (nextUser?.application_pending) {
                setSubmitted(true);
                return;
            }
            const first = nextUser?.first_name || nextUser?.name?.split?.(' ')?.[0];
            showToast(
                first
                    ? `Congratulations, ${first}! Your account is ready.`
                    : 'Congratulations! Your account is ready.',
            );
            navigate(consumeReturnTo(), { replace: true });
        } catch (err) {
            setError(firstApiError(err));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !submitted) {
        return <Skeleton variant="page" />;
    }

    if (!email && !pendingReview && !declined) return null;

    if (declined) {
        return (
            <main className="flex min-h-screen flex-col bg-white text-ink-text">
                <header className="flex items-center justify-between px-6 py-5 lg:px-12">
                    <Link to="/" aria-label="AL MAJD home">
                        <Logo compact inverted />
                    </Link>
                </header>
                <div className="flex flex-1 items-start justify-center px-6 pt-16 pb-16">
                    <div className="w-full max-w-[480px] text-center">
                        <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                            Application not approved
                        </h1>
                        <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-muted">
                            You&apos;re still signed in. Your chauffeur application was declined.
                        </p>
                        <Link
                            to="/"
                            className="font-geist mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-wine-700 px-6 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (pendingReview) {
        return (
            <main className="flex min-h-screen flex-col bg-white text-ink-text">
                <header className="flex items-center justify-between px-6 py-5 lg:px-12">
                    <Link to="/" aria-label="AL MAJD home">
                        <Logo compact inverted />
                    </Link>
                </header>
                <div className="flex flex-1 items-start justify-center px-6 pt-16 pb-16">
                    <div className="w-full max-w-[480px] text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                <path
                                    d="M8 12.5l2.5 2.5L16 9.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <span className="font-geist inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[12px] font-500 tracking-wide text-amber-900 uppercase">
                            Waiting confirmation
                        </span>
                        <h1 className="font-fragment m-0 mt-4 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                            Waiting confirmation
                        </h1>
                        <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-muted">
                            You&apos;re signed in. Your chauffeur application is waiting for confirmation. We&apos;ll
                            contact you when a decision is ready.
                        </p>
                        <Link
                            to="/"
                            className="font-geist mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-wine-700 px-6 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col bg-white text-ink-text">
            <header className="flex items-center justify-between px-6 py-5 lg:px-12">
                <Link to="/" aria-label="AL MAJD home">
                    <Logo compact inverted />
                </Link>
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-geist cursor-pointer text-[14px] font-500 text-muted transition hover:text-ink-text"
                >
                    Back
                </button>
            </header>

            <div className="flex flex-1 items-start justify-center px-6 pt-8 pb-16 sm:pt-12">
                <div className="w-full max-w-[480px]">
                    <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                        Create your account
                    </h1>
                    <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-muted">
                        Choose how you want to sign up, then fill in your details.
                    </p>
                    <p className="font-geist mt-2 m-0 text-[14px] text-ink-text/70">
                        Email <span className="font-500 text-ink-text">{email}</span>
                    </p>

                    <div
                        role="tablist"
                        aria-label="Account type"
                        className="mt-8 grid grid-cols-3 gap-1 rounded-full border border-[#e0ddd6] bg-[#f7f6f3] p-1"
                    >
                        {[
                            { id: 'individual', label: 'Individual' },
                            { id: 'company', label: 'Company' },
                            { id: 'chauffeur', label: 'Chauffeur' },
                        ].map((tab) => {
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

                    <form onSubmit={onSubmit} className="mt-8 space-y-5">
                        {accountType !== 'company' ? (
                            <>
                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        Title
                                    </span>
                                    <select
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className={fieldClass}
                                    >
                                        {TITLES.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        First name
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
                                        Last name
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
                                    Company name
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
                                    placeholder="Your company"
                                />
                            </label>
                        )}

                        <fieldset className="m-0 border-0 p-0">
                            <legend className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Preferred language{' '}
                                <span className="font-400 text-muted">(optional)</span>
                            </legend>
                            <div
                                role="radiogroup"
                                aria-label="Preferred language"
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
                                    No preference
                                </label>
                                {PREFERRED_LANGUAGES.map((lang) => {
                                    const on = form.preferredLanguage === lang.id;
                                    return (
                                        <label
                                            key={lang.id}
                                            title={lang.name}
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
                                            {lang.label}
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>

                        <fieldset className="m-0 border-0 p-0">
                            <legend className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Mobile number
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
                                {accountType === 'chauffeur'
                                    ? 'We will use this number to contact you about your application.'
                                    : 'We will use this number to contact you about your ride.'}
                            </p>
                        </fieldset>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Email
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
                                Password
                            </span>
                            <input
                                type="password"
                                required
                                autoComplete="new-password"
                                minLength={8}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className={fieldClass}
                                placeholder="At least 8 characters"
                            />
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Confirm password
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
                            {submitting
                                ? 'Sending…'
                                : accountType === 'chauffeur'
                                  ? 'Submit application'
                                  : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
