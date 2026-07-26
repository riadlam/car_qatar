import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/landing/Logo';

const TITLES = ['Mr.', 'Mrs.'];

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

/**
 * Step 2 — Complete your profile, then redirect to previous page.
 */
export default function CompleteProfile() {
    const navigate = useNavigate();
    const { getPendingEmail, completeProfile, consumeReturnTo, isAuthenticated } = useAuth();
    const email = getPendingEmail();

    const [form, setForm] = useState({
        title: 'Mr.',
        firstName: '',
        lastName: '',
        phone: '',
    });

    useEffect(() => {
        if (!email) {
            navigate('/login', { replace: true });
        }
    }, [email, navigate]);

    useEffect(() => {
        if (isAuthenticated && !email) {
            navigate(consumeReturnTo(), { replace: true });
        }
    }, [isAuthenticated, email, consumeReturnTo, navigate]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!form.phone || form.phone.replace(/\D/g, '').length < 8) return;
        completeProfile({
            title: form.title,
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            email,
        });
        navigate(consumeReturnTo(), { replace: true });
    };

    if (!email) return null;

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
                        Complete your profile
                    </h1>
                    <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-muted">
                        Please provide your details to continue.
                    </p>
                    <p className="font-geist mt-2 m-0 text-[14px] text-ink-text/70">
                        Signed in as <span className="font-500 text-ink-text">{email}</span>
                    </p>

                    <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
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
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                className={fieldClass}
                            />
                        </label>

                        <fieldset className="m-0 border-0 p-0">
                            <legend className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Mobile number
                            </legend>
                            <PhoneInput
                                defaultCountry="dz"
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
                                We will use this number to contact you about your ride.
                            </p>
                        </fieldset>

                        <button
                            type="submit"
                            className="font-geist mt-2 inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-6 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                        >
                            Save and continue
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
