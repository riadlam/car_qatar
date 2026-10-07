import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { CORP_IMG } from './assets';

function AccordionItem({ item, open, onToggle }) {
    return (
        <div className={`rounded-lg bg-[#f5f5f5] px-4 transition sm:px-5 ${open ? 'ring-1 ring-wine-700/30' : ''}`}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="font-geist flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[16px] font-500 tracking-[0.15px] text-ink-text sm:text-[18px]"
            >
                <span>{item.q}</span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                >
                    <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="font-geist pb-4 text-[15px] leading-6 font-400 text-muted sm:text-[16px]">
                            <p>{item.a}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Faqs() {
    const { t } = useTranslation('marketing');
    const [open, setOpen] = useState(0);

    const faqs = useMemo(
        () =>
            ['advance', 'vehicles', 'languages', 'payment', 'sustain'].map((key) => ({
                q: t(`corporations.faqsSection.items.${key}.q`),
                a: t(`corporations.faqsSection.items.${key}.a`),
            })),
        [t],
    );

    return (
        <section className="bg-page px-6 py-16 lg:px-12 lg:py-20">
            <div className="mx-auto flex max-w-[1170px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[100px]">
                <div className="min-w-0 flex-1">
                    <h2 className="font-fragment m-0 mb-8 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] lg:text-[40px] lg:leading-[48px]">
                        {t('corporations.faqsSection.title')}
                    </h2>
                    <div className="flex flex-col gap-3">
                        {faqs.map((item, i) => (
                            <AccordionItem
                                key={item.q}
                                item={item}
                                open={open === i}
                                onToggle={() => setOpen(open === i ? -1 : i)}
                            />
                        ))}
                    </div>
                </div>
                <div className="hidden w-full max-w-[420px] shrink-0 lg:block">
                    <img
                        src={CORP_IMG.faq}
                        alt=""
                        className="h-[548px] w-full rounded-2xl object-cover lg:h-[640px]"
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
}
