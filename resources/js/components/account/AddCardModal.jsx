import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

function detectBrand(number) {
    const n = number.replace(/\D/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    if (/^6(?:011|5)/.test(n)) return 'Discover';
    return 'Card';
}

function formatCardNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

/**
 * Professional add-card modal with live card preview (react-credit-cards-2).
 */
export default function AddCardModal({ open, onClose, onSave }) {
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');
    const [error, setError] = useState('');

    const reset = () => {
        setNumber('');
        setName('');
        setExpiry('');
        setCvc('');
        setFocus('');
        setError('');
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const digits = useMemo(() => number.replace(/\D/g, ''), [number]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (digits.length < 13) {
            setError('Enter a valid card number.');
            return;
        }
        if (!name.trim()) {
            setError('Cardholder name is required.');
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            setError('Use expiry format MM/YY.');
            return;
        }
        const [mm, yy] = expiry.split('/').map(Number);
        if (mm < 1 || mm > 12) {
            setError('Enter a valid expiry month.');
            return;
        }
        if (cvc.replace(/\D/g, '').length < 3) {
            setError('Enter a valid CVC.');
            return;
        }

        onSave({
            id: `card_${Date.now()}`,
            brand: detectBrand(digits),
            last4: digits.slice(-4),
            name: name.trim(),
            expiry,
        });
        reset();
        onClose();
    };

    if (!open || typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-end justify-center bg-ink-text/45 p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-card-title"
            onClick={handleClose}
        >
            <div
                className="max-h-[95svh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-[#eef1f3] px-5 py-4 sm:px-6">
                    <h2
                        id="add-card-title"
                        className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-ink-text"
                    >
                        Add payment method
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink-text transition hover:bg-black/5"
                    >
                        <svg width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M6.76 17.24L12 12m5.24-5.24L12 12m0 0L6.76 6.76M12 12l5.24 5.24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className="px-5 pt-6 pb-2 sm:px-6">
                    <div className="flex justify-center [&_.rccs]:mx-auto [&_.rccs]:scale-[0.92] sm:[&_.rccs]:scale-100">
                        <Cards
                            number={number}
                            expiry={expiry}
                            cvc={cvc}
                            name={name || 'YOUR NAME'}
                            focused={focus}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-5 pt-4 pb-6 sm:px-6 sm:pb-8">
                    {error ? (
                        <p className="font-geist m-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[14px] text-rose-700">
                            {error}
                        </p>
                    ) : null}

                    <label className="block">
                        <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                            Card number
                        </span>
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="ACCT-000003"
                            value={number}
                            onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                            onFocus={() => setFocus('number')}
                            className={fieldClass}
                        />
                    </label>

                    <label className="block">
                        <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                            Name on card
                        </span>
                        <input
                            type="text"
                            autoComplete="cc-name"
                            placeholder="Name as shown on card"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setFocus('name')}
                            className={fieldClass}
                        />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Expiry
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                onFocus={() => setFocus('expiry')}
                                className={fieldClass}
                            />
                        </label>
                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                CVC
                            </span>
                            <input
                                type="password"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                placeholder="123"
                                maxLength={4}
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                onFocus={() => setFocus('cvc')}
                                className={fieldClass}
                            />
                        </label>
                    </div>

                    <p className="font-geist m-0 text-[12px] leading-5 text-muted">
                        Your card details are stored only on this device for demo purposes. We never
                        send the full card number to a server yet.
                    </p>

                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] px-6 py-2.5 text-[16px] font-500 text-ink-text transition hover:bg-page"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-6 py-2.5 text-[16px] font-500 text-white transition hover:bg-wine-600"
                        >
                            Save card
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
}
