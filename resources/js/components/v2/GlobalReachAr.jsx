import { motion } from 'motion/react';
import { fadeUp, stagger } from './data';
import Ornament from './Ornament';

const LINE = 'من فندقك في الدوحة إلى مطار حمد الدولي — وبالعكس — نكون هناك في الموعد تمامًا.';

export default function GlobalReachAr() {
    return (
        <section className="relative overflow-hidden bg-ink py-16 text-center sm:py-28 lg:py-40">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                    className="mb-6 font-ar-kufi text-sm tracking-[0.15em] text-gold-400"
                >
                    خدمة قطر فقط
                </motion.p>

                <motion.h2
                    variants={stagger(0, 0.05)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                    className="font-ar-display text-3xl leading-[1.6] text-ivory sm:text-4xl lg:text-5xl"
                >
                    {LINE.split(' ').map((w, i) => (
                        <motion.span key={i} variants={fadeUp} className="ml-[0.25em] inline-block">
                            {w}
                        </motion.span>
                    ))}
                </motion.h2>

                <Ornament className="mt-10" />
            </div>
        </section>
    );
}
