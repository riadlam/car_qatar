import { useState } from 'react';
import { motion } from 'motion/react';

const TABS = [
    { id: 'airport_hotel', label: 'Airport → Hotel' },
    { id: 'hotel_airport', label: 'Hotel → Airport' },
];

function Field({ icon, label, children }) {
    return (
        <label className="group flex min-w-0 flex-col gap-1.5">
            <span className="font-sans text-[10px] font-500 tracking-[0.18em] text-ink/45 uppercase sm:tracking-[0.22em]">
                {label}
            </span>
            <span className="flex min-w-0 items-center gap-2 border-b border-ink/15 pb-2 transition-colors focus-within:border-wine-700 sm:gap-2.5">
                <span className="shrink-0 text-wine-700/70">{icon}</span>
                <span className="min-w-0 flex-1">{children}</span>
            </span>
        </label>
    );
}

const inputCls =
    'w-full min-w-0 bg-transparent font-sans text-[15px] text-ink placeholder:text-ink/35 focus:outline-none sm:text-sm';

export default function BookingWidget() {
    const [tab, setTab] = useState('airport_hotel');

    return (
        <motion.div
            initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1 }}
            className="relative w-full max-w-md rounded-2xl bg-ivory/95 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md sm:p-2"
        >
            <div className="rounded-xl bg-ivory p-4 sm:p-6 md:p-7">
                <div className="mb-5 flex rounded-full bg-cream/70 p-1 sm:mb-6">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setTab(t.id)}
                            className="relative min-h-11 flex-1 rounded-full px-2 py-2.5 font-sans text-[12px] font-500 tracking-[0.04em] sm:px-4 sm:text-[13px] sm:tracking-[0.08em]"
                        >
                            {tab === t.id && (
                                <motion.span
                                    layoutId="booking-tab"
                                    className="absolute inset-0 rounded-full bg-wine-700"
                                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                                />
                            )}
                            <span
                                className={`relative z-10 transition-colors ${
                                    tab === t.id ? 'text-ivory' : 'text-ink/60'
                                }`}
                            >
                                {t.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="space-y-4 sm:space-y-5">
                    <Field
                        label={tab === 'airport_hotel' ? 'Airport' : 'Hotel'}
                        icon={
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
                                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                            </svg>
                        }
                    >
                        <input
                            key={`from-${tab}`}
                            className={inputCls}
                            placeholder={
                                tab === 'airport_hotel'
                                    ? 'Hamad International Airport'
                                    : 'Your hotel in Doha…'
                            }
                            defaultValue={
                                tab === 'airport_hotel' ? 'Hamad International Airport (HIA)' : ''
                            }
                        />
                    </Field>

                    <Field
                        label={tab === 'airport_hotel' ? 'Hotel' : 'Airport'}
                        icon={
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 21s-6.5-5.6-6.5-10A6.5 6.5 0 0 1 18.5 11c0 4.4-6.5 10-6.5 10z"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                />
                                <circle cx="12" cy="11" r="2.2" fill="currentColor" />
                            </svg>
                        }
                    >
                        <input
                            key={`to-${tab}`}
                            className={inputCls}
                            placeholder={
                                tab === 'airport_hotel'
                                    ? 'Hotel name or area…'
                                    : 'Hamad International Airport'
                            }
                            defaultValue={
                                tab === 'hotel_airport' ? 'Hamad International Airport (HIA)' : ''
                            }
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <Field
                            label="Date"
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
                                    <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            }
                        >
                            <input type="date" className={`${inputCls} cursor-pointer`} />
                        </Field>
                        <Field
                            label="Pickup time"
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                                    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            }
                        >
                            <input type="time" className={`${inputCls} cursor-pointer`} />
                        </Field>
                    </div>
                </div>

                <button
                    type="button"
                    className="group relative mt-6 flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-wine-700 py-3.5 font-sans text-[12px] font-600 tracking-[0.16em] text-ivory uppercase sm:mt-7 sm:py-4 sm:text-[13px] sm:tracking-[0.2em]"
                >
                    <span className="relative z-10">View options</span>
                    <svg
                        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                    >
                        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="absolute inset-0 -z-0 bg-gradient-to-r from-wine-600 to-wine-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
            </div>
        </motion.div>
    );
}
