import { useState } from 'react';
import { formatPayout } from '../../data/chauffeurPortal';
import SlideToAccept from './SlideToAccept';

function classPill(vehicleClass = '') {
    if (/first/i.test(vehicleClass)) return 'First';
    if (/business/i.test(vehicleClass)) return 'Business';
    if (/van|suv/i.test(vehicleClass)) return 'Van';
    return vehicleClass.replace(/\s*Class$/i, '') || 'Ride';
}

function PlaneIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-wine-700">
            <path
                d="M10.5 19.5 13 13l6.5-1.2c.7-.1 1.1-.9.7-1.5L13 13 10.5 4.5 8.8 5.8 11 13l-6.2 2.1L3.5 13l-.8 2.8L5.5 17l5 2.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function QuoteIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-muted">
            <path
                d="M9.5 8.5C8 8.5 6.8 9.4 6.3 10.7 5.6 12.4 6.2 14.5 8 15.5c.4.2.5.7.2 1-.7.8-1.7 1.3-2.7 1.5-.4.1-.6.5-.5.9.1.4.5.6.9.5 1.6-.3 3.1-1.1 4.1-2.4 1.4-1.7 1.6-4.1.7-6.2C9.9 9.3 9.7 8.5 9.5 8.5Zm9 0c-1.5 0-2.7.9-3.2 2.2-.7 1.7-.1 3.8 1.7 4.8.4.2.5.7.2 1-.7.8-1.7 1.3-2.7 1.5-.4.1-.6.5-.5.9.1.4.5.6.9.5 1.6-.3 3.1-1.1 4.1-2.4 1.4-1.7 1.6-4.1.7-6.2-.8-1.5-1-2.3-1.2-2.3Z"
                fill="currentColor"
            />
        </svg>
    );
}

function ChevronBtn({ open, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            aria-label={open ? 'Hide details' : 'Show details'}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f0eee9] text-muted transition hover:text-ink-text"
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
            >
                <path
                    d="M9 6.5 14.5 12 9 17.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}

/**
 * Mobile offer card — matches chauffeur app reference (wine brand).
 */
export default function MobileOfferCard({ offer, onAccept }) {
    const [open, setOpen] = useState(false);
    const [accepting, setAccepting] = useState(false);
    const amount = formatPayout(offer.payout, offer.currency);
    const note = offer.notes || '';
    const shortNote = note.length > 88 ? `${note.slice(0, 86)}…` : note;

    const handleAccept = () => {
        if (accepting) return;
        setAccepting(true);
        window.setTimeout(() => onAccept?.(offer), 320);
    };

    return (
        <article
            className={`overflow-hidden rounded-[22px] bg-white shadow-[0_10px_36px_rgba(20,6,12,0.06)] ring-1 ring-black/[0.04] transition duration-300 ${
                accepting ? 'scale-[0.98] opacity-0' : 'opacity-100'
            }`}
        >
            <div className="p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <span className="font-geist inline-flex rounded-full bg-wine-50 px-2.5 py-1 text-[12px] font-500 text-wine-700">
                        {classPill(offer.vehicle_class)}
                    </span>
                    <ChevronBtn open={open} onClick={() => setOpen((v) => !v)} />
                </div>

                <p className="font-geist mt-3 m-0 text-[17px] leading-6 font-600 tracking-[-0.01em] text-ink-text">
                    {offer.date_short || offer.date_label}
                    <span className="mx-1.5 text-muted">·</span>
                    {offer.time_label}
                </p>

                {offer.flight ? (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <PlaneIcon />
                        <span className="font-geist text-[14px] font-500 text-ink-text">{offer.flight}</span>
                        {offer.flight_status ? (
                            <>
                                <span className="text-muted">·</span>
                                <span className="font-geist text-[14px] font-500 text-emerald-600">
                                    {offer.flight_status}
                                </span>
                            </>
                        ) : null}
                    </div>
                ) : (
                    <p className="font-geist mt-3 m-0 text-[13px] font-500 tracking-[0.04em] text-muted uppercase">
                        {offer.mode_label}
                    </p>
                )}

                <div className="mt-4 grid gap-0">
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center pt-1">
                            <span className="h-3 w-3 rounded-full border-[2px] border-wine-700 bg-white" />
                            <span className="my-1 w-px min-h-[18px] flex-1 bg-wine-700/25" />
                        </div>
                        <p className="font-geist m-0 pb-3 text-[15px] font-500 text-ink-text">{offer.pickup_short || offer.pickup}</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-wine-700" />
                        <p className="font-geist m-0 text-[15px] font-500 text-ink-text">
                            {offer.dropoff_short || offer.dropoff}
                        </p>
                    </div>
                </div>

                {note ? (
                    <div className="mt-4 flex gap-2">
                        <QuoteIcon />
                        <p className="font-geist m-0 text-[13px] leading-5 text-muted">
                            {open ? note : shortNote}
                        </p>
                    </div>
                ) : null}

                {open ? (
                    <div className="mt-3 rounded-xl bg-page px-3 py-2.5">
                        <p className="font-geist m-0 text-[12px] text-muted">
                            Passenger{' '}
                            <span className="font-500 text-ink-text">{offer.passenger_name}</span>
                            {offer.duration_label ? ` · ${offer.duration_label}` : ''}
                            {offer.distance_label ? ` · ${offer.distance_label}` : ''}
                        </p>
                    </div>
                ) : null}
            </div>

            <div className="px-4 pb-4 pt-1">
                <SlideToAccept amountLabel={amount} onAccept={handleAccept} disabled={accepting} />
            </div>
        </article>
    );
}
