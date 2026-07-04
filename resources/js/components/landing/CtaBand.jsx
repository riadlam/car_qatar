import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { fadeUp, IMG, stagger } from './motion';

export default function CtaBand() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

    return (
        <section
            ref={ref}
            className="relative flex min-h-[60svh] items-center overflow-hidden py-16 sm:min-h-[70vh] sm:py-20"
        >
            <motion.img
                style={{ y }}
                src={IMG.cta}
                alt="Luxury car on the open road"
                className="absolute inset-0 h-[130%] w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-wine-950/90 via-ink/75 to-ink/50 sm:bg-gradient-to-r sm:from-wine-950/90 sm:via-ink/70 sm:to-ink/40" />
            <div className="lux-grain absolute inset-0" />

            <motion.div
                variants={stagger(0, 0.14)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-100px' }}
                className="relative mx-auto w-full max-w-7xl px-4 sm:px-6"
            >
                <motion.p
                    variants={fadeUp}
                    className="mb-4 font-sans text-[10px] font-500 tracking-[0.3em] text-gold-400 uppercase sm:mb-6 sm:text-[11px] sm:tracking-[0.4em]"
                >
                    Book your Qatar transfer
                </motion.p>
                <motion.h2
                    variants={fadeUp}
                    className="max-w-2xl font-display text-3xl leading-[1.1] font-700 text-ivory sm:text-5xl lg:text-6xl"
                >
                    Hotel or airport — <span className="gold-text italic font-serif-lux">we’ll be there.</span>
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    className="mt-5 max-w-lg font-serif-lux text-lg text-ivory/70 sm:mt-6 sm:text-xl"
                >
                    Reserve your Doha hotel ↔ Hamad Airport transfer in moments. Experience the AL MAJD difference.
                </motion.p>
                <motion.div
                    variants={fadeUp}
                    className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4"
                >
                    <a
                        href="#book"
                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-8 py-4 text-center font-sans text-[12px] font-600 tracking-[0.16em] text-ink uppercase sm:px-9 sm:text-[13px] sm:tracking-[0.18em]"
                    >
                        <span className="relative z-10">Book a transfer</span>
                        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/40 transition-transform duration-700 group-hover:translate-x-[200%]" />
                    </a>
                    <a
                        href="#services"
                        className="rounded-full border border-ivory/25 px-8 py-4 text-center font-sans text-[12px] font-500 tracking-[0.16em] text-ivory uppercase transition hover:border-ivory/60 sm:px-9 sm:text-[13px] sm:tracking-[0.18em]"
                    >
                        Explore services
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
}
