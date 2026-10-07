import { useLayoutEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BIZ_IMG } from './assets';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
    const { t } = useTranslation('marketing');
    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef(null);

    const cards = useMemo(
        () => [
            {
                title: t('business.services.corporate.title'),
                body: t('business.services.corporate.body'),
                href: '/corporations',
                img: BIZ_IMG.corporate,
            },
            {
                title: t('business.services.agencies.title'),
                body: t('business.services.agencies.body'),
                href: '/travel-agencies',
                img: BIZ_IMG.agencies,
            },
            {
                title: t('business.services.partnerships.title'),
                body: t('business.services.partnerships.body'),
                href: '/strategic-partnerships',
                img: BIZ_IMG.partnerships,
            },
        ],
        [t],
    );

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            mm.add('(min-width: 1024px)', () => {
                if (titleRef.current) {
                    gsap.from(titleRef.current, {
                        y: 50,
                        opacity: 0,
                        duration: 1,
                        ease: 'power1.out',
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: 'top 85%',
                            end: 'top 60%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }
                const els = cardsRef.current?.children ? [...cardsRef.current.children] : [];
                if (els.length) {
                    gsap.from(els, {
                        y: 80,
                        opacity: 0,
                        stagger: 0.2,
                        ease: 'power1.out',
                        scrollTrigger: {
                            trigger: cardsRef.current,
                            start: 'top 85%',
                            end: 'top 60%',
                            scrub: 2,
                            toggleActions: 'play none none reverse',
                        },
                    });
                }
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={rootRef} className="bg-page px-6 py-16 lg:px-12 lg:py-16">
            <div className="mx-auto max-w-[1440px]">
                <nav
                    aria-label={t('common.breadcrumb')}
                    className="mb-8 flex flex-wrap items-center justify-center gap-2 text-[14px] leading-5 text-muted"
                >
                    <a href="/" className="cursor-pointer hover:text-ink-text">
                        {t('common.home')}
                    </a>
                    <span aria-hidden="true">›</span>
                    <span>{t('business.services.breadcrumbCurrent')}</span>
                </nav>

                <h2
                    ref={titleRef}
                    className="font-fragment mb-10 text-center text-[48px] leading-[56px] font-400 tracking-[0.25px] text-wine-400 lg:mb-12 lg:text-[64px] lg:leading-[72px]"
                >
                    {t('business.services.title')}
                </h2>

                <div ref={cardsRef} className="flex flex-col gap-5 lg:flex-row lg:gap-5">
                    {cards.map((c) => (
                        <article
                            key={c.href}
                            className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-white p-2 transition hover:bg-white lg:bg-transparent lg:hover:bg-white"
                        >
                            <div className="h-[340px] overflow-hidden rounded-lg lg:h-[256px]">
                                <img src={c.img} alt={c.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col gap-2 px-2 pt-2 pb-3">
                                <h3 className="font-geist m-0 text-[20px] leading-7 font-500 tracking-[0.15px] text-ink-text sm:text-[28px] sm:leading-9">
                                    {c.title}
                                </h3>
                                <p className="font-geist m-0 flex-1 text-[16px] leading-6 tracking-[0.15px] text-ink-text/80 sm:text-[18px] sm:leading-[26px]">
                                    {c.body}
                                </p>
                                <a
                                    href={c.href}
                                    aria-label={t('business.services.learnMoreAbout', { title: c.title })}
                                    className="font-geist mt-2 inline-flex min-h-11 w-fit cursor-pointer items-center justify-center rounded-full border border-wine-700 px-5 py-2 text-[16px] font-500 text-wine-700 transition hover:bg-page"
                                >
                                    {t('business.services.learnMore')}
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
