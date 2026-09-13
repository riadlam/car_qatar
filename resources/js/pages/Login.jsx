import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/landing/Logo';

/**
 * Sign in with email + password, or start create-account (email → complete-profile).
 */
export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setReturnTo, setPendingEmail, login, isAuthenticated, user, consumeReturnTo } = useAuth();
    const { showToast } = useToast();
    const [mode, setMode] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const from = searchParams.get('from');
        if (from) setReturnTo(from);
    }, [searchParams, setReturnTo]);

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.account_type === 'chauffeur' && user?.chauffeur_status === 'pending') {
                navigate('/complete-profile', { replace: true });
                return;
            }
            navigate(consumeReturnTo(), { replace: true });
        }
    }, [isAuthenticated, user, consumeReturnTo, navigate]);

    const onSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const nextUser = await login({ email: email.trim(), password });
            if (nextUser?.chauffeur_status === 'pending') {
                navigate('/complete-profile', { replace: true });
                return;
            }
            const first = nextUser?.first_name || nextUser?.name?.split?.(' ')?.[0];
            showToast(
                first
                    ? `Congratulations, ${first}! You’re signed in.`
                    : 'Congratulations! You’re signed in.',
            );
            navigate(consumeReturnTo(), { replace: true });
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.email?.[0] ||
                'Unable to sign in. Check your email and password.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const onCreateAccount = (e) => {
        e.preventDefault();
        setError('');
        const trimmed = email.trim();
        if (!trimmed) {
            setError('Please enter your email.');
            return;
        }
        setPendingEmail(trimmed);
        navigate('/complete-profile');
    };

    const fieldClass =
        'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

    return (
        <main className="flex min-h-screen flex-col bg-white text-ink-text">
            <header className="flex items-center justify-between px-6 py-5 lg:px-12">
                <Link to="/" aria-label="AL MAJD home">
                    <Logo compact inverted />
                </Link>
                <Link
                    to="/"
                    className="font-geist text-[14px] font-500 text-muted transition hover:text-ink-text"
                >
                    Close
                </Link>
            </header>

            <div className="flex flex-1 items-start justify-center px-6 pt-10 pb-16 sm:items-center sm:pt-0">
                <div className="w-full max-w-[420px]">
                    <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                        {mode === 'signin' ? 'Sign in' : 'Create an account'}
                    </h1>
                    <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-muted">
                        {mode === 'signin'
                            ? 'Enter your email and password to continue.'
                            : 'Enter your email. We will ask for a few details next.'}
                    </p>

                    <div
                        role="tablist"
                        aria-label="Auth mode"
                        className="mt-8 grid grid-cols-2 gap-1 rounded-full border border-[#e0ddd6] bg-[#f7f6f3] p-1"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === 'signin'}
                            onClick={() => {
                                setMode('signin');
                                setError('');
                            }}
                            className={`font-geist min-h-10 cursor-pointer rounded-full text-[14px] font-500 transition ${
                                mode === 'signin'
                                    ? 'bg-white text-ink-text shadow-sm'
                                    : 'text-muted'
                            }`}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={mode === 'signup'}
                            onClick={() => {
                                setMode('signup');
                                setError('');
                            }}
                            className={`font-geist min-h-10 cursor-pointer rounded-full text-[14px] font-500 transition ${
                                mode === 'signup'
                                    ? 'bg-white text-ink-text shadow-sm'
                                    : 'text-muted'
                            }`}
                        >
                            Create account
                        </button>
                    </div>

                    {error ? (
                        <p className="font-geist mt-4 m-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[14px] text-rose-700">
                            {error}
                        </p>
                    ) : null}

                    {mode === 'signin' ? (
                        <form onSubmit={onSignIn} className="mt-6 space-y-4">
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    Email
                                </span>
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className={fieldClass}
                                />
                            </label>
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    Password
                                </span>
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={fieldClass}
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="font-geist inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-6 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:opacity-60"
                            >
                                {submitting ? 'Signing in…' : 'Sign in'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={onCreateAccount} className="mt-6 space-y-4">
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    Email
                                </span>
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className={fieldClass}
                                />
                            </label>
                            <button
                                type="submit"
                                className="font-geist inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-6 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                            >
                                Continue
                            </button>
                        </form>
                    )}

                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-[#e8e8ea]" />
                        <span className="font-geist text-[13px] font-500 tracking-[0.08em] text-muted uppercase">
                            or
                        </span>
                        <div className="h-px flex-1 bg-[#e8e8ea]" />
                    </div>

                    <button
                        type="button"
                        disabled
                        title="Google sign-in coming soon"
                        className="font-geist inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-full border border-[#d8d8dc] bg-white px-6 py-3 text-[16px] font-500 text-ink-text opacity-60"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>
                    <p className="font-geist mt-3 m-0 text-center text-[13px] text-muted">
                        Google sign-in is not available yet.
                    </p>
                </div>
            </div>
        </main>
    );
}

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );
}
