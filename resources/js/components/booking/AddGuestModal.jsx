import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { IconChevronDown } from './icons';

const TITLES = ['Mr.', 'Mrs.'];

const fieldClass =
    'font-geist box-border w-full min-w-0 rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

const emptyForm = {
    title: 'Mr.',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
};

/**
 * Add new guest modal — portaled to body so sidebar overflow cannot clip it.
 */
export default function AddGuestModal({ open, onClose, onSave }) {
    const [form, setForm] = useState(emptyForm);
    const [titleOpen, setTitleOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            setForm(emptyForm);
            setTitleOpen(false);
            setError('');
        }
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') return null;

    const submit = (e) => {
        e.preventDefault();
        const first = form.first_name.trim();
        const last = form.last_name.trim();
        const email = form.email.trim();
        if (!first || !last) {
            setError('Please enter the guest’s first and last name.');
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid guest email address.');
            return;
        }
        if (!form.phone || form.phone.replace(/\D/g, '').length < 8) {
            setError('Please enter a valid guest mobile number.');
            return;
        }
        onSave({
            id: `guest_${Date.now()}`,
            title: form.title,
            first_name: first,
            last_name: last,
            email,
            phone: form.phone,
        });
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
            role="presentation"
        >
            <button
                type="button"
                aria-label="Close dialog"
                className="absolute inset-0 cursor-pointer border-0 bg-ink/50"
                onClick={onClose}
            />

            <form
                onSubmit={submit}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-guest-title"
                className="relative z-[1] flex max-h-[min(92dvh,760px)] w-full max-w-[560px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_24px_80px_rgba(15,19,25,0.28)] sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#eef1f3] px-5 py-4 sm:px-8 sm:py-5">
                    <h2
                        id="add-guest-title"
                        className="font-fragment m-0 text-[24px] leading-8 font-400 tracking-[0.25px] text-ink-text sm:text-[28px] sm:leading-9"
                    >
                        Add new guest
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist -mr-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[24px] leading-none text-muted transition hover:bg-page hover:text-ink-text"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6">
                    <p className="font-geist m-0 text-[15px] leading-6 text-ink-text sm:text-[16px]">
                        Enter your guests&apos; information and treat them to a premium service. We will keep them
                        informed of their journey throughout the process. Don&apos;t worry, we will not share any
                        payment or invoice information with them.
                    </p>

                    <div className="mt-6 flex flex-col gap-5">
                        <div className="relative w-full max-w-[200px]">
                            <label htmlFor="guest-title" className="font-geist mb-1.5 block text-[14px] text-muted">
                                Title
                            </label>
                            <button
                                id="guest-title"
                                type="button"
                                role="combobox"
                                aria-expanded={titleOpen}
                                aria-haspopup="listbox"
                                onClick={() => setTitleOpen((v) => !v)}
                                className={`${fieldClass} flex cursor-pointer items-center justify-between text-left`}
                            >
                                <span>{form.title}</span>
                                <span className={`text-ink-text transition ${titleOpen ? 'rotate-180' : ''}`}>
                                    <IconChevronDown />
                                </span>
                            </button>
                            {titleOpen && (
                                <ul
                                    role="listbox"
                                    className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-lg border border-[#e0ddd6] bg-white py-1 shadow-lg"
                                >
                                    {TITLES.map((t) => (
                                        <li key={t} role="option" aria-selected={form.title === t}>
                                            <button
                                                type="button"
                                                className={`font-geist w-full cursor-pointer px-4 py-2.5 text-left text-[15px] hover:bg-wine-50 ${
                                                    form.title === t ? 'bg-wine-50 text-wine-800' : 'text-ink-text'
                                                }`}
                                                onClick={() => {
                                                    setForm({ ...form, title: t });
                                                    setTitleOpen(false);
                                                }}
                                            >
                                                {t}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="min-w-0">
                                <label htmlFor="guest-first" className="font-geist mb-1.5 block text-[14px] text-muted">
                                    First name
                                </label>
                                <input
                                    id="guest-first"
                                    value={form.first_name}
                                    maxLength={30}
                                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                    className={fieldClass}
                                    placeholder="Guest's first name"
                                    autoComplete="given-name"
                                />
                            </div>

                            <div className="min-w-0">
                                <label htmlFor="guest-last" className="font-geist mb-1.5 block text-[14px] text-muted">
                                    Last name
                                </label>
                                <input
                                    id="guest-last"
                                    value={form.last_name}
                                    maxLength={30}
                                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                    className={fieldClass}
                                    placeholder="Guest's last name"
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <label htmlFor="guest-email" className="font-geist mb-1.5 block text-[14px] text-muted">
                                Email address
                            </label>
                            <input
                                id="guest-email"
                                type="email"
                                value={form.email}
                                maxLength={100}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className={fieldClass}
                                placeholder="Guest's email address"
                                autoComplete="email"
                            />
                        </div>

                        <div className="min-w-0">
                            <label htmlFor="guest-phone" className="font-geist mb-1.5 block text-[14px] text-muted">
                                Guest&apos;s mobile number
                            </label>
                            <PhoneInput
                                defaultCountry="dz"
                                value={form.phone}
                                onChange={(phone) => setForm({ ...form, phone })}
                                forceDialCode
                                className="almajd-phone"
                                inputProps={{
                                    id: 'guest-phone',
                                    placeholder: "Guest's mobile number",
                                    autoComplete: 'tel',
                                }}
                            />
                            <p className="font-geist mt-2 m-0 text-[13px] leading-5 text-muted">
                                Your guest will receive their journey notifications and support with this mobile number.
                            </p>
                        </div>
                    </div>

                    {error ? (
                        <p className="font-geist mt-4 m-0 text-[14px] text-wine-600" role="alert">
                            {error}
                        </p>
                    ) : null}
                </div>

                <div className="flex shrink-0 gap-3 border-t border-[#eef1f3] bg-white px-5 py-4 sm:px-8 sm:py-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist flex-1 cursor-pointer rounded-full border border-[#d8d8dc] py-3.5 text-[15px] font-500 text-ink-text hover:bg-page"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="font-geist flex-1 cursor-pointer rounded-full bg-wine-700 py-3.5 text-[15px] font-500 text-white hover:bg-wine-600"
                    >
                        Add guest
                    </button>
                </div>
            </form>
        </div>,
        document.body,
    );
}

export function guestDisplayName(guest) {
    if (!guest) return '';
    return `${guest.title} ${guest.first_name} ${guest.last_name}`.replace(/\s+/g, ' ').trim();
}
