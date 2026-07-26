import { useMemo, useState } from 'react';
import {
    CHAUFFEUR_TODAY,
    formatPayout,
    sumPayouts,
} from '../../data/chauffeurPortal';

function StatusDot({ tone = 'wine' }) {
    const color =
        tone === 'green'
            ? 'bg-emerald-600'
            : tone === 'muted'
              ? 'bg-[#9a9a9a]'
              : tone === 'red'
                ? 'bg-red-500'
                : 'bg-wine-700';
    return <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${color}`} aria-hidden="true" />;
}

const HISTORY_PERIODS = [
    { id: 'all', label: 'All time' },
    { id: 'week', label: 'This week' },
    { id: 'month', label: 'This month' },
];

const HISTORY_STATUS = [
    { id: 'all', label: 'All' },
    { id: 'past', label: 'Completed' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'canceled', label: 'Canceled' },
];

const HISTORY_MODES = [
    { id: 'all', label: 'All services' },
    { id: 'airport', label: 'Airport' },
    { id: 'city', label: 'City' },
    { id: 'hourly', label: 'Hourly' },
];

function daysBetween(aIso, bIso) {
    const a = new Date(`${aIso}T12:00:00`);
    const b = new Date(`${bIso}T12:00:00`);
    return Math.round((b - a) / 86400000);
}

function inPeriod(rideDate, period, today = CHAUFFEUR_TODAY) {
    if (period === 'all' || !rideDate) return true;
    const diff = daysBetween(rideDate, today);
    // diff > 0 ⇒ ride is in the past; diff < 0 ⇒ upcoming
    if (period === 'week') return diff <= 7 && diff >= -7;
    if (period === 'month') return diff <= 31 && diff >= -7;
    return true;
}

function FilterChip({ selected, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`font-geist cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-500 transition ${
                selected
                    ? 'bg-wine-700 text-white'
                    : 'bg-white text-ink-text ring-1 ring-[#e0ddd6] hover:ring-wine-700/40'
            }`}
        >
            {children}
        </button>
    );
}

export function ChauffeurOfferCard({ offer, onAccept, onDecline }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#e8e6e1] bg-white transition hover:border-wine-700/35 hover:shadow-[0_12px_40px_rgba(91,5,32,0.08)]">
            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-wine-50 px-2.5 py-1 text-[12px] font-500 text-wine-700">
                                <StatusDot />
                                {offer.status_label}
                            </span>
                            <span className="font-geist text-[12px] font-500 tracking-[0.04em] text-muted uppercase">
                                {offer.mode_label}
                            </span>
                            {offer.expires_in ? (
                                <span className="font-geist text-[12px] font-500 text-muted">
                                    Expires in {offer.expires_in}
                                </span>
                            ) : null}
                        </div>
                        <p className="font-geist mt-2 m-0 text-[15px] font-500 text-ink-text sm:text-[16px]">
                            {offer.date_label}
                            <span className="mx-1.5 text-muted">·</span>
                            <span className="text-wine-700">{offer.time_label}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                            Payout
                        </p>
                        <p className="font-geist m-0 text-[20px] font-600 tracking-[-0.02em] text-ink-text">
                            {formatPayout(offer.payout, offer.currency)}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-0">
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center pt-0.5">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-wine-700 text-[10px] font-700 text-wine-700">
                                A
                            </span>
                            <span className="my-1 w-px min-h-[16px] flex-1 bg-wine-700/30" />
                        </div>
                        <div className="min-w-0 pb-3">
                            <p className="font-geist m-0 text-[12px] text-muted">{offer.time_label}</p>
                            <p className="font-geist mt-0.5 m-0 text-[15px] font-500 text-ink-text">{offer.pickup}</p>
                            {offer.flight ? (
                                <p className="font-geist mt-1 m-0 text-[13px] text-wine-700">{offer.flight}</p>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-wine-700 text-[10px] font-700 text-white">
                            B
                        </span>
                        <div className="min-w-0">
                            <p className="font-geist m-0 text-[12px] text-muted">
                                {offer.duration_label}
                                {offer.distance_label ? ` · ${offer.distance_label}` : ''}
                            </p>
                            <p className="font-geist mt-0.5 m-0 text-[15px] font-500 text-ink-text">{offer.dropoff}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0eee9] pt-4 text-[13px]">
                    <span className="font-geist text-muted">
                        Class <span className="font-500 text-ink-text">{offer.vehicle_class}</span>
                    </span>
                    <span className="font-geist text-muted">
                        Passenger <span className="font-500 text-ink-text">{offer.passenger_name}</span>
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onAccept?.(offer)}
                        className="font-geist cursor-pointer rounded-full bg-wine-700 px-4 py-2.5 text-[13px] font-500 text-white transition hover:bg-wine-600"
                    >
                        Accept offer
                    </button>
                    <button
                        type="button"
                        onClick={() => onDecline?.(offer)}
                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2.5 text-[13px] font-500 text-ink-text transition hover:border-wine-700"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </article>
    );
}

export function ChauffeurRideCard({ ride }) {
    const tone =
        ride.phase === 'canceled' || ride.status_label === 'Canceled'
            ? 'red'
            : ride.status === 'past'
              ? 'green'
              : ride.status_label === 'Accepted'
                ? 'wine'
                : 'muted';

    return (
        <article className="overflow-hidden rounded-2xl border border-[#e8e6e1] bg-white transition hover:border-wine-700/35 hover:shadow-[0_12px_40px_rgba(91,5,32,0.08)]">
            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-page px-2.5 py-1 text-[12px] font-500 text-ink-text">
                                <StatusDot tone={tone} />
                                {ride.status_label}
                            </span>
                            <span className="font-geist text-[12px] font-500 tracking-[0.04em] text-muted uppercase">
                                {ride.mode_label}
                            </span>
                        </div>
                        <p className="font-geist mt-2 m-0 text-[15px] font-500 text-ink-text">
                            {ride.date_label}
                            <span className="mx-1.5 text-muted">·</span>
                            <span className="text-wine-700">{ride.time_label}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-geist m-0 text-[18px] font-600 text-ink-text">
                            {formatPayout(ride.payout, ride.currency)}
                        </p>
                        <p className="font-geist m-0 text-[12px] text-muted">{ride.booking_number}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="font-geist m-0 text-[15px] font-500 text-ink-text">
                        {ride.pickup}
                        <span className="mx-1.5 text-muted">→</span>
                        {ride.dropoff}
                    </p>
                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                        {[ride.duration_label, ride.vehicle_class, ride.passenger_name]
                            .filter(Boolean)
                            .join(' · ')}
                    </p>
                </div>

                {ride.rating ? (
                    <p className="font-geist mt-3 m-0 text-[13px] text-muted">
                        Passenger rating · <span className="font-500 text-wine-700">★ {ride.rating}</span>
                    </p>
                ) : null}
            </div>
        </article>
    );
}

function HistoryRow({ ride }) {
    const isCanceled = ride.phase === 'canceled' || ride.status_label === 'Canceled';
    const tone = isCanceled ? 'red' : ride.status === 'past' ? 'green' : 'wine';

    return (
        <li className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#f0eee9] px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:px-5">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-page px-2 py-0.5 text-[11px] font-500 text-ink-text">
                        <StatusDot tone={tone} />
                        {ride.status_label}
                    </span>
                    <span className="font-geist text-[11px] font-500 tracking-[0.04em] text-muted uppercase">
                        {ride.mode_label}
                    </span>
                </div>
                <p className="font-geist mt-1.5 m-0 truncate text-[14px] font-500 text-ink-text sm:text-[15px]">
                    {ride.pickup}
                    <span className="mx-1 text-muted">→</span>
                    {ride.dropoff}
                </p>
                <p className="font-geist mt-0.5 m-0 text-[12px] text-muted sm:hidden">
                    {ride.date_label} · {ride.time_label}
                </p>
            </div>

            <div className="hidden min-w-0 sm:block">
                <p className="font-geist m-0 text-[14px] text-ink-text">
                    {ride.date_label}
                    <span className="mx-1.5 text-muted">·</span>
                    <span className="text-wine-700">{ride.time_label}</span>
                </p>
                <p className="font-geist mt-0.5 m-0 truncate text-[12px] text-muted">
                    {[ride.passenger_name, ride.booking_number].filter(Boolean).join(' · ')}
                </p>
            </div>

            <div className="text-right">
                <p
                    className={`font-geist m-0 text-[16px] font-600 tabular-nums tracking-[-0.02em] sm:text-[18px] ${
                        isCanceled ? 'text-muted line-through' : 'text-ink-text'
                    }`}
                >
                    {formatPayout(ride.payout, ride.currency)}
                </p>
                {ride.rating ? (
                    <p className="font-geist mt-0.5 m-0 text-[12px] text-muted">★ {ride.rating}</p>
                ) : (
                    <p className="font-geist mt-0.5 m-0 text-[11px] text-muted sm:hidden">{ride.booking_number}</p>
                )}
            </div>
        </li>
    );
}

/**
 * Profile ride history — payouts + period / status / service filters.
 */
export function RideHistorySection({ rides, currency = 'US$' }) {
    const [period, setPeriod] = useState('month');
    const [status, setStatus] = useState('all');
    const [mode, setMode] = useState('all');
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rides
            .filter((r) => inPeriod(r.date, period))
            .filter((r) => {
                if (status === 'all') return true;
                if (status === 'canceled') return r.phase === 'canceled' || r.status_label === 'Canceled';
                if (status === 'past') return r.status === 'past' && r.phase !== 'canceled';
                if (status === 'upcoming') return r.status === 'upcoming';
                return true;
            })
            .filter((r) => (mode === 'all' ? true : r.mode === mode))
            .filter((r) => {
                if (!q) return true;
                return [r.pickup, r.dropoff, r.booking_number, r.passenger_name, r.mode_label]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(q);
            })
            .slice()
            .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    }, [rides, period, status, mode, query]);

    const paidRides = filtered.filter((r) => r.phase !== 'canceled' && r.status_label !== 'Canceled');
    const total = sumPayouts(paidRides);
    const avg = paidRides.length ? total / paidRides.length : 0;

    return (
        <section className="rounded-2xl border border-[#e8e6e1] bg-white">
            <div className="border-b border-[#f0eee9] px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h3 className="font-fragment m-0 text-[22px] font-400 text-ink-text sm:text-[26px]">
                            Ride history
                        </h3>
                        <p className="font-geist mt-1 m-0 text-[14px] text-muted">
                            Payouts for each ride — filter by period, status, or service.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="rounded-xl bg-page px-3 py-2.5 sm:px-4">
                            <p className="font-geist m-0 text-[11px] font-500 tracking-wide text-muted uppercase">
                                Total
                            </p>
                            <p className="font-geist mt-0.5 m-0 text-[16px] font-600 tabular-nums text-ink-text sm:text-[18px]">
                                {formatPayout(total, currency)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-page px-3 py-2.5 sm:px-4">
                            <p className="font-geist m-0 text-[11px] font-500 tracking-wide text-muted uppercase">
                                Rides
                            </p>
                            <p className="font-geist mt-0.5 m-0 text-[16px] font-600 tabular-nums text-ink-text sm:text-[18px]">
                                {filtered.length}
                            </p>
                        </div>
                        <div className="rounded-xl bg-page px-3 py-2.5 sm:px-4">
                            <p className="font-geist m-0 text-[11px] font-500 tracking-wide text-muted uppercase">
                                Avg
                            </p>
                            <p className="font-geist mt-0.5 m-0 text-[16px] font-600 tabular-nums text-ink-text sm:text-[18px]">
                                {formatPayout(avg, currency)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Period">
                        {HISTORY_PERIODS.map((p) => (
                            <FilterChip key={p.id} selected={period === p.id} onClick={() => setPeriod(p.id)}>
                                {p.label}
                            </FilterChip>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Status">
                        {HISTORY_STATUS.map((s) => (
                            <FilterChip key={s.id} selected={status === s.id} onClick={() => setStatus(s.id)}>
                                {s.label}
                            </FilterChip>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Service">
                            {HISTORY_MODES.map((m) => (
                                <FilterChip key={m.id} selected={mode === m.id} onClick={() => setMode(m.id)}>
                                    {m.label}
                                </FilterChip>
                            ))}
                        </div>
                        <label className="relative block w-full sm:max-w-[280px]">
                            <span className="sr-only">Search history</span>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value.slice(0, 120))}
                                placeholder="Search booking or place"
                                className="font-geist w-full rounded-full border border-[#d8d8dc] bg-white py-2.5 pr-4 pl-4 text-[14px] text-ink-text outline-none transition placeholder:text-muted focus:border-wine-700"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="px-4 py-14 text-center sm:px-6">
                    <p className="font-fragment m-0 text-[18px] text-ink-text">No rides match</p>
                    <p className="font-geist mt-1 m-0 text-[14px] text-muted">
                        Try another period, status, or search.
                    </p>
                </div>
            ) : (
                <ul className="m-0 list-none p-0">{filtered.map((ride) => <HistoryRow key={ride.id} ride={ride} />)}</ul>
            )}
        </section>
    );
}
