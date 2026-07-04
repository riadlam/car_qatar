import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { IMG, wordReveal, stagger } from './data';
import BookingWidgetAr from './BookingWidgetAr';
import Particles from './Particles';

const HEADLINE = ['فندق.', 'مطار.', 'قطر.'];
const INTRO_DELAY = 2.7;

export default function HeroAr() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
    const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    return (
        <section id="top" ref={ref} className="relative min-h-[100svh] w-full overflow-hidden">
            <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
                <img
                    src={IMG.hero}
                    alt="سيارة فاخرة بسائق"
                    className="h-[115%] w-full animate-kenburns object-cover object-[center_30%] sm:object-center"
                />
            </motion.div>

            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/60 to-ink" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink via-ink/55 to-ink/20 sm:to-transparent" />
            <div className="radial-vignette absolute inset-0 -z-10" />
            <div className="lux-grain absolute inset-0 -z-10" />
            <Particles />

            {/* Decorative rotating gold ring */}
            <div className="pointer-events-none absolute -left-40 top-1/4 -z-10 hidden lg:block">
                <svg width="520" height="520" viewBox="0 0 520 520" className="animate-spin-slow opacity-[0.07]">
                    <circle cx="260" cy="260" r="258" fill="none" stroke="#c9a24b" strokeWidth="1" strokeDasharray="2 10" />
                    <circle cx="260" cy="260" r="210" fill="none" stroke="#c9a24b" strokeWidth="1" />
                </svg>
            </div>

            <motion.div
                style={{ y: contentY, opacity: fade }}
                className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pt-24 pb-12 text-right sm:px-6 sm:pt-28 sm:pb-16 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-10 lg:pt-32 lg:pb-20 xl:gap-12"
            >
                <div className="w-full max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: INTRO_DELAY }}
                        className="mb-5 flex items-center justify-start gap-3 sm:mb-7 sm:gap-4"
                    >
                        <span className="font-ar-kufi text-[13px] tracking-[0.1em] text-gold-400 sm:text-sm">
                            المجد · قطر · فندق ↔ مطار
                        </span>
                        <span className="h-px w-8 shrink-0 bg-gold-500 sm:w-12" />
                    </motion.div>

                    <motion.h1
                        variants={stagger(INTRO_DELAY + 0.1, 0.16)}
                        initial="hidden"
                        animate="show"
                        className="font-ar-display text-5xl leading-[1.2] text-ivory sm:text-7xl lg:text-8xl"
                    >
                        {HEADLINE.map((word, i) => (
                            <span key={i} className="ml-[0.25em] inline-block overflow-visible pb-2">
                                <motion.span
                                    variants={wordReveal}
                                    className={`inline-block ${i === 2 ? 'gold-text' : ''}`}
                                >
                                    {word}
                                </motion.span>
                            </span>
                        ))}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: INTRO_DELAY + 0.5 }}
                        className="mt-5 max-w-lg font-ar-body text-lg leading-loose text-ivory/75 sm:mt-7 sm:text-xl"
                    >
                        نقلٌ خاصٌّ بسائقٍ محترف بين فنادق الدوحة ومطار حمد الدولي.
                        التزامٌ بالمواعيد، وخصوصيةٌ تامة، وخدمةٌ تليق بنزلاء قطر.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: INTRO_DELAY + 0.7 }}
                        className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9"
                    >
                        <a
                            href="#services"
                            className="group flex items-center gap-3 font-ar-kufi text-[15px] text-ivory/80 transition hover:text-ivory"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/50 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-500/10">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            اكتشف التجربة
                        </a>
                    </motion.div>
                </div>

                <div id="book" className="mt-10 w-full max-w-md self-stretch sm:mt-12 lg:mt-0 lg:self-center lg:shrink-0">
                    <BookingWidgetAr />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: INTRO_DELAY + 1.3, duration: 1 }}
                className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
            >
                <span className="font-ar-kufi text-[11px] tracking-[0.2em] text-ivory/40">مرّر للأسفل</span>
                <span className="relative h-12 w-px overflow-hidden bg-ivory/15">
                    <motion.span
                        animate={{ y: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-x-0 top-0 h-1/2 bg-gold-400"
                    />
                </span>
            </motion.div>
        </section>
    );
}
