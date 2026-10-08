import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { resendEmailOtp, verifyEmailOtp } from '../api/auth';
import Logo from '../components/landing/Logo';
import Skeleton from '../components/ui/Skeleton';

const COOLDOWN_DEFAULT = 60;

/**
 * Signup step 2 — enter the 6-digit email confirmation code.
 */
export default function VerifyEmail() {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    const { getPendingEmail, setEmailOtpToken, loading, isAuthenticated, consumeReturnTo } = useAuth();
    const email = getPendingEmail();

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(COOLDOWN_DEFAULT);

    useEffect(() => {
        if (loading) return;
        if (isAuthenticated) {
            navigate(consumeReturnTo(), { replace: true });
            return;
        }
        if (!email) {
            navigate('/login', { replace: true });
        }
    }, [loading, isAuthenticated, email, navigate, consumeReturnTo]);

    useEffect(() => {
        if (cooldown <= 0) return undefined;
        const id = window.setInterval(() => {
            setCooldown((s) => (s <= 1 ? 0 : s - 1));
        }, 1000);
        return () => window.clearInterval(id);
    }, [cooldown]);

    const fieldClass =
        'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-center text-[22px] tracking-[0.35em] text-ink-text outline-none transition focus:border-wine-700';

    const firstError = (err) =>
        err?.response?.data?.errors?.code?.[0] ||
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.message ||
        t('verifyEmail.errors.generic');

    const onVerify = async (e) => {
        e.preventDefault();
        setError('');
        const trimmed = code.replace(/\D/g, '');
        if (trimmed.length !== 6) {
            setError(t('verifyEmail.errors.codeLength'));
            return;
        }
        setSubmitting(true);
        try {
            const data = await verifyEmailOtp({ email, code: trimmed });
            setEmailOtpToken(data.email_otp_token);
            navigate('/complete-profile', { replace: true });
        } catch (err) {
            setError(firstError(err));
        } finally {
            setSubmitting(false);
        }
    };

    const onResend = async () => {
        if (cooldown > 0 || resending) return;
        setError('');
        setResending(true);
        try {
            const data = await resendEmailOtp(email);
            setCooldown(Number(data.cooldown_seconds) || COOLDOWN_DEFAULT);
            setCode('');
        } catch (err) {
            setError(firstError(err));
        } finally {
            setResending(false);
        }
    };

    if (loading) {
        return <Skeleton variant="page" />;
    }

    if (!email) return null;

    return (
        <main className="flex min-h-screen flex-col bg-white text-ink-text">
            <header className="flex items-center justify-between px-6 py-5 lg:px-12">
                <Link to="/" aria-label={t('verifyEmail.homeAria')}>
                    <Logo compact inverted />
                </Link>
                <Link
                    to="/login"
                    className="font-geist text-[14px] font-500 text-muted transition hover:text-ink-text"
                >
                    {t('verifyEmail.back')}
                </Link>
            </header>

            <div className="flex flex-1 items-start justify-center px-6 pt-10 pb-16 sm:items-center sm:pt-0">
                <div className="w-full max-w-[420px]">
                    <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                        {t('verifyEmail.title')}
                    </h1>
                    <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-muted">
                        {t('verifyEmail.subtitle', { email })}
                    </p>

                    {error ? (
                        <p className="font-geist mt-4 m-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[14px] text-rose-700">
                            {error}
                        </p>
                    ) : null}

                    <form onSubmit={onVerify} className="mt-6 space-y-4">
                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('verifyEmail.code')}
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="••••••"
                                className={fieldClass}
                                aria-label={t('verifyEmail.code')}
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={submitting || code.replace(/\D/g, '').length !== 6}
                            className="font-geist inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-6 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:opacity-60"
                        >
                            {submitting ? t('verifyEmail.verifying') : t('verifyEmail.submit')}
                        </button>
                    </form>

                    <p className="font-geist mt-6 m-0 text-center text-[14px] text-muted">
                        {t('verifyEmail.didNotGet')}{' '}
                        <button
                            type="button"
                            onClick={onResend}
                            disabled={cooldown > 0 || resending}
                            className="font-500 text-wine-700 transition hover:text-wine-600 disabled:cursor-not-allowed disabled:text-muted"
                        >
                            {resending
                                ? t('verifyEmail.resending')
                                : cooldown > 0
                                  ? t('verifyEmail.resendIn', { seconds: cooldown })
                                  : t('verifyEmail.resend')}
                        </button>
                    </p>
                </div>
            </div>
        </main>
    );
}
