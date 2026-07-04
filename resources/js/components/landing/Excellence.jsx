import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { fadeUp } from './motion';

function Counter({ to, suffix = '', duration = 2000 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let raf;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * to));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, to, duration]);

    return (
        <span ref={ref} className="font-display text-3xl font-700 text-ivory sm:text-5xl lg:text-6xl">
            {value.toLocaleString()}
            <span className="gold-text">{suffix}</span>
        </span>
    );
}

const STATS = [
    { to: 1, suffix: '', label: 'Country — Qatar' },
    { to: 60, suffix: '+', label: 'Min. free wait time' },
    { to: 24, suffix: '/7', label: 'Doha support' },
    { to: 100, suffix: '%', label: 'Vetted chauffeurs' },
];

const PILLARS = [
    {
        title: 'Hamad International',
        copy: 'Daily expertise in HIA arrivals and departures — flight-tracked and on time.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="1.4" />
            </svg>
        ),
    },
    {
        title: 'Doha hotels',
        copy: 'Lobby pickups across West Bay, The Pearl, Lusail, Msheireb, and the Corniche.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 16v-3l2-5a2 2 0 0 1 2-1.3h8A2 2 0 0 1 18 8l2 5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16h16v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1M6.5 19H5a1 1 0 0 1-1-1v-2M6.5 13h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        title: 'Flight-aware',
        copy: 'We track your flight and adjust for delays — so you never wait alone.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: 'Discreet by design',
        copy: 'Privacy and professionalism for hotel guests and business travellers in Qatar.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 5C6 5 2.5 12 2.5 12S6 19 12 19s9.5-7 9.5-7S18 5 12 5z" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.4" />
            </svg>
        ),
    },
];

export default function Excellence() {
    return (
        <section id="excellence" className="relative bg-ink-soft py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-12 text-center sm:mb-20">
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mb-4 font-sans text-[10px] font-500 tracking-[0.3em] text-gold-400 uppercase sm:mb-5 sm:text-[11px] sm:tracking-[0.4em]"
                    >
                        Why AL MAJD
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="font-display text-3xl leading-tight font-600 text-ivory sm:text-4xl lg:text-5xl"
                    >
                        Built for <span className="gold-text italic font-serif-lux">Qatar stays.</span>
                    </motion.h2>
                </div>

                <div className="mb-12 grid grid-cols-2 gap-6 sm:mb-24 sm:gap-8 lg:grid-cols-4">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="text-center"
                        >
                            <Counter to={s.to} suffix={s.suffix} />
                            <p className="mt-2 font-sans text-[10px] tracking-[0.14em] text-ivory/50 uppercase sm:mt-3 sm:text-xs sm:tracking-[0.2em]">
                                {s.label}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={{ show: { transition: { staggerChildren: 0.12 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {PILLARS.map((p) => (
                        <motion.div
                            key={p.title}
                            variants={fadeUp}
                            className="group bg-ink-soft p-6 transition-colors duration-500 hover:bg-wine-950 sm:p-8"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/40 text-gold-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-gold-500/10 sm:h-12 sm:w-12">
                                {p.icon}
                            </span>
                            <h3 className="mt-5 font-display text-lg font-500 text-ivory sm:mt-6 sm:text-xl">{p.title}</h3>
                            <p className="mt-3 font-sans text-sm leading-relaxed text-ivory/55">{p.copy}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
