import { motion } from 'motion/react';
import { fadeUp, FLEET } from './data';
import Ornament from './Ornament';

export default function FleetAr() {
    return (
        <section id="fleet" className="relative bg-ink py-16 text-center sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-10 sm:mb-16">
                    <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-4 font-ar-kufi text-sm tracking-[0.1em] text-gold-400 sm:mb-5">
                        الأسطول
                    </motion.p>
                    <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="font-ar-display text-3xl leading-tight text-ivory sm:text-4xl lg:text-5xl">
                        أرقى المركبات <span className="gold-text">فقط.</span>
                    </motion.h2>
                    <Ornament className="mt-6" />
                </div>

                <motion.div
                    variants={{ show: { transition: { staggerChildren: 0.15 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 gap-4 text-right sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {FLEET.map((car) => (
                        <motion.div
                            key={car.name}
                            variants={fadeUp}
                            className="group relative overflow-hidden rounded-2xl border border-gold-500/10 bg-ink-soft md:last:col-span-2 lg:last:col-span-1"
                        >
                            <div className="relative h-52 overflow-hidden sm:h-64">
                                <img src={car.img} alt={car.name} className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-transparent to-transparent" />
                            </div>
                            <div className="p-5 sm:p-7">
                                <h3 className="font-ar-display text-2xl text-ivory">{car.name}</h3>
                                <p className="mt-2 font-ar-body text-[15px] text-ivory/55">{car.line}</p>
                                <div className="mt-5 flex items-center justify-between gap-3 border-t border-gold-500/10 pt-5">
                                    <span className="font-ar-kufi text-[13px] text-ivory/45">{car.seats}</span>
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-gold-400 transition-all duration-300 group-hover:bg-gold-500 group-hover:text-ink">
                                        <svg className="rotate-180" width="15" height="15" viewBox="0 0 24 24" fill="none">
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
