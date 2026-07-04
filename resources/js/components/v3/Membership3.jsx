import { motion } from 'motion/react';
import { rise, stagger, TIERS } from './data';

export default function Membership3() {
    return (
        <section id="membership" className="relative bg-[#f7f2ea] py-16 text-[#14060c] sm:py-24 lg:py-32">
            <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
                <div className="mb-12 max-w-2xl sm:mb-16">
                    <motion.p
                        variants={rise}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mb-4 font-grotesk text-[11px] font-500 tracking-[0.3em] text-[#5b0520] uppercase"
                    >
                        Membership
                    </motion.p>
                    <motion.h2
                        variants={rise}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="font-editorial text-4xl leading-[1.05] font-500 text-[#14060c] sm:text-5xl lg:text-6xl"
                    >
                        Belong to the <span className="italic text-[#5b0520]">few.</span>
                    </motion.h2>
                </div>

                <motion.div
                    variants={stagger(0, 0.12)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                    {TIERS.map((tier) => (
                        <motion.div
                            key={tier.name}
                            variants={rise}
                            className={`group relative flex flex-col overflow-hidden rounded-2xl p-8 transition-all duration-500 sm:p-10 ${
                                tier.featured
                                    ? 'bg-[#5b0520] text-[#f7f2ea] shadow-[0_30px_70px_-30px_rgba(91,5,32,0.6)] lg:-translate-y-4'
                                    : 'border border-[#14060c]/12 bg-white text-[#14060c] hover:border-[#5b0520]/30'
                            }`}
                        >
                            {tier.featured && (
                                <span className="absolute right-6 top-6 rounded-full bg-[#c9a24b] px-3 py-1 font-grotesk text-[10px] font-600 tracking-[0.16em] text-[#14060c] uppercase">
                                    Most chosen
                                </span>
                            )}
                            <h3 className={`font-editorial text-3xl ${tier.featured ? 'text-[#f7f2ea]' : 'text-[#14060c]'}`}>
                                {tier.name}
                            </h3>
                            <p className={`mt-2 font-grotesk text-sm ${tier.featured ? 'text-[#f7f2ea]/70' : 'text-[#14060c]/50'}`}>
                                {tier.tagline}
                            </p>

                            <span className={`mt-7 mb-7 block h-px w-full ${tier.featured ? 'bg-[#f7f2ea]/20' : 'bg-[#14060c]/10'}`} />

                            <ul className="flex-1 space-y-4">
                                {tier.features.map((f) => (
                                    <li key={f} className="flex items-start gap-3 font-grotesk text-sm">
                                        <span className={tier.featured ? 'text-[#e4cd8f]' : 'text-[#a9843a]'}>✦</span>
                                        <span className={tier.featured ? 'text-[#f7f2ea]/85' : 'text-[#14060c]/70'}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="#book"
                                className={`mt-9 flex items-center justify-center gap-2 rounded-full py-3.5 font-grotesk text-[13px] font-600 tracking-[0.1em] uppercase transition ${
                                    tier.featured
                                        ? 'bg-[#f7f2ea] text-[#5b0520] hover:bg-[#e4cd8f]'
                                        : 'bg-[#5b0520] text-[#f7f2ea] hover:bg-[#741133]'
                                }`}
                            >
                                Enquire
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
