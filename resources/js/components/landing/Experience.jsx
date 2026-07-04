import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { fadeUp, IMG, stagger } from './motion';

const DETAILS = [
    {
        n: '01',
        title: 'Hotel lobby or arrivals',
        copy: 'Met at the lobby or at Hamad arrivals. The door is opened, luggage is handled — before you ask.',
    },
    {
        n: '02',
        title: 'Flight-aware timing',
        copy: 'We track your flight into HIA and adjust for delays, with complimentary wait time built in.',
    },
    {
        n: '03',
        title: 'Calm between destinations',
        copy: 'A quiet cabin, chargers, and refreshments — hotel to airport, or airport to hotel, without stress.',
    },
];

const scaleWrap = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
};

export default function Experience() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

    return (
        <section id="experience" ref={ref} className="relative overflow-hidden bg-ink-soft py-16 sm:py-24 lg:py-32">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:gap-14 sm:px-6 lg:grid-cols-2 lg:gap-20">
                <motion.div
                    variants={scaleWrap}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="relative order-2 h-[320px] overflow-hidden rounded-2xl sm:h-[420px] lg:order-1 lg:h-[600px]"
                >
                    <motion.img
                        style={{ y: imgY }}
                        src={IMG.interior}
                        alt="Refined car interior"
                        className="absolute inset-0 h-[125%] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-wine-950/60 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-ink/40 p-4 backdrop-blur-md sm:inset-x-8 sm:bottom-8 sm:p-6">
                        <p className="font-serif-lux text-lg italic text-ivory/90 sm:text-xl">
                            “Step in. Breathe out.”
                        </p>
                        <p className="mt-2 font-sans text-[10px] tracking-[0.16em] text-gold-400 uppercase sm:text-xs sm:tracking-[0.2em]">
                            The AL MAJD standard
                        </p>
                    </div>
                </motion.div>

                <div className="order-1 lg:order-2">
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mb-4 font-sans text-[10px] font-500 tracking-[0.3em] text-gold-400 uppercase sm:mb-5 sm:text-[11px] sm:tracking-[0.4em]"
                    >
                        The experience
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="font-display text-3xl leading-tight font-600 text-ivory sm:text-4xl lg:text-5xl"
                    >
                        Every detail, a <span className="gold-text italic font-serif-lux">quiet luxury.</span>
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mt-5 max-w-md font-serif-lux text-base text-ivory/60 sm:mt-6 sm:text-lg"
                    >
                        Thoughtful details and discreet service turn every hotel–airport transfer into a calm, private moment.
                    </motion.p>

                    <motion.ul
                        variants={stagger(0.1, 0.15)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        className="mt-8 space-y-6 sm:mt-10 sm:space-y-8"
                    >
                        {DETAILS.map((d) => (
                            <motion.li key={d.n} variants={fadeUp} className="group flex gap-4 sm:gap-6">
                                <span className="shrink-0 font-display text-base font-500 text-gold-500/70 transition-colors group-hover:text-gold-400 sm:text-lg">
                                    {d.n}
                                </span>
                                <div className="min-w-0 flex-1 border-b border-white/8 pb-5 sm:pb-6">
                                    <h3 className="font-display text-lg font-500 text-ivory sm:text-xl">{d.title}</h3>
                                    <p className="mt-2 font-sans text-sm leading-relaxed text-ivory/55">
                                        {d.copy}
                                    </p>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </div>
        </section>
    );
}
