import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { IMG, rise, stagger } from './data';
import BookingBar3 from './BookingBar3';

export default function Hero3() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
    const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

    return (
        <section
            id="top"
            ref={ref}
            className="relative overflow-hidden bg-[#f7f2ea] pt-28 pb-10 sm:pt-32 sm:pb-14 lg:pt-40 lg:pb-16"
        >
            {/* Background accents — always behind content */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 18% 18%, rgba(91,5,32,0.05), transparent 42%), radial-gradient(circle at 82% 55%, rgba(201,162,75,0.07), transparent 45%)',
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 top-20 -z-10 h-72 w-72 rounded-full bg-[#5b0520]/[0.04] blur-3xl sm:h-96 sm:w-96"
            />

            <div className="relative z-10 mx-auto max-w-[88rem] px-4 sm:px-8">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
                    {/* Copy */}
                    <div className="relative z-10 lg:col-span-6 xl:col-span-7">
                        <motion.div variants={stagger(0.05, 0.1)} initial="hidden" animate="show">
                            <motion.div
                                variants={rise}
                                className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4"
                            >
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#5b0520]/20 bg-white/70 px-3.5 py-1.5 font-grotesk text-[11px] font-500 tracking-[0.22em] text-[#5b0520] uppercase backdrop-blur-sm">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9a24b]" />
                                    Qatar only
                                </span>
                                <span className="font-grotesk text-[11px] font-500 tracking-[0.22em] text-[#14060c]/45 uppercase">
                                    Hotel ↔ Airport
                                </span>
                            </motion.div>

                            <h1 className="font-editorial text-[2.85rem] leading-[0.98] font-500 tracking-tight text-[#14060c] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.2rem]">
                                <motion.span variants={rise} className="block">
                                    Hotel to airport.
                                </motion.span>
                                <motion.span variants={rise} className="block italic text-[#5b0520]">
                                    Airport to hotel.
                                </motion.span>
                                <motion.span
                                    variants={rise}
                                    className="block bg-gradient-to-r from-[#8f1f45] via-[#5b0520] to-[#a9843a] bg-clip-text text-transparent"
                                >
                                    Purely Qatar.
                                </motion.span>
                            </h1>

                            <motion.p
                                variants={rise}
                                className="mt-7 max-w-md font-grotesk text-base leading-relaxed text-[#14060c]/65 sm:mt-8 sm:text-lg"
                            >
                                AL MAJD is Doha’s private chauffeur service for premium transfers between
                                your hotel and Hamad International Airport — punctual, discreet, and effortless.
                            </motion.p>

                            <motion.div
                                variants={rise}
                                className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10"
                            >
                                <a
                                    href="#book"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#5b0520] px-7 py-3.5 font-grotesk text-[13px] font-600 tracking-[0.1em] text-[#f7f2ea] uppercase transition hover:bg-[#741133]"
                                >
                                    Reserve now
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a
                                    href="#services"
                                    className="inline-flex items-center gap-2 font-grotesk text-[13px] font-500 tracking-[0.08em] text-[#14060c]/70 uppercase transition hover:text-[#5b0520]"
                                >
                                    Explore services
                                </a>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Image */}
                    <div className="relative z-10 lg:col-span-6 xl:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, y: 36 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                            className="relative"
                        >
                            <div className="absolute -inset-3 -z-10 rounded-[1.75rem] bg-gradient-to-br from-[#5b0520]/10 via-transparent to-[#c9a24b]/20 blur-sm sm:-inset-4" />
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#14060c]/8 bg-[#efe6d7] shadow-[0_30px_80px_-28px_rgba(20,6,12,0.45)] sm:aspect-[5/4] lg:aspect-[4/5]">
                                <motion.img
                                    style={{ y: imgY, scale: imgScale }}
                                    src={IMG.hero}
                                    alt="Chauffeur opening the door of a luxury car"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#14060c]/55 via-[#14060c]/10 to-transparent" />

                                <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 font-grotesk text-[11px] font-600 tracking-[0.14em] text-[#5b0520] uppercase backdrop-blur-sm">
                                    Hamad Airport
                                </div>

                                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-[#14060c]/45 px-4 py-3 backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:px-5">
                                    <div>
                                        <p className="font-editorial text-lg text-[#f7f2ea] italic sm:text-xl">
                                            Doha hotels
                                        </p>
                                        <p className="mt-0.5 font-grotesk text-[10px] tracking-[0.18em] text-[#f7f2ea]/75 uppercase sm:text-[11px]">
                                            Door to gate, on time
                                        </p>
                                    </div>
                                    <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9a24b]/50 text-[#c9a24b] sm:flex">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Booking bar */}
                <div className="relative z-20 mt-10 sm:mt-12 lg:mt-14">
                    <BookingBar3 />
                </div>
            </div>
        </section>
    );
}
