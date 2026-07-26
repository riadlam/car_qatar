import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingPathFromJourney, formatMoney } from '../../data/journeys';
import ReceiptModal from './ReceiptModal';

function StatusDot({ phase }) {
    const color =
        phase === 'completed'
            ? 'bg-emerald-600'
            : phase === 'cancelled_user' || phase === 'cancelled_schedule' || phase === 'cancelled'
              ? 'bg-[#9a9a9a]'
              : phase === 'chauffeur_assigned' || phase === 'upcoming_soon'
                ? 'bg-wine-700'
                : 'bg-wine-600';
    return <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${color}`} aria-hidden="true" />;
}

function PinA() {
    return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-wine-700 bg-white text-[10px] font-700 text-wine-700">
            A
        </span>
    );
}

function PinB() {
    return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wine-700 text-[10px] font-700 text-white">
            B
        </span>
    );
}

function StarRow({ rating }) {
    if (!rating) return null;
    return (
        <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <svg
                    key={n}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={n <= rating ? 'text-wine-700' : 'text-[#d8d4cc]'}
                >
                    <path
                        fill="currentColor"
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                </svg>
            ))}
        </div>
    );
}

/**
 * Modern ride card — booking-grade info at a glance (Blacklane / Uber Black style).
 */
export default function JourneyCard({ journey: j }) {
    const [receiptOpen, setReceiptOpen] = useState(false);
    const isCanceled = j.status === 'cancelled' || j.status === 'canceled';
    const isPast = j.status === 'past';
    const isUpcoming = j.status === 'upcoming';

    return (
        <article
            className={`group relative overflow-hidden rounded-2xl border bg-white transition ${
                isCanceled
                    ? 'border-[#e8e6e1] opacity-[0.92]'
                    : 'border-[#e8e6e1] hover:border-wine-700/35 hover:shadow-[0_12px_40px_rgba(91,5,32,0.08)]'
            }`}
        >
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_200px]">
                <div className="min-w-0 p-4 sm:p-5 lg:p-6">
                    {/* Top meta */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-page px-2.5 py-1 text-[12px] font-500 text-ink-text">
                                    <StatusDot phase={j.phase || j.status} />
                                    {j.status_label}
                                </span>
                                <span className="font-geist text-[12px] font-500 tracking-[0.04em] text-muted uppercase">
                                    {j.mode_label}
                                </span>
                            </div>
                            <p className="font-geist mt-2 m-0 text-[15px] font-500 text-ink-text sm:text-[16px]">
                                {j.date_label}
                                <span className="mx-1.5 text-muted">·</span>
                                <span className="text-wine-700">{j.time_label}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-geist m-0 text-[18px] font-600 tracking-[-0.02em] text-ink-text">
                                {formatMoney(j.price, j.currency)}
                            </p>
                            <p className="font-geist mt-0.5 m-0 text-[12px] text-muted">{j.payment_label}</p>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="mt-5 grid gap-0">
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center pt-0.5">
                                <PinA />
                                <span className="my-1 w-px flex-1 min-h-[18px] bg-gradient-to-b from-wine-700 to-wine-400/40" />
                            </div>
                            <div className="min-w-0 pb-3">
                                <p className="font-geist m-0 text-[12px] font-500 text-muted">{j.time_label}</p>
                                <p className="font-geist mt-0.5 m-0 text-[15px] font-500 leading-snug text-ink-text sm:text-[16px]">
                                    {j.pickup}
                                </p>
                                {j.flight ? (
                                    <p className="font-geist mt-1 m-0 text-[13px] text-wine-700">{j.flight}</p>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <PinB />
                            </div>
                            <div className="min-w-0">
                                <p className="font-geist m-0 text-[12px] font-500 text-muted">
                                    {j.arrive_label}
                                    {j.duration_label ? (
                                        <span className="text-muted"> · {j.duration_label}</span>
                                    ) : null}
                                </p>
                                <p className="font-geist mt-0.5 m-0 text-[15px] font-500 leading-snug text-ink-text sm:text-[16px]">
                                    {j.dropoff}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Passenger · vehicle · chauffeur */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0eee9] pt-4">
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="font-geist text-[12px] font-500 tracking-wide text-muted uppercase">
                                Passenger
                            </span>
                            <span className="font-geist truncate text-[14px] font-500 text-ink-text">
                                {j.passenger_name}
                                {j.for_guest ? (
                                    <span className="ml-1.5 rounded bg-wine-50 px-1.5 py-0.5 text-[11px] font-500 text-wine-700">
                                        Guest
                                    </span>
                                ) : null}
                            </span>
                        </div>
                        <span className="hidden h-3 w-px bg-[#e8e6e1] sm:block" aria-hidden="true" />
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="font-geist text-[12px] font-500 tracking-wide text-muted uppercase">
                                Class
                            </span>
                            <span className="font-geist truncate text-[14px] font-500 text-ink-text">
                                {j.vehicle}
                            </span>
                        </div>
                        <span className="font-geist ml-auto text-[12px] text-muted">{j.booking_number}</span>
                    </div>

                    {j.chauffeur ? (
                        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-page/80 px-3 py-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wine-700 text-[13px] font-600 text-white">
                                {j.chauffeur.name
                                    .split(' ')
                                    .map((p) => p[0])
                                    .join('')
                                    .slice(0, 2)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-geist m-0 text-[14px] font-500 text-ink-text">
                                    {j.chauffeur.name}
                                    <span className="ml-2 text-[13px] font-400 text-muted">
                                        ★ {j.chauffeur.rating} · {j.chauffeur.trips} trips
                                    </span>
                                </p>
                                <p className="font-geist m-0 text-[12px] text-muted">
                                    {j.chauffeur.vehicle_plate}
                                    {j.chauffeur_eta ? ` · ${j.chauffeur_eta}` : ''}
                                </p>
                            </div>
                        </div>
                    ) : j.chauffeur_eta && isUpcoming ? (
                        <p className="font-geist mt-3 m-0 text-[13px] text-muted">{j.chauffeur_eta}</p>
                    ) : null}

                    {isCanceled && j.cancel_date_label ? (
                        <p className="font-geist mt-3 m-0 rounded-lg bg-[#f5f4f1] px-3 py-2 text-[13px] text-muted">
                            {j.cancel_date_label}
                            {j.cancel_reason ? ` — ${j.cancel_reason}` : ''}
                        </p>
                    ) : null}

                    {isPast && j.rating ? (
                        <div className="mt-3 flex items-center gap-2">
                            <span className="font-geist text-[13px] text-muted">Your rating</span>
                            <StarRow rating={j.rating} />
                        </div>
                    ) : null}

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {(j.actions || ['details']).map((action) => {
                            if (action === 'details') {
                                return (
                                    <Link
                                        key={action}
                                        to={`/journeys/ride/${j.id}`}
                                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] bg-white px-3.5 py-2 text-[13px] font-500 text-ink-text transition hover:border-wine-700 hover:text-wine-700"
                                    >
                                        View details
                                    </Link>
                                );
                            }
                            if (action === 'edit') {
                                return (
                                    <Link
                                        key={action}
                                        to={bookingPathFromJourney(j)}
                                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] bg-white px-3.5 py-2 text-[13px] font-500 text-ink-text transition hover:border-wine-700 hover:text-wine-700"
                                    >
                                        Edit journey
                                    </Link>
                                );
                            }
                            if (action === 'cancel') {
                                return (
                                    <button
                                        key={action}
                                        type="button"
                                        className="font-geist cursor-pointer rounded-full px-3.5 py-2 text-[13px] font-500 text-muted transition hover:text-ink-text"
                                    >
                                        Cancel
                                    </button>
                                );
                            }
                            if (action === 'contact') {
                                const contactTo =
                                    j.actions?.includes('track') || j.phase === 'upcoming_soon'
                                        ? `/journeys/ride/${j.id}/track?contact=1`
                                        : `/journeys/ride/${j.id}?contact=1`;
                                return (
                                    <Link
                                        key={action}
                                        to={contactTo}
                                        className="font-geist cursor-pointer rounded-full bg-wine-700 px-3.5 py-2 text-[13px] font-500 text-white transition hover:bg-wine-600"
                                    >
                                        Contact chauffeur
                                    </Link>
                                );
                            }
                            if (action === 'track') {
                                return (
                                    <Link
                                        key={action}
                                        to={`/journeys/ride/${j.id}/track`}
                                        className="font-geist cursor-pointer rounded-full bg-wine-700 px-3.5 py-2 text-[13px] font-500 text-white transition hover:bg-wine-600"
                                    >
                                        Live tracking
                                    </Link>
                                );
                            }
                            if (action === 'receipt') {
                                return (
                                    <button
                                        key={action}
                                        type="button"
                                        onClick={() => setReceiptOpen(true)}
                                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] bg-white px-3.5 py-2 text-[13px] font-500 text-ink-text transition hover:border-wine-700 hover:text-wine-700"
                                    >
                                        Receipt
                                    </button>
                                );
                            }
                            if (action === 'rebook') {
                                return (
                                    <Link
                                        key={action}
                                        to={bookingPathFromJourney(j)}
                                        className="font-geist cursor-pointer rounded-full bg-wine-700 px-3.5 py-2 text-[13px] font-500 text-white transition hover:bg-wine-600"
                                    >
                                        Book again
                                    </Link>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                {/* Vehicle panel — full-bleed class photo */}
                <div className="relative min-h-[160px] overflow-hidden border-t border-[#f0eee9] bg-[#ebe8e2] lg:min-h-full lg:border-t-0 lg:border-l lg:border-[#f0eee9]">
                    {j.vehicle_image ? (
                        <img
                            src={j.vehicle_image}
                            alt={j.vehicle}
                            className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(165deg,#fbf8f2_0%,#f0e8ea_100%)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <p className="font-geist m-0 text-[15px] font-500 text-white">{j.vehicle}</p>
                        <p className="font-geist mt-0.5 m-0 text-[12px] leading-4 text-white/80">
                            {j.vehicle_similar || 'Premium chauffeur'}
                        </p>
                    </div>
                </div>
            </div>

            <ReceiptModal open={receiptOpen} journey={j} onClose={() => setReceiptOpen(false)} />
        </article>
    );
}
