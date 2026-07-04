import { motion } from 'motion/react';
import { fadeUp, stagger } from './motion';

export default function GlobalReach() {
    return (
        <section className="relative overflow-hidden bg-ink py-16 sm:py-28 lg:py-40">
            <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                    className="mb-5 font-sans text-[10px] font-500 tracking-[0.3em] text-gold-400 uppercase sm:mb-6 sm:text-[11px] sm:tracking-[0.4em]"
                >
                    Serving Qatar only
                </motion.p>

                <motion.h2
                    variants={stagger(0, 0.02)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                    className="font-display text-2xl leading-[1.3] font-500 text-balance text-ivory sm:text-4xl sm:leading-[1.25] lg:text-5xl"
                >
                    {'From your Doha hotel to Hamad International Airport — and back — we will be there, precisely on time.'
                        .split(' ')
                        .map((w, i) => (
                            <motion.span key={i} variants={fadeUp} className="mr-[0.22em] inline-block sm:mr-[0.25em]">
                                {w}
                            </motion.span>
                        ))}
                </motion.h2>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mx-auto mt-8 h-px w-20 hairline sm:mt-10 sm:w-24"
                />
            </div>
        </section>
    );
}
