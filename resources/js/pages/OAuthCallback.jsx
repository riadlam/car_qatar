import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/landing/Logo';
import Skeleton from '../components/ui/Skeleton';

/** Completes Google OAuth after Laravel redirects back with a one-time code. */
export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { completeGoogleLogin, consumeReturnTo } = useAuth();
    const { showToast } = useToast();
    const [error, setError] = useState('');

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            setError('Missing Google sign-in code. Please try again.');
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const user = await completeGoogleLogin(code);
                if (cancelled) return;
                const first = user?.first_name || user?.name?.split?.(' ')?.[0];
                showToast(
                    first
                        ? `Congratulations, ${first}! You’re signed in.`
                        : 'Congratulations! You’re signed in.',
                );
                navigate(consumeReturnTo(), { replace: true });
            } catch (err) {
                if (cancelled) return;
                setError(
                    err?.response?.data?.message ||
                        'Unable to finish Google sign-in. Please try again.',
                );
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [searchParams, completeGoogleLogin, consumeReturnTo, navigate, showToast]);

    if (error) {
        return (
            <main className="flex min-h-screen flex-col bg-white text-ink-text">
                <header className="flex items-center justify-between px-6 py-5 lg:px-12">
                    <Link to="/" aria-label="AL MAJD home">
                        <Logo compact inverted />
                    </Link>
                </header>
                <div className="flex flex-1 items-center justify-center px-6 pb-16">
                    <div className="w-full max-w-[420px] text-center">
                        <h1 className="font-fragment m-0 text-[28px] font-400 text-ink-text">
                            Google sign-in failed
                        </h1>
                        <p className="font-geist mt-3 text-[15px] text-muted">{error}</p>
                        <Link
                            to="/login"
                            className="font-geist mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-wine-700 px-6 text-[16px] font-500 text-white"
                        >
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return <Skeleton variant="page" />;
}
