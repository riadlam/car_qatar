import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { rise, SERVICES } from './data';

export default function Services3() {
    const [active, setActive] = useState(0);

    return (
        <section id="services" className="relative bg-[#f7f2ea] py-16 text-[#14060c] sm:py-24 lg:py-32">
            <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
                <div className="mb-10 grid grid-cols-1 gap-6 sm:mb-16 lg:grid-cols-12 lg:items-end">
                    <motion.div
                        variants={rise}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-80px' }}
                        className="lg:col-span-8"
                    >
                        <p className="mb-4 font-grotesk text-[11px] font-500 tracking-[0.3em] text-[#5b0520] uppercase">
                            What we do
                        </p>
                        <h2 className="font-editorial text-4xl leading-[1.05] font-500 text-[#14060c] sm:text-5xl lg:text-6xl">
                            Transfers built for <span className="italic text-[#5b0520]">Qatar stays.</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        variants={rise}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="font-grotesk text-base leading-relaxed text-[#14060c]/60 lg:col-span-4"
                    >
                        Whether you are landing at Hamad or leaving your hotel for a flight — AL MAJD handles the journey with one standard: impeccable.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-7">
                        <ul>
                            {SERVICES.map((s, i) => (
                                <motion.li
                                    key={s.no}
                                    variants={rise}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: '-40px' }}
                                    onMouseEnter={() => setActive(i)}
                                    onFocus={() => setActive(i)}
                                    className={`group border-b transition-colors ${
                                        active === i ? 'border-[#5b0520]/35' : 'border-[#14060c]/12'
                                    }`}
                                >
                                    <a href="#book" className="flex items-start gap-5 py-6 sm:gap-8 sm:py-8">
                                        <span
                                            className={`font-grotesk text-sm font-500 tabular-nums transition-colors ${
                                                active === i ? 'text-[#5b0520]' : 'text-[#14060c]/35'
                                            }`}
                                        >
                                            {s.no}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3
                                                className={`font-editorial text-3xl transition-all duration-300 sm:text-4xl lg:text-5xl ${
                                                    active === i
                                                        ? 'translate-x-1 text-[#5b0520] italic'
                                                        : 'text-[#14060c]'
                                                }`}
                                            >
                                                {s.title}
                                            </h3>
                                            <p className="mt-3 max-w-md font-grotesk text-sm leading-relaxed text-[#14060c]/55">
                                                {s.copy}
                                            </p>
                                            <div className="relative mt-5 h-48 overflow-hidden rounded-xl bg-[#efe6d7] lg:hidden">
                                                <img
                                                    src={s.img}
                                                    alt={s.title}
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <span
                                            className={`mt-2 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:flex ${
                                                active === i
                                                    ? 'border-[#5b0520] bg-[#5b0520] text-[#f7f2ea]'
                                                    : 'border-[#14060c]/20 text-[#14060c]/50'
                                            }`}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="hidden lg:col-span-5 lg:block">
                        <div className="sticky top-28">
                            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#efe6d7] shadow-[0_24px_60px_-28px_rgba(20,6,12,0.35)]">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={active}
                                        src={SERVICES[active].img}
                                        alt={SERVICES[active].title}
                                        initial={{ opacity: 0, scale: 1.06 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#14060c]/55 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="font-grotesk text-[11px] tracking-[0.3em] text-[#e4cd8f] uppercase">
                                        {SERVICES[active].tag}
                                    </span>
                                    <p className="font-editorial text-2xl text-[#f7f2ea] italic">
                                        {SERVICES[active].title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
