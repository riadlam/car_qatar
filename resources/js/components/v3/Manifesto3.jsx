import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { IMG, rise, stagger } from './data';

const LINE = 'We do not sell rides. We give Qatar travellers the calm between hotel and Hamad — time, arrived beautifully.';

export default function Manifesto3() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

    return (
        <section ref={ref} className="relative overflow-hidden bg-[#14060c] py-24 sm:py-32 lg:py-44">
            <motion.img
                style={{ y }}
                src={IMG.manifesto}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-[130%] w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#14060c] via-[#14060c]/70 to-[#14060c]" />

            <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-8">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="font-grotesk text-[11px] font-500 tracking-[0.4em] text-[#c9a24b] uppercase"
                >
                    The AL MAJD philosophy
                </motion.span>

                <motion.blockquote
                    variants={stagger(0.1, 0.06)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="mt-8 font-editorial text-3xl leading-[1.3] font-500 text-[#f7f2ea] sm:text-4xl lg:text-[3.4rem] lg:leading-[1.25]"
                >
                    {LINE.split(' ').map((w, i) => (
                        <motion.span key={i} variants={rise} className="mr-[0.25em] inline-block">
                            {w === 'time,' || w === 'beautifully.' ? (
                                <span className="italic text-[#e4cd8f]">{w}</span>
                            ) : (
                                w
                            )}
                        </motion.span>
                    ))}
                </motion.blockquote>
            </div>
        </section>
    );
}
