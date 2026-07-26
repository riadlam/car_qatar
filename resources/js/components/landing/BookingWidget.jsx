import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

const TABS = [
    { id: 'one_way', label: 'One way', value: 'transfer' },
    { id: 'by_hour', label: 'By the hour', value: 'hourly' },
];

const Chevron = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

function Field({ id, label, children, endAdornment }) {
    return (
        <div className="relative flex min-w-0 flex-1 flex-col">
            <label htmlFor={id} className="font-geist mb-1 text-[14px] leading-5 font-400 tracking-[0.15px] text-white/80">
                {label}
            </label>
            <div className="relative flex items-center gap-2 border-b border-white/80 pb-2 transition-[border-color] focus-within:border-b-2 focus-within:border-wine-500">
                {children}
                {endAdornment && <span className="shrink-0 text-white/70">{endAdornment}</span>}
            </div>
        </div>
    );
}

const inputCls =
    'font-geist w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-white outline-none placeholder:text-white/40';

function BookingForm({ tab, stacked = false, onSearch }) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onSearch?.({
                    pickup: String(fd.get('pickup-location') || '').trim(),
                    dropoff: String(fd.get('dropoff-location') || '').trim(),
                    time: String(fd.get('pickup-time') || '17:15'),
                    date: String(fd.get('pickup-date') || ''),
                    duration: String(fd.get('duration') || '2'),
                    tab,
                });
            }}
            className={`flex w-full items-stretch ${
                stacked
                    ? 'flex-col gap-5'
                    : 'flex-col gap-4 lg:min-h-[60px] lg:flex-row lg:items-center lg:gap-0'
            }`}
        >
            <div
                className={`flex min-w-0 ${
                    stacked ? 'flex-col gap-5' : 'flex-col gap-4 sm:flex-row sm:gap-4 lg:w-[496px] lg:max-w-[42%] lg:gap-3'
                }`}
            >
                <Field id={`pickup-location-${stacked ? 'm' : 'd'}`} label="Pickup location">
                    <input
                        id={`pickup-location-${stacked ? 'm' : 'd'}`}
                        name="pickup-location"
                        className={inputCls}
                        placeholder="Address, airport, hotel, ..."
                        autoComplete="off"
                        role="combobox"
                        aria-expanded="false"
                    />
                </Field>

                {tab === 'one_way' ? (
                    <Field id={`dropoff-location-${stacked ? 'm' : 'd'}`} label="Drop-off location">
                        <input
                            id={`dropoff-location-${stacked ? 'm' : 'd'}`}
                            name="dropoff-location"
                            className={inputCls}
                            placeholder="Address, airport, hotel, ..."
                            autoComplete="off"
                            role="combobox"
                            aria-expanded="false"
                        />
                    </Field>
                ) : (
                    <Field id={`duration-${stacked ? 'm' : 'd'}`} label="Duration" endAdornment={Chevron}>
                        <select
                            id={`duration-${stacked ? 'm' : 'd'}`}
                            name="duration"
                            defaultValue="2"
                            className={`${inputCls} cursor-pointer`}
                            aria-label="Hire duration"
                        >
                            <option value="2">2 hours (80 km included)</option>
                            <option value="3">3 hours (100 km included)</option>
                            <option value="4">4 hours (120 km included)</option>
                            <option value="6">6 hours (160 km included)</option>
                            <option value="8">8 hours (200 km included)</option>
                            <option value="12">12 hours (250 km included)</option>
                        </select>
                    </Field>
                )}
            </div>

            {!stacked && (
                <>
                    <hr aria-orientation="vertical" aria-hidden="true" className="mx-4 hidden w-px self-stretch border-0 bg-white/25 lg:block" />
                    <hr aria-hidden="true" className="border-0 border-t border-white/15 lg:hidden" />
                </>
            )}

            <div
                className={`flex min-w-0 ${
                    stacked ? 'flex-col gap-5' : 'flex-col gap-4 sm:flex-row sm:gap-3 lg:w-[439px] lg:max-w-[38%]'
                }`}
            >
                <Field id={`pickup-date-${stacked ? 'm' : 'd'}`} label="Date" endAdornment={Chevron}>
                    <input
                        id={`pickup-date-${stacked ? 'm' : 'd'}`}
                        name="pickup-date"
                        type="date"
                        className={`${inputCls} cursor-pointer [color-scheme:dark]`}
                        aria-label="Select a date"
                        data-cy="date-picker-input"
                        placeholder="Select a date"
                    />
                </Field>
                <Field id={`pickup-time-${stacked ? 'm' : 'd'}`} label="Pickup time" endAdornment={Chevron}>
                    <input
                        id={`pickup-time-${stacked ? 'm' : 'd'}`}
                        name="pickup-time"
                        type="time"
                        defaultValue="17:15"
                        className={`${inputCls} cursor-pointer [color-scheme:dark]`}
                        aria-label="Pickup time"
                    />
                </Field>
            </div>

            {!stacked && (
                <>
                    <hr aria-orientation="vertical" aria-hidden="true" className="mx-4 hidden w-px self-stretch border-0 bg-white/25 lg:block" />
                    <hr aria-hidden="true" className="border-0 border-t border-white/15 lg:hidden" />
                </>
            )}

            <div className={`flex w-full items-center ${stacked ? 'pt-1' : 'lg:w-auto lg:shrink-0 lg:pl-2'}`}>
                <button
                    type="submit"
                    data-cy="search-button"
                    className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] leading-6 font-500 tracking-[0.15px] whitespace-nowrap text-white transition hover:bg-wine-600 lg:min-h-10 lg:min-w-[9.5rem] lg:py-2"
                >
                    View options
                </button>
            </div>
        </form>
    );
}

function InfoCard({ onDark = false }) {
    return (
        <div
            data-anim="hero-info"
            className="mt-6 flex flex-col items-center justify-center px-1 text-center sm:mt-8 lg:hidden"
        >
            <h2
                className={`font-fragment text-[1.125rem] leading-7 font-400 tracking-[0.25px] sm:text-[2rem] sm:leading-10 ${
                    onDark ? 'text-white' : 'text-ink-text'
                }`}
            >
                <span className="block">Set your pickup in over 64 countries.</span>
                <span className="block">We&apos;ll be there on time.</span>
            </h2>
        </div>
    );
}

function TabPills({ tab, setTab, className = '' }) {
    return (
        <div
            role="radiogroup"
            aria-label="Category selection"
            className={`bl-glass-dark relative inline-grid w-full max-w-md grid-cols-2 gap-1 rounded-full border border-white/25 p-1.5 ${className}`}
        >
            {TABS.map((t) => {
                const active = tab === t.id;
                return (
                    <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setTab(t.id)}
                        className={`font-geist rounded-full px-3 py-2.5 text-center text-[15px] leading-5 font-500 tracking-[0.15px] transition ${
                            active ? 'bg-wine-700 text-white shadow-sm' : 'text-white hover:bg-white/10'
                        }`}
                    >
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}

export default function BookingWidget({ variant = 'desktop' }) {
    const [tab, setTab] = useState('one_way');
    const navigate = useNavigate();
    const isMobile = variant === 'mobile';

    const goBooking = ({ pickup, dropoff, time, date, tab, duration }) => {
        const q = new URLSearchParams();
        if (pickup) q.set('pickup', pickup);
        if (dropoff) q.set('dropoff', dropoff);
        if (time) q.set('time', time);
        if (date) q.set('date', date);
        const mode = tab === 'by_hour' ? 'hourly' : 'transfer';
        q.set('mode', mode);
        if (mode === 'hourly' && duration) q.set('duration', duration);
        navigate(`/booking?${q.toString()}`);
    };

    if (isMobile) {
        return (
            <div data-cy="booking-widget" className="mx-auto flex w-full max-w-full flex-col items-center justify-center">
                {/* Sticky glass tabs — same look as screenshot */}
                <div className="sticky top-[72px] z-30 mb-4 flex w-full justify-center py-2">
                    <TabPills tab={tab} setTab={setTab} />
                </div>

                {/* Glass booking card */}
                <div className="bl-glass-dark w-full overflow-hidden rounded-2xl border border-white/20 p-5" role="search">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <BookingForm tab={tab} stacked onSearch={goBooking} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <InfoCard onDark />
            </div>
        );
    }

    return (
        <div data-cy="booking-widget" className="mx-auto flex w-full max-w-full flex-col items-center justify-center">
            <div className="mb-6 flex justify-center">
                <TabPills tab={tab} setTab={setTab} className="w-auto min-w-[280px]" />
            </div>

            <div className="bl-glass-dark w-full max-w-full overflow-hidden rounded-lg border border-white/15 p-6" role="search">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <BookingForm tab={tab} onSearch={goBooking} />
                    </motion.div>
                </AnimatePresence>
            </div>

            <InfoCard onDark />
        </div>
    );
}
