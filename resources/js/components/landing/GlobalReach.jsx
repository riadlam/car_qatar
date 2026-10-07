import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { fadeUp } from './motion';

export default function GlobalReach() {
    const { t } = useTranslation('landing');

    return (
        <section className="relative overflow-hidden bg-ink py-16 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
                <motion.h2
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="font-display text-2xl leading-[1.35] font-500 text-balance text-ivory sm:text-4xl sm:leading-[1.3] lg:text-[2.75rem]"
                >
                    {t('globalReach.line1')}
                    <br className="hidden sm:block" /> {t('globalReach.line2')}
                </motion.h2>
            </div>
        </section>
    );
}
