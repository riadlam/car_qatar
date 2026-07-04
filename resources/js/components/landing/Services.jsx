import { motion } from 'motion/react';
import { fadeUp, IMG } from './motion';

const SERVICES = [
    {
        tag: 'Airport to hotel',
        title: 'Land, then lounge.',
        copy: 'Flight-tracked pickup at Hamad International Airport, then a calm ride to your Doha hotel — with complimentary wait time.',
        img: IMG.airport,
    },
    {
        tag: 'Hotel to airport',
        title: 'Lobby to gate, on time.',
        copy: 'Your chauffeur meets you at the hotel, handles luggage, and delivers you to HIA without the rush.',
        img: IMG.hourly,
    },
    {
        tag: 'Meet & greet',
        title: 'Welcomed by name.',
        copy: 'Name-board reception at arrivals and escort to your vehicle — the Qatar arrival you expect.',
        img: IMG.intercity,
    },
    {
        tag: 'Hotel-area hire',
        title: 'Hours between stays.',
        copy: 'Keep a chauffeur on standby across West Bay, The Pearl, Lusail, and beyond — between check-in and your flight.',
        img: IMG.events,
    },
];

function Card({ service, index }) {
    const wide = index === 0 || index === 3;
    return (
        <motion.article
            variants={fadeUp}
            className={`group relative overflow-hidden rounded-2xl border border-white/5 ${
                wide ? 'lg:col-span-7' : 'lg:col-span-5'
            }`}
        >
            <div className="relative h-[340px] w-full overflow-hidden sm:h-[380px] lg:h-[420px]">
                <img
                    src={service.img}
                    alt={service.tag}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent transition-opacity duration-500 lg:via-ink/40 lg:group-hover:from-wine-950/95" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                <span className="font-sans text-[10px] font-500 tracking-[0.24em] text-gold-400 uppercase sm:text-[11px] sm:tracking-[0.3em]">
                    {service.tag}
                </span>
                <h3 className="mt-2 font-display text-xl font-500 text-ivory sm:mt-3 sm:text-2xl lg:text-3xl">
                    {service.title}
                </h3>
                {/* Always visible on touch/mobile; expand on hover for desktop */}
                <div className="grid grid-rows-[1fr] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
                    <p className="overflow-hidden pt-3 font-sans text-sm leading-relaxed text-ivory/70 transition-colors duration-500 lg:pt-0 lg:text-ivory/0 lg:group-hover:pt-4 lg:group-hover:text-ivory/70">
                        {service.copy}
                    </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 font-sans text-[11px] font-500 tracking-[0.16em] text-ivory/70 uppercase sm:mt-5 sm:text-[12px] sm:tracking-[0.18em]">
                    Learn more
                    <svg
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                    >
                        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
        </motion.article>
    );
}

export default function Services() {
    return (
        <section id="services" className="relative bg-ink py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-16 sm:gap-6 lg:flex-row lg:items-end">
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        <p className="mb-4 font-sans text-[10px] font-500 tracking-[0.3em] text-gold-400 uppercase sm:mb-5 sm:text-[11px] sm:tracking-[0.4em]">
                            Our services
                        </p>
                        <h2 className="max-w-xl font-display text-3xl leading-tight font-600 text-ivory sm:text-4xl lg:text-5xl">
                            Hotel and airport, <span className="gold-text italic font-serif-lux">done properly.</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="max-w-sm font-serif-lux text-base text-ivory/60 sm:text-lg"
                    >
                        Built for Qatar stays — transfers between Doha hotels and Hamad International Airport, held to one standard: impeccable.
                    </motion.p>
                </div>

                <motion.div
                    variants={{ show: { transition: { staggerChildren: 0.15 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12"
                >
                    {SERVICES.map((s, i) => (
                        <Card key={s.tag} service={s} index={i} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
