import { motion } from 'motion/react';
import Logo from './Logo';

const COLS = [
    {
        title: 'Services',
        links: ['Airport to hotel', 'Hotel to airport', 'Meet & greet', 'Hotel-area hire'],
    },
    {
        title: 'Areas in Doha',
        links: ['Hamad International', 'West Bay', 'The Pearl', 'Lusail', 'Msheireb'],
    },
    {
        title: 'Contact',
        links: ['concierge@almajd.com', '+974 4000 0000', 'Doha, Qatar'],
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/8 bg-ink pt-14 pb-8 sm:pt-20 sm:pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="sm:col-span-2 lg:col-span-1"
                    >
                        <Logo />
                        <p className="mt-5 max-w-xs font-serif-lux text-base text-ivory/55 sm:mt-6 sm:text-lg">
                            Private chauffeur transfers between Doha hotels and Hamad International Airport.
                        </p>
                        <div className="mt-6 flex gap-3 sm:mt-7">
                            {['in', 'ig', 'x'].map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 font-sans text-xs tracking-wider text-ivory/60 uppercase transition hover:border-gold-500/60 hover:text-gold-400"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {COLS.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-sans text-[11px] font-600 tracking-[0.28em] text-gold-400 uppercase">
                                {col.title}
                            </h4>
                            <ul className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5">
                                {col.links.map((l) => (
                                    <li key={l}>
                                        <a
                                            href="#"
                                            className="font-sans text-sm text-ivory/55 transition-colors hover:text-ivory"
                                        >
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 h-px w-full hairline sm:mt-16" />

                <div className="mt-6 flex flex-col items-center justify-between gap-4 text-center sm:mt-8 sm:flex-row sm:text-left">
                    <p className="font-sans text-[10px] tracking-[0.12em] text-ivory/40 uppercase sm:text-xs sm:tracking-[0.14em]">
                        © {new Date().getFullYear()} AL MAJD · Luxury Car Transport · Qatar
                    </p>
                    <div className="flex flex-wrap justify-center gap-5 sm:gap-7">
                        {['Terms', 'Privacy', 'Legal'].map((l) => (
                            <a
                                key={l}
                                href="#"
                                className="font-sans text-[10px] tracking-[0.12em] text-ivory/40 uppercase transition hover:text-ivory/70 sm:text-xs sm:tracking-[0.14em]"
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute -bottom-10 left-1/2 -z-0 hidden -translate-x-1/2 select-none font-display text-[18vw] font-800 tracking-tighter text-white/[0.015] sm:block sm:-bottom-24 sm:text-[22vw]">
                AL MAJD
            </div>
        </footer>
    );
}
