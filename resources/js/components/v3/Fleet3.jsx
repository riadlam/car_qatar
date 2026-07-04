import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FLEET, rise } from './data';

export default function Fleet3() {
    const [i, setI] = useState(0);
    const car = FLEET[i];
    const go = (dir) => setI((prev) => (prev + dir + FLEET.length) % FLEET.length);

    return (
        <section id="fleet" className="relative overflow-hidden bg-[#f7f2ea] py-16 text-[#14060c] sm:py-24 lg:py-32">
            <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
                <div className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
                    <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <p className="mb-4 font-grotesk text-[11px] font-500 tracking-[0.3em] text-[#5b0520] uppercase">
                            The fleet
                        </p>
                        <h2 className="font-editorial text-4xl leading-[1.05] font-500 text-[#14060c] sm:text-5xl lg:text-6xl">
                            Chosen with <span className="italic text-[#5b0520]">intent.</span>
                        </h2>
                    </motion.div>

                    <div className="hidden items-center gap-3 sm:flex">
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#14060c]/20 text-[#14060c] transition hover:border-[#5b0520] hover:bg-[#5b0520] hover:text-[#f7f2ea]"
                            aria-label="Previous vehicle"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#14060c]/20 text-[#14060c] transition hover:border-[#5b0520] hover:bg-[#5b0520] hover:text-[#f7f2ea]"
                            aria-label="Next vehicle"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                    <div className="relative lg:col-span-8">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#efe6d7] shadow-[0_24px_60px_-28px_rgba(20,6,12,0.3)]">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={i}
                                    src={car.img}
                                    alt={car.name}
                                    initial={{ opacity: 0, scale: 1.06 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            </AnimatePresence>
                            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 font-grotesk text-[11px] font-600 tracking-[0.1em] text-[#5b0520] uppercase">
                                {String(i + 1).padStart(2, '0')} / {String(FLEET.length).padStart(2, '0')}
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h3 className="font-editorial text-4xl text-[#14060c] sm:text-5xl">{car.name}</h3>
                                <p className="mt-3 font-grotesk text-base text-[#14060c]/55">{car.line}</p>
                                <ul className="mt-7 space-y-3">
                                    {car.specs.map((sp) => (
                                        <li key={sp} className="flex items-center gap-3 border-b border-[#14060c]/10 pb-3 font-grotesk text-sm text-[#14060c]/70">
                                            <span className="text-[#a9843a]">✦</span>
                                            {sp}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-8 flex items-center gap-2">
                            {FLEET.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setI(idx)}
                                    aria-label={`Vehicle ${idx + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === i ? 'w-8 bg-[#5b0520]' : 'w-3 bg-[#14060c]/20 hover:bg-[#14060c]/40'
                                    }`}
                                />
                            ))}
                            <div className="ml-auto flex gap-2 sm:hidden">
                                <button type="button" onClick={() => go(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#14060c]/20" aria-label="Previous">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                                <button type="button" onClick={() => go(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#14060c]/20" aria-label="Next">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
