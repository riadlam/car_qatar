import { motion } from 'motion/react';
import { rise, stagger } from './data';

export default function Cta3() {
    return (
        <section className="relative bg-[#f7f2ea] pb-16 sm:pb-24 lg:pb-28">
            <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
                <motion.div
                    variants={stagger(0, 0.12)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="relative overflow-hidden rounded-3xl bg-[#5b0520] px-6 py-16 text-center sm:px-12 sm:py-24"
                >
                    <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#c9a24b]/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-[#c9a24b]/10 blur-3xl" />

                    <motion.p
                        variants={rise}
                        className="relative font-grotesk text-[11px] font-500 tracking-[0.34em] text-[#e4cd8f] uppercase"
                    >
                        Book your Qatar transfer
                    </motion.p>
                    <motion.h2
                        variants={rise}
                        className="relative mx-auto mt-6 max-w-3xl font-editorial text-4xl leading-[1.05] font-500 text-[#f7f2ea] sm:text-6xl lg:text-7xl"
                    >
                        Hotel or airport —{' '}
                        <span className="italic text-[#e4cd8f]">we’ll be there.</span>
                    </motion.h2>
                    <motion.div
                        variants={rise}
                        className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
                    >
                        <a
                            href="#book"
                            className="w-full rounded-full bg-[#f7f2ea] px-9 py-4 text-center font-grotesk text-[13px] font-600 tracking-[0.12em] text-[#5b0520] uppercase transition hover:bg-[#e4cd8f] sm:w-auto"
                        >
                            Book a transfer
                        </a>
                        <a
                            href="#membership"
                            className="w-full rounded-full border border-[#f7f2ea]/40 px-9 py-4 text-center font-grotesk text-[13px] font-500 tracking-[0.12em] text-[#f7f2ea] uppercase transition hover:border-[#f7f2ea] sm:w-auto"
                        >
                            Explore membership
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
