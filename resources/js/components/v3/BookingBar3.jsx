import { useState } from 'react';
import { motion } from 'motion/react';

const TABS = [
    { id: 'airport_hotel', label: 'Airport → Hotel' },
    { id: 'hotel_airport', label: 'Hotel → Airport' },
];

function Cell({ label, children, className = '' }) {
    return (
        <label className={`flex min-w-0 flex-col gap-1.5 px-4 py-4 sm:px-5 ${className}`}>
            <span className="font-grotesk text-[10px] font-600 tracking-[0.18em] text-[#14060c]/40 uppercase">
                {label}
            </span>
            {children}
        </label>
    );
}

const inputCls =
    'w-full min-w-0 border-0 bg-transparent font-grotesk text-[15px] text-[#14060c] placeholder:text-[#14060c]/35 focus:outline-none focus:ring-0 sm:text-sm';

export default function BookingBar3() {
    const [tab, setTab] = useState('airport_hotel');

    return (
        <motion.div
            id="book"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            className="w-full scroll-mt-28"
        >
            <div className="mb-[-1px] flex w-full overflow-hidden rounded-t-2xl border border-b-0 border-[#14060c]/10 bg-white sm:w-fit">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`relative flex-1 px-5 py-3.5 font-grotesk text-[13px] font-500 transition-colors sm:flex-none sm:px-7 ${
                            tab === t.id ? 'text-[#14060c]' : 'text-[#14060c]/40 hover:text-[#14060c]/70'
                        }`}
                    >
                        {t.label}
                        {tab === t.id && (
                            <motion.span
                                layoutId="v3-tab"
                                className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[#5b0520]"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-2xl rounded-tl-none border border-[#14060c]/10 bg-white shadow-[0_28px_70px_-28px_rgba(20,6,12,0.35)]">
                <div className="grid grid-cols-1 divide-y divide-[#14060c]/10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.25fr_0.95fr_0.85fr_auto] lg:divide-x lg:divide-y-0">
                    <Cell label={tab === 'airport_hotel' ? 'Airport' : 'Hotel'}>
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
                    </Cell>
                    <Cell label={tab === 'airport_hotel' ? 'Hotel' : 'Airport'}>
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
                    </Cell>
                    <Cell label="Date">
                        <input type="date" className={`${inputCls} cursor-pointer`} />
                    </Cell>
                    <Cell label="Time">
                        <input type="time" className={`${inputCls} cursor-pointer`} />
                    </Cell>
                    <div className="p-3 sm:col-span-2 lg:col-span-1">
                        <button
                            type="button"
                            className="group relative flex h-full min-h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#5b0520] px-8 font-grotesk text-[13px] font-600 tracking-[0.12em] text-[#f7f2ea] uppercase transition hover:bg-[#741133]"
                        >
                            <span className="relative z-10">Search</span>
                            <svg
                                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
