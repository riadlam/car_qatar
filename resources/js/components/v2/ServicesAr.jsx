import { motion } from 'motion/react';
import { fadeUp, SERVICES } from './data';

function Card({ service, index }) {
    const wide = index === 0 || index === 3;
    return (
        <motion.article
            variants={fadeUp}
            className={`group relative overflow-hidden rounded-2xl border border-gold-500/10 ${
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

            <div className="absolute inset-x-0 bottom-0 p-5 text-right sm:p-7 lg:p-8">
                <span className="font-ar-kufi text-[13px] text-gold-400 sm:text-sm">{service.tag}</span>
                <h3 className="mt-2 font-ar-display text-2xl text-ivory sm:mt-3 sm:text-3xl">{service.title}</h3>
                <div className="grid grid-rows-[1fr] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
                    <p className="overflow-hidden pt-3 font-ar-body text-[15px] leading-loose text-ivory/70 transition-colors duration-500 lg:pt-0 lg:text-ivory/0 lg:group-hover:pt-4 lg:group-hover:text-ivory/70">
                        {service.copy}
                    </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 font-ar-kufi text-[14px] text-ivory/70 sm:mt-5">
                    اعرف المزيد
                    <svg className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
        </motion.article>
    );
}

export default function ServicesAr() {
    return (
        <section id="services" className="relative bg-ink py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 text-right sm:px-6">
                <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-16 sm:gap-6 lg:flex-row-reverse lg:items-end">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
                        <p className="mb-4 font-ar-kufi text-sm tracking-[0.1em] text-gold-400 sm:mb-5">خدماتنا</p>
                        <h2 className="max-w-xl font-ar-display text-3xl leading-tight text-ivory sm:text-4xl lg:text-5xl">
                            فندق ومطار، <span className="gold-text">كما ينبغي.</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="max-w-sm font-ar-body text-lg leading-loose text-ivory/60"
                    >
                        صُمِّمت لضيوف قطر — نقلٌ بين فنادق الدوحة ومطار حمد الدولي، بمعيارٍ واحد: لا تشوبه شائبة.
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
