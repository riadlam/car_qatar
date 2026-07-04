import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { IMG, revealChar, stagger } from './motion';
import BookingWidget from './BookingWidget';

const HEADLINE = ['Hotel.', 'Airport.', 'Qatar.'];

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
    const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
    const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    return (
        <section
            id="top"
            ref={ref}
            className="relative min-h-[100svh] w-full overflow-hidden"
        >
            <motion.div style={{ y: bgY }} className="absolute inset-0 -z-20">
                <img
                    src={IMG.hero}
                    alt="Luxury chauffeur car at night"
                    className="h-[115%] w-full animate-kenburns object-cover object-[center_30%] sm:object-center"
                />
            </motion.div>

            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/60 to-ink" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/55 to-ink/20 sm:to-transparent" />
            <div className="lux-grain absolute inset-0 -z-10" />

            <motion.div
                style={{ y: contentY, opacity: fade }}
                className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pt-32 lg:pb-20 xl:gap-12"
            >
                <div className="w-full max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mb-5 flex items-center gap-3 sm:mb-7 sm:gap-4"
                    >
                        <span className="h-px w-8 shrink-0 bg-gold-500 sm:w-12" />
                        <span className="font-sans text-[10px] font-500 tracking-[0.22em] text-gold-400 uppercase sm:text-[11px] sm:tracking-[0.4em]">
                            AL MAJD · Qatar · Hotel ↔ Airport
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={stagger(0.5, 0.14)}
                        initial="hidden"
                        animate="show"
                        className="font-display text-[2.35rem] leading-[1.05] font-700 text-ivory sm:text-5xl md:text-6xl lg:text-7xl"
                        style={{ perspective: 800 }}
                    >
                        {HEADLINE.map((word, i) => (
                            <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-1 sm:mr-[0.28em] sm:pb-2">
                                <motion.span
                                    variants={revealChar}
                                    className={`inline-block ${i === 2 ? 'gold-text italic font-serif-lux' : ''}`}
                                >
                                    {word}
                                </motion.span>
                            </span>
                        ))}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
                        className="mt-5 max-w-md font-serif-lux text-lg leading-relaxed text-ivory/75 sm:mt-7 sm:text-xl"
                    >
                        Private chauffeur transfers between Doha hotels and Hamad International Airport.
                        Punctual, discreet, and built for guests who expect more than a ride.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.25 }}
                        className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9 sm:gap-6"
                    >
                        <a
                            href="#services"
                            className="group flex items-center gap-3 font-sans text-[12px] font-500 tracking-[0.16em] text-ivory/80 uppercase transition hover:text-ivory sm:text-[13px] sm:tracking-[0.2em]"
                        >
                            Discover the experience
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/50 transition-all duration-300 group-hover:border-gold-400 group-hover:bg-gold-500/10">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>
                    </motion.div>
                </div>

                <div id="book" className="mt-10 w-full max-w-md self-stretch sm:mt-12 lg:mt-0 lg:self-center lg:shrink-0">
                    <BookingWidget />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
            >
                <span className="font-sans text-[10px] tracking-[0.3em] text-ivory/40 uppercase">
                    Scroll
                </span>
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
