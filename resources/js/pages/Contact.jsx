import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import SiteLayout from '../components/landing/SiteLayout';
import { IMG } from '../components/landing/motion';
import { fetchContactChannels } from '../api/catalog';
import { sendContactMessage } from '../api/contactMessages';

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

const empty = { name: '', email: '', phone: '', subject: '', message: '' };

const FALLBACK_CHANNELS = [
    { key: 'call_us', label: 'Call us', href: 'tel:+97440000000', type: 'phone' },
    { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/97440000000', type: 'whatsapp' },
    { key: 'email', label: 'Email', href: 'mailto:concierge@almajd.com', type: 'email' },
];

function channelIcon(type) {
    if (type === 'phone' || type === 'call') {
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M8.5 3.5h2.2l1.1 3.3-1.7 1.2a12.5 12.5 0 0 0 5.4 5.4l1.2-1.7 3.3 1.1v2.2c0 .9-.7 1.7-1.6 1.9-1.7.4-5.1.3-8.5-3.1S5.1 8.3 5.5 6.6c.2-.9 1-1.6 1.9-1.6Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }
    if (type === 'whatsapp') {
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M19.5 12a7.5 7.5 0 0 1-11.2 6.5L4.5 19.5l1.1-3.6A7.5 7.5 0 1 1 19.5 12Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M9.2 10.2c.4 1.6 1.9 3 3.5 3.5l1-.8.9.3c-.2.7-.9 1.3-1.6 1.4-1.8.3-4.2-1.7-5.2-3.5-.4-.7-.5-1.6.2-2.1l.4-.8.9.3-.1.7Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4 7.5 12 13l8-5.5M5.5 18.5h13A1.5 1.5 0 0 0 20 17V7a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 4 7v10a1.5 1.5 0 0 0 1.5 1.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function channelHint(type) {
    if (type === 'phone' || type === 'call') return 'Speak with concierge';
    if (type === 'whatsapp') return 'Message us on WhatsApp';
    if (type === 'email') return 'Write to our team';
    return 'Get in touch';
}

/**
 * Dedicated leave-a-message / contact page — form + other contact channels.
 */
export default function Contact() {
    const [form, setForm] = useState(empty);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const [channels, setChannels] = useState(FALLBACK_CHANNELS);

    useEffect(() => {
        let cancelled = false;
        fetchContactChannels()
            .then((rows) => {
                if (cancelled || !Array.isArray(rows) || !rows.length) return;
                const useful = rows.filter(
                    (c) => c.key !== 'leave_message' && c.type !== 'form' && c.href,
                );
                if (useful.length) setChannels(useful);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            await sendContactMessage({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || undefined,
                subject: form.subject.trim() || undefined,
                message: form.message.trim(),
            });
            setSent(true);
            setForm(empty);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.message?.[0] ||
                'Could not send your message. Please try again.';
            setError(msg);
        } finally {
            setBusy(false);
        }
    };

    const sideChannels = useMemo(() => channels.slice(0, 4), [channels]);

    return (
        <SiteLayout>
            <div id="top" className="bg-page">
                <section className="relative min-h-[42vh] overflow-hidden sm:min-h-[48vh]">
                    <img
                        src={IMG.ride1}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/25" />
                    <div className="relative mx-auto flex min-h-[42vh] max-w-[1170px] flex-col justify-end px-6 pb-12 pt-[110px] sm:min-h-[48vh] sm:pb-16 lg:px-12 lg:pt-[120px]">
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            className="font-fragment m-0 text-[28px] leading-none tracking-[0.2px] text-white sm:text-[34px]"
                        >
                            AL MAJD
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="font-fragment mt-4 m-0 max-w-xl text-[34px] leading-10 font-400 tracking-[0.2px] text-white sm:text-[44px] sm:leading-[52px]"
                        >
                            Leave a message
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                            className="font-geist mt-3 m-0 max-w-lg text-[16px] leading-6 text-white/85"
                        >
                            Tell us how we can help — our concierge team will reply as soon as possible.
                        </motion.p>
                        <motion.a
                            href="#message"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.28 }}
                            className="font-geist mt-7 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-[15px] font-500 text-ink-text no-underline transition hover:bg-page"
                        >
                            Write your message
                        </motion.a>
                    </div>
                </section>

                <section
                    id="message"
                    className="scroll-mt-28 mx-auto grid w-full max-w-[1170px] gap-10 px-6 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-14 lg:px-12 lg:py-20"
                >
                    <aside className="min-w-0">
                        <p className="font-geist m-0 text-[13px] font-500 tracking-wide text-wine-700 uppercase">
                            Other ways to reach us
                        </p>
                        <h2 className="font-fragment mt-2 m-0 text-[28px] leading-9 font-400 text-ink-text">
                            Concierge, always close
                        </h2>
                        <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-ink-text/70">
                            Prefer a call or chat? Use the channels below — or send a written note and we&apos;ll
                            follow up.
                        </p>

                        <ul className="mt-8 m-0 list-none space-y-3 p-0">
                            {sideChannels.map((channel) => {
                                const href = channel.href || '#';
                                const external =
                                    /^https?:/i.test(href) ||
                                    href.startsWith('mailto:') ||
                                    href.startsWith('tel:');
                                return (
                                    <li key={channel.key || channel.label}>
                                        <a
                                            href={href}
                                            {...(external
                                                ? { target: '_blank', rel: 'noreferrer' }
                                                : {})}
                                            className="group flex items-center gap-4 rounded-2xl border border-[#e8e6e1] bg-white px-4 py-4 no-underline transition hover:border-wine-700/40 hover:shadow-sm"
                                        >
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wine-50 text-wine-700 transition group-hover:bg-wine-700 group-hover:text-white">
                                                {channelIcon(channel.type)}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="font-geist block text-[16px] font-500 text-ink-text">
                                                    {channel.label}
                                                </span>
                                                <span className="font-geist mt-0.5 block text-[13px] text-muted">
                                                    {channelHint(channel.type)}
                                                </span>
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>

                        <p className="font-geist mt-8 m-0 text-[13px] leading-5 text-muted">
                            Looking for an upcoming ride?{' '}
                            <Link to="/journeys" className="font-500 text-wine-700 underline-offset-2 hover:underline">
                                View your journeys
                            </Link>
                            .
                        </p>
                    </aside>

                    <div className="min-w-0 rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-[0_20px_50px_rgba(15,19,25,0.06)] sm:p-8">
                        {sent ? (
                            <div className="flex flex-col items-start py-6 sm:py-10">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path
                                            d="M5 13l4 4L19 7"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <h2 className="font-fragment mt-5 m-0 text-[28px] leading-9 font-400 text-ink-text">
                                    Message sent
                                </h2>
                                <p className="font-geist mt-3 m-0 max-w-md text-[16px] leading-6 text-ink-text/75">
                                    Thank you — our team received your note and will follow up shortly.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSent(false)}
                                        className="font-geist cursor-pointer rounded-full bg-wine-700 px-5 py-3 text-[15px] font-500 text-white transition hover:bg-wine-600"
                                    >
                                        Send another
                                    </button>
                                    <Link
                                        to="/"
                                        className="font-geist inline-flex rounded-full border border-[#d8d8dc] px-5 py-3 text-[15px] font-500 text-ink-text no-underline transition hover:border-wine-700"
                                    >
                                        Back home
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="font-fragment m-0 text-[26px] leading-8 font-400 text-ink-text sm:text-[28px]">
                                    Write to us
                                </h2>
                                <p className="font-geist mt-2 m-0 text-[15px] leading-6 text-muted">
                                    Fields marked * are required.
                                </p>
                                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="block sm:col-span-1">
                                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                                Name *
                                            </span>
                                            <input
                                                required
                                                name="name"
                                                autoComplete="name"
                                                value={form.name}
                                                onChange={set('name')}
                                                className={fieldClass}
                                            />
                                        </label>
                                        <label className="block sm:col-span-1">
                                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                                Email *
                                            </span>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                value={form.email}
                                                onChange={set('email')}
                                                className={fieldClass}
                                            />
                                        </label>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                                Phone
                                            </span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                autoComplete="tel"
                                                value={form.phone}
                                                onChange={set('phone')}
                                                className={fieldClass}
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                                Subject
                                            </span>
                                            <input
                                                name="subject"
                                                value={form.subject}
                                                onChange={set('subject')}
                                                placeholder="Booking, feedback, partnership…"
                                                className={fieldClass}
                                            />
                                        </label>
                                    </div>
                                    <label className="block">
                                        <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                            Message *
                                        </span>
                                        <textarea
                                            required
                                            name="message"
                                            rows={6}
                                            value={form.message}
                                            onChange={set('message')}
                                            className={`${fieldClass} min-h-[140px] resize-y`}
                                        />
                                    </label>

                                    {error ? (
                                        <p className="font-geist m-0 text-[14px] text-red-700" role="alert">
                                            {error}
                                        </p>
                                    ) : null}

                                    <button
                                        type="submit"
                                        disabled={busy}
                                        className="font-geist inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-5 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                                    >
                                        {busy ? 'Sending…' : 'Send message'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </SiteLayout>
    );
}
