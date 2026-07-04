import { motion } from 'motion/react';
import { fadeUp, IMG } from './motion';

const FLEET = [
    {
        name: 'Business Class',
        line: 'Mercedes E-Class · BMW 5 Series',
        seats: '3 guests · 2 bags',
        img: IMG.fleet1,
    },
    {
        name: 'First Class',
        line: 'Mercedes S-Class · Audi A8',
        seats: '3 guests · 2 bags',
        img: IMG.fleet2,
    },
    {
        name: 'Luxury SUV',
        line: 'Cadillac Escalade · Range Rover',
        seats: '5 guests · 5 bags',
        img: IMG.fleet3,
    },
];

export default function Fleet() {
    return (
        <section id="fleet" className="relative bg-ink py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-10 text-center sm:mb-16">
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mb-4 font-sans text-[10px] font-500 tracking-[0.3em] text-gold-400 uppercase sm:mb-5 sm:text-[11px] sm:tracking-[0.4em]"
                    >
                        The fleet
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="font-display text-3xl leading-tight font-600 text-ivory sm:text-4xl lg:text-5xl"
                    >
                        Only the finest <span className="gold-text italic font-serif-lux">machines.</span>
                    </motion.h2>
                </div>

                <motion.div
                    variants={{ show: { transition: { staggerChildren: 0.15 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {FLEET.map((car) => (
                        <motion.div
                            key={car.name}
                            variants={fadeUp}
                            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-ink-soft md:last:col-span-2 lg:last:col-span-1"
                        >
                            <div className="relative h-52 overflow-hidden sm:h-64">
                                <img
                                    src={car.img}
                                    alt={car.name}
                                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-transparent to-transparent" />
                            </div>
                            <div className="p-5 sm:p-7">
                                <h3 className="font-display text-xl font-500 text-ivory sm:text-2xl">{car.name}</h3>
                                <p className="mt-2 font-sans text-sm text-ivory/55">{car.line}</p>
                                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-5">
                                    <span className="font-sans text-[11px] tracking-[0.12em] text-ivory/45 uppercase sm:text-xs sm:tracking-[0.14em]">
                                        {car.seats}
                                    </span>
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-gold-400 transition-all duration-300 group-hover:bg-gold-500 group-hover:text-ink">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
