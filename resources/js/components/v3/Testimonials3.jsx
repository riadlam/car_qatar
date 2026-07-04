import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TESTIMONIALS } from './data';

export default function Testimonials3() {
    const [i, setI] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 6000);
        return () => clearInterval(t);
    }, []);

    const t = TESTIMONIALS[i];

    return (
        <section className="relative bg-[#efe6d7] py-16 text-[#14060c] sm:py-24 lg:py-32">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-8">
                <span className="font-grotesk text-[11px] font-500 tracking-[0.3em] text-[#5b0520] uppercase">
                    In their words
                </span>

                <div className="relative mt-8 min-h-[220px] sm:min-h-[200px]">
                    <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-editorial text-[8rem] leading-none text-[#5b0520]/10 sm:text-[10rem]">
                        &ldquo;
                    </span>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="relative"
                        >
                            <p className="font-editorial text-2xl leading-[1.4] text-[#14060c] italic sm:text-3xl lg:text-4xl">
                                {t.quote}
                            </p>
                            <div className="mt-8">
                                <p className="font-grotesk text-sm font-600 tracking-[0.1em] text-[#14060c] uppercase">
                                    {t.name}
                                </p>
                                <p className="mt-1 font-grotesk text-xs tracking-[0.14em] text-[#14060c]/45 uppercase">
                                    {t.role}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-10 flex items-center justify-center gap-2">
                    {TESTIMONIALS.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setI(idx)}
                            aria-label={`Testimonial ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === i ? 'w-8 bg-[#5b0520]' : 'w-3 bg-[#14060c]/20 hover:bg-[#14060c]/40'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
