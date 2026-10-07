import { useState, useLayoutEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CH_IMG, APPLY_HREF } from './assets';

gsap.registerPlugin(ScrollTrigger);

function AccordionItem({ item, open, onToggle }) {
    return (
        <div className={`border-b border-ink-text/10 transition ${open ? 'border-b-wine-700' : ''}`}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="font-geist flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-[16px] font-500 tracking-[0.15px] text-ink-text sm:text-[18px]"
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
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden"
                    >
                        <div className="font-geist cursor-default pb-5 text-[15px] leading-6 tracking-[0.15px] text-ink-text/80 sm:text-[16px] [&_a]:cursor-pointer">
                            {item.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Questions() {
    const { t } = useTranslation('marketing');
    const [openIndex, setOpenIndex] = useState(0);
    const rootRef = useRef(null);
    const leftRef = useRef(null);
    const imgRef = useRef(null);

    const faqs = useMemo(() => {
        const linkClass = 'underline underline-offset-2';
        const here = t('chauffeursPage.faqs.here');
        const reg = t('chauffeursPage.faqs.registrationPage');
        return [
            {
                q: t('chauffeursPage.faqs.items.partner.q'),
                a: (
                    <>
                        <p>{t('chauffeursPage.faqs.items.partner.p1')}</p>
                        <p className="mt-3">{t('chauffeursPage.faqs.items.partner.p2')}</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            <li>{t('chauffeursPage.faqs.items.partner.i1')}</li>
                            <li>{t('chauffeursPage.faqs.items.partner.i2')}</li>
                        </ul>
                        <p className="mt-3">
                            {t('chauffeursPage.faqs.items.partner.p3Before')}
                            <a href={APPLY_HREF} className={linkClass}>
                                {here}
                            </a>
                            {t('chauffeursPage.faqs.items.partner.p3After')}
                        </p>
                    </>
                ),
            },
            {
                q: t('chauffeursPage.faqs.items.rides.q'),
                a: <p>{t('chauffeursPage.faqs.items.rides.a')}</p>,
            },
            {
                q: t('chauffeursPage.faqs.items.paid.q'),
                a: <p>{t('chauffeursPage.faqs.items.paid.a')}</p>,
            },
            {
                q: t('chauffeursPage.faqs.items.vehicles.q'),
                a: (
                    <p>
                        {t('chauffeursPage.faqs.items.vehicles.aBefore')}
                        <a href={APPLY_HREF} className={linkClass}>
                            {reg}
                        </a>
                        {t('chauffeursPage.faqs.items.vehicles.aAfter')}
                    </p>
                ),
            },
            {
                q: t('chauffeursPage.faqs.items.apply.q'),
                a: (
                    <p>
                        {t('chauffeursPage.faqs.items.apply.aBefore')}
                        <a href={APPLY_HREF} className={linkClass}>
                            {reg}
                        </a>
                        {t('chauffeursPage.faqs.items.apply.aAfter')}
                    </p>
                ),
            },
            {
                q: t('chauffeursPage.faqs.items.ev.q'),
                a: (
                    <p>
                        {t('chauffeursPage.faqs.items.ev.aBefore')}
                        <a href={APPLY_HREF} className={linkClass}>
                            {reg}
                        </a>
                        {t('chauffeursPage.faqs.items.ev.aAfter')}
                    </p>
                ),
            },
        ];
    }, [t]);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            mm.add('(min-width: 1024px)', () => {
                if (leftRef.current) {
                    gsap.from(leftRef.current, {
                        x: -80,
                        opacity: 0,
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: root,
                            start: 'center 75%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }
                if (imgRef.current) {
                    gsap.from(imgRef.current, {
                        x: 80,
                        opacity: 0,
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: root,
                            start: 'center 75%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={rootRef} className="bg-page px-0 py-[128px] lg:py-[160px]">
            <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-10 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
                <div ref={leftRef} className="min-w-0">
                    <h2 className="font-fragment m-0 mb-10 text-[48px] leading-[56px] font-400 tracking-[0.25px] text-ink-text lg:mb-16 lg:text-[104px] lg:leading-[120px]">
                        {t('chauffeursPage.faqs.title')}
                    </h2>
                    <div className="flex flex-col">
                        {faqs.map((item, i) => (
                            <AccordionItem
                                key={item.q}
                                item={item}
                                open={openIndex === i}
                                onToggle={() => setOpenIndex((v) => (v === i ? -1 : i))}
                            />
                        ))}
                    </div>
                </div>

                <div ref={imgRef} className="hidden lg:block">
                    <img
                        src={CH_IMG.faq}
                        alt={t('chauffeursPage.faqs.imageAlt')}
                        className="aspect-[4/3] w-full rounded-lg object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
