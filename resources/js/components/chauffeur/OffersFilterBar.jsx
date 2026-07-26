import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { formatPayout } from '../../data/chauffeurPortal';

const EASE = [0.22, 1, 0.36, 1];

const CLASS_OPTIONS = [
    { id: 'all', label: 'All' },
    { id: 'business', label: 'Business' },
    { id: 'first', label: 'First' },
];

const SERVICE_OPTIONS = [
    { id: 'all', label: 'Any' },
    { id: 'airport', label: 'Airport' },
    { id: 'city', label: 'City' },
    { id: 'hourly', label: 'Hourly' },
];

const WHEN_OPTIONS = [
    { id: 'all', label: 'Any time' },
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
];

const RADIUS_PRESETS = [10, 25, 50, 100];

function Chip({ selected, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`font-geist relative cursor-pointer rounded-full px-3.5 py-2 text-[13px] font-500 transition-colors duration-200 ${
                selected
                    ? 'bg-wine-700 text-white shadow-[0_6px_16px_rgba(91,5,32,0.22)]'
                    : 'bg-page text-ink-text ring-1 ring-[#e4e1db] hover:ring-wine-700/35'
            }`}
        >
            {children}
        </button>
    );
}

function RangeField({ id, label, valueLabel, min, max, step, value, onChange }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div>
            <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={id} className="font-geist m-0 text-[13px] font-500 text-ink-text">
                    {label}
                </label>
                <span className="font-geist text-[13px] font-600 tabular-nums text-wine-700">{valueLabel}</span>
            </div>
            <div className="relative mt-3 h-8">
                <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-[#ebe8e2]" />
                <div
                    className="pointer-events-none absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-wine-700/80"
                    style={{ width: `${pct}%` }}
                />
                <input
                    id={id}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="chauffeur-range absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
                />
            </div>
        </div>
    );
}

const DEFAULT_FILTERS = {
    classFilter: 'all',
    service: 'all',
    when: 'all',
    minPayout: 0,
    maxPayout: 300,
    radiusKm: 50,
};

export { DEFAULT_FILTERS };

/**
 * Mobile offers filter — bottom sheet with class, service, when, payout, radius.
 */
export default function OffersFilterBar({ open, onClose, filters, onChange, onReset, resultCount }) {
    const set = (patch) => onChange({ ...filters, ...patch });
    const activeCount = [
        filters.classFilter !== 'all',
        filters.service !== 'all',
        filters.when !== 'all',
        filters.minPayout > 0,
        filters.maxPayout < 300,
        filters.radiusKm < 100,
    ].filter(Boolean).length;

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open ? (
                <div className="fixed inset-0 z-[130] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
                    <motion.button
                        type="button"
                        aria-label="Close filters"
                        className="absolute inset-0 cursor-pointer border-0 bg-ink/40 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.42, ease: EASE }}
                        className="absolute inset-x-0 bottom-0 flex max-h-[min(88dvh,720px)] flex-col rounded-t-[28px] bg-white shadow-[0_-16px_48px_rgba(20,6,12,0.18)]"
                    >
                        <div className="flex shrink-0 flex-col items-center pt-3 pb-2">
                            <span className="h-1 w-10 rounded-full bg-[#d8d4cc]" aria-hidden="true" />
                        </div>

                        <div className="flex shrink-0 items-start justify-between gap-3 px-5 pb-3">
                            <div>
                                <p className="font-fragment m-0 text-[22px] text-ink-text">Filters</p>
                                <p className="font-geist mt-0.5 m-0 text-[13px] text-muted">
                                    {activeCount ? `${activeCount} active · ` : ''}
                                    {resultCount} offer{resultCount === 1 ? '' : 's'}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={onReset}
                                    className="font-geist cursor-pointer rounded-full px-3 py-2 text-[13px] font-500 text-wine-700 transition hover:bg-wine-50"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close"
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-page text-ink-text transition hover:bg-[#ebe8e2]"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path
                                            d="M7 7l10 10M17 7 7 17"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
                            <div className="space-y-6">
                                <div>
                                    <p className="font-geist m-0 mb-2.5 text-[12px] font-500 tracking-wide text-muted uppercase">
                                        Vehicle class
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {CLASS_OPTIONS.map((o) => (
                                            <Chip
                                                key={o.id}
                                                selected={filters.classFilter === o.id}
                                                onClick={() => set({ classFilter: o.id })}
                                            >
                                                {o.label}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="font-geist m-0 mb-2.5 text-[12px] font-500 tracking-wide text-muted uppercase">
                                        Service
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {SERVICE_OPTIONS.map((o) => (
                                            <Chip
                                                key={o.id}
                                                selected={filters.service === o.id}
                                                onClick={() => set({ service: o.id })}
                                            >
                                                {o.label}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="font-geist m-0 mb-2.5 text-[12px] font-500 tracking-wide text-muted uppercase">
                                        When
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {WHEN_OPTIONS.map((o) => (
                                            <Chip
                                                key={o.id}
                                                selected={filters.when === o.id}
                                                onClick={() => set({ when: o.id })}
                                            >
                                                {o.label}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>

                                <RangeField
                                    id="filter-min-payout"
                                    label="Min payout"
                                    valueLabel={formatPayout(filters.minPayout, 'US$')}
                                    min={0}
                                    max={300}
                                    step={5}
                                    value={filters.minPayout}
                                    onChange={(minPayout) =>
                                        set({
                                            minPayout,
                                            maxPayout: Math.max(minPayout, filters.maxPayout),
                                        })
                                    }
                                />

                                <RangeField
                                    id="filter-max-payout"
                                    label="Max payout"
                                    valueLabel={formatPayout(filters.maxPayout, 'US$')}
                                    min={0}
                                    max={300}
                                    step={5}
                                    value={filters.maxPayout}
                                    onChange={(maxPayout) =>
                                        set({
                                            maxPayout,
                                            minPayout: Math.min(maxPayout, filters.minPayout),
                                        })
                                    }
                                />

                                <div>
                                    <div className="flex items-baseline justify-between gap-3">
                                        <p className="font-geist m-0 text-[13px] font-500 text-ink-text">Radius</p>
                                        <span className="font-geist text-[13px] font-600 tabular-nums text-wine-700">
                                            {filters.radiusKm >= 100 ? '100+ km' : `${filters.radiusKm} km`}
                                        </span>
                                    </div>
                                    <div className="mt-2.5 flex flex-wrap gap-2">
                                        {RADIUS_PRESETS.map((km) => (
                                            <Chip
                                                key={km}
                                                selected={filters.radiusKm === km}
                                                onClick={() => set({ radiusKm: km })}
                                            >
                                                {km >= 100 ? '100+ km' : `${km} km`}
                                            </Chip>
                                        ))}
                                    </div>
                                    <div className="relative mt-3 h-8">
                                        <div className="pointer-events-none absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-[#ebe8e2]" />
                                        <div
                                            className="pointer-events-none absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-wine-700/80"
                                            style={{
                                                width: `${((filters.radiusKm - 5) / (100 - 5)) * 100}%`,
                                            }}
                                        />
                                        <input
                                            id="filter-radius"
                                            type="range"
                                            min={5}
                                            max={100}
                                            step={5}
                                            value={filters.radiusKm}
                                            onChange={(e) => set({ radiusKm: Number(e.target.value) })}
                                            className="chauffeur-range absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
                                            aria-label="Search radius in kilometers"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 border-t border-[#f0eee9] bg-white px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="font-geist inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-5 text-[15px] font-500 text-white transition hover:bg-wine-600"
                            >
                                Show {resultCount} offer{resultCount === 1 ? '' : 's'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
}
