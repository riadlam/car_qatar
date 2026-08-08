import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

const TABS = [
    { id: 'tourist_trip', label: 'Tourist trip', value: 'transfer' },
    { id: 'one_way', label: 'One way', value: 'transfer' },
    { id: 'multi_local', label: 'Multi-local', value: 'transfer' },
    { id: 'multi_destination', label: 'Multi Destination', value: 'transfer' },
    { id: 'by_hour', label: 'By hour', value: 'hourly' },
    { id: 'international_trip', label: 'International trip', value: 'transfer' },
    { id: 'school_chauffeur', label: 'School chauffeur', value: 'transfer' },
];

const HOURLY_TAB = 'by_hour';

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

                {tab === HOURLY_TAB ? (
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
                ) : (
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

function TabPills({ tab, setTab, className = '' }) {
    return (
        <div
            role="radiogroup"
            aria-label="Trip type selection"
            className={`bl-glass-dark relative w-full max-w-full rounded-2xl border border-white/25 p-1.5 ${className}`}
        >
            <div className="-mx-0.5 flex gap-1 overflow-x-auto px-0.5 py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible [&::-webkit-scrollbar]:hidden">
                {TABS.map((t) => {
                    const active = tab === t.id;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setTab(t.id)}
                            className={`font-geist shrink-0 rounded-full px-3 py-2.5 text-center text-[13px] leading-4 font-500 tracking-[0.15px] whitespace-nowrap transition sm:px-3.5 sm:text-[14px] sm:leading-5 lg:px-4 lg:text-[15px] ${
                                active ? 'bg-wine-700 text-white shadow-sm' : 'text-white hover:bg-white/10'
                            }`}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function BookingWidget({ variant = 'desktop' }) {
    const [tab, setTab] = useState('tourist_trip');
    const navigate = useNavigate();
    const isMobile = variant === 'mobile';

    const goBooking = ({ pickup, dropoff, time, date, tab: selectedTab, duration }) => {
        const q = new URLSearchParams();
        if (pickup) q.set('pickup', pickup);
        if (dropoff) q.set('dropoff', dropoff);
        if (time) q.set('time', time);
        if (date) q.set('date', date);
        const mode = selectedTab === HOURLY_TAB ? 'hourly' : 'transfer';
        q.set('mode', mode);
        q.set('service', selectedTab);
        if (mode === 'hourly' && duration) q.set('duration', duration);
        navigate(`/booking?${q.toString()}`);
    };

    if (isMobile) {
        return (
            <div data-cy="booking-widget" className="mx-auto flex w-full max-w-full flex-col items-center justify-center">
                {/* Sticky glass tabs — scrollable on narrow screens */}
                <div className="sticky top-[72px] z-30 mb-4 w-full py-2">
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
            </div>
        );
    }

    return (
        <div data-cy="booking-widget" className="mx-auto flex w-full max-w-full flex-col items-center justify-center">
            <div className="mb-6 w-full max-w-[1120px]">
                <TabPills tab={tab} setTab={setTab} />
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
        </div>
    );
}
