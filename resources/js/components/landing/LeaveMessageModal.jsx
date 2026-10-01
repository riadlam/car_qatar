import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { sendContactMessage } from '../../api/contactMessages';

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

const empty = { name: '', email: '', phone: '', subject: '', message: '' };

export default function LeaveMessageModal({ open, onClose }) {
    const titleId = useId();
    const [form, setForm] = useState(empty);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape' && !busy) onClose();
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, busy, onClose]);

    useEffect(() => {
        if (!open) {
            setForm(empty);
            setError('');
            setSent(false);
            setBusy(false);
        }
    }, [open]);

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

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <button
                        type="button"
                        aria-label="Close"
                        className="absolute inset-0 bg-black/45"
                        onClick={() => !busy && onClose()}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 flex max-h-[min(92svh,720px)] w-full max-w-[520px] flex-col overflow-hidden rounded-t-2xl bg-page shadow-2xl sm:rounded-2xl"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-ink-text/8 px-5 py-4 sm:px-6">
                            <div>
                                <h2
                                    id={titleId}
                                    className="font-fragment m-0 text-[22px] leading-7 font-400 tracking-[0.2px] text-ink-text sm:text-[24px]"
                                >
                                    Leave a message
                                </h2>
                                <p className="font-geist mt-1 m-0 text-[14px] leading-5 text-ink-text/70">
                                    We&apos;ll get back to you as soon as we can.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => !busy && onClose()}
                                className="font-geist flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-text/70 transition hover:bg-black/5 hover:text-ink-text"
                                aria-label="Close dialog"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="overflow-y-auto px-5 py-5 sm:px-6">
                            {sent ? (
                                <p className="font-geist m-0 rounded-xl border border-wine-200 bg-wine-50 p-5 text-center text-[16px] leading-6 text-ink-text">
                                    Thank you — your message was sent. Our team will follow up shortly.
                                </p>
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <label className="block">
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
                                    <label className="block">
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
                                            className={fieldClass}
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                            Message *
                                        </span>
                                        <textarea
                                            required
                                            name="message"
                                            rows={5}
                                            value={form.message}
                                            onChange={set('message')}
                                            className={`${fieldClass} resize-y min-h-[120px]`}
                                        />
                                    </label>

                                    {error ? (
                                        <p className="font-geist m-0 text-[14px] text-red-700" role="alert">
                                            {error}
                                        </p>
                                    ) : null}

                                    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => !busy && onClose()}
                                            className="font-geist rounded-full border border-ink-text/15 px-5 py-3 text-[15px] font-500 text-ink-text transition hover:bg-black/5"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={busy}
                                            className="font-geist rounded-full bg-wine-700 px-5 py-3 text-[15px] font-500 text-white transition hover:bg-wine-600 disabled:opacity-60"
                                        >
                                            {busy ? 'Sending…' : 'Send message'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {sent ? (
                                <div className="mt-5 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="font-geist rounded-full bg-wine-700 px-5 py-3 text-[15px] font-500 text-white transition hover:bg-wine-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
