import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { fadeUp, DETAILS, IMG, stagger } from './data';

const scaleWrap = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
};

export default function ExperienceAr() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

    return (
        <section id="experience" ref={ref} className="relative overflow-hidden bg-ink-soft py-16 text-right sm:py-24 lg:py-32">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:gap-14 sm:px-6 lg:grid-cols-2 lg:gap-20">
                <motion.div
                    variants={scaleWrap}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="relative order-2 h-[320px] overflow-hidden rounded-2xl sm:h-[420px] lg:h-[600px]"
                >
                    <motion.img style={{ y: imgY }} src={IMG.interior} alt="مقصورة فاخرة" className="absolute inset-0 h-[125%] w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-wine-950/60 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 rounded-xl border border-gold-500/15 bg-ink/40 p-4 backdrop-blur-md sm:inset-x-8 sm:bottom-8 sm:p-6">
                        <p className="font-ar-display text-2xl text-ivory/90">«ادخل… واسترخِ.»</p>
                        <p className="mt-2 font-ar-kufi text-[11px] tracking-[0.15em] text-gold-400 sm:text-xs">معيار المجد</p>
                    </div>
                </motion.div>

                <div className="order-1 lg:order-2">
                    <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-4 font-ar-kufi text-sm tracking-[0.1em] text-gold-400 sm:mb-5">
                        التجربة
                    </motion.p>
                    <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="font-ar-display text-3xl leading-tight text-ivory sm:text-4xl lg:text-5xl">
                        كلُّ تفصيلٍ، <span className="gold-text">فخامةٌ هادئة.</span>
                    </motion.h2>
                    <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-5 max-w-md font-ar-body text-lg leading-loose text-ivory/60 sm:mt-6">
                        تفاصيلُ مدروسةٌ وخدمةٌ رزينة تُحوّل كل نقلٍ بين الفندق والمطار إلى لحظة هدوءٍ خاصةٍ بك.
                    </motion.p>

                    <motion.ul variants={stagger(0.1, 0.15)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
                        {DETAILS.map((d) => (
                            <motion.li key={d.n} variants={fadeUp} className="group flex gap-4 sm:gap-6">
                                <span className="shrink-0 font-ar-display text-xl text-gold-500/70 transition-colors group-hover:text-gold-400">
                                    {d.n}
                                </span>
                                <div className="min-w-0 flex-1 border-b border-gold-500/10 pb-5 sm:pb-6">
                                    <h3 className="font-ar-display text-xl text-ivory sm:text-2xl">{d.title}</h3>
                                    <p className="mt-2 font-ar-body text-[15px] leading-loose text-ivory/55">{d.copy}</p>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </div>
        </section>
    );
}
