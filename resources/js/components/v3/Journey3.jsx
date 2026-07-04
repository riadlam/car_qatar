import { motion } from 'motion/react';
import { JOURNEY, rise, stagger } from './data';

export default function Journey3() {
    return (
        <section id="journey" className="relative bg-[#efe6d7] py-16 text-[#14060c] sm:py-24 lg:py-32">
            <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
                <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
                    <motion.h2
                        variants={rise}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="max-w-lg font-editorial text-4xl leading-[1.05] font-500 text-[#14060c] sm:text-5xl lg:text-6xl"
                    >
                        Hotel to gate, <span className="italic text-[#5b0520]">four steps.</span>
                    </motion.h2>
                    <motion.p
                        variants={rise}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="max-w-xs font-grotesk text-sm leading-relaxed text-[#14060c]/55"
                    >
                        From booking to your hotel lobby — or the terminal doors — every step is designed to feel effortless.
                    </motion.p>
                </div>

                <motion.div
                    variants={stagger(0, 0.12)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#14060c]/10 bg-[#14060c]/10 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {JOURNEY.map((step) => (
                        <motion.div
                            key={step.no}
                            variants={rise}
                            className="group relative bg-[#efe6d7] p-7 transition-colors duration-500 hover:bg-[#f7f2ea] sm:p-9"
                        >
                            <span className="font-editorial text-5xl font-600 text-[#14060c]/12 transition-colors duration-500 group-hover:text-[#5b0520]/25 sm:text-6xl">
                                {step.no}
                            </span>
                            <h3 className="mt-6 font-editorial text-2xl text-[#14060c]">{step.title}</h3>
                            <p className="mt-3 font-grotesk text-sm leading-relaxed text-[#14060c]/55">{step.copy}</p>
                            <span className="mt-6 block h-px w-10 bg-[#5b0520] transition-all duration-500 group-hover:w-20" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
