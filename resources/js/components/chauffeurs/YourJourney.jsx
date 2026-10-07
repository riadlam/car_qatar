import { useLayoutEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CH_IMG } from './assets';

gsap.registerPlugin(ScrollTrigger);

const LEFT_ICONS = [
    <svg key="income" width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
        <circle cx="27" cy="27" r="26" stroke="currentColor" strokeWidth="1.5" />
        <path
            d="M27 16v22M18 25l9-9 9 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>,
    <svg key="define" width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
        <circle cx="27" cy="27" r="26" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="27" cy="27" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M27 18v9l6 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
];

const RIGHT_ICONS = [
    <svg key="admin" width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
        <circle cx="27" cy="27" r="26" stroke="currentColor" strokeWidth="1.5" />
        <rect x="17" y="18" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M21 24h12M21 29h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>,
    <svg key="trust" width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
        <circle cx="27" cy="27" r="26" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="27" cy="22" r="5" stroke="currentColor" strokeWidth="1.6" />
        <path
            d="M17 36c2.5-4 6-6 10-6s7.5 2 10 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
        />
    </svg>,
];

function Card({ title, copy, icon }) {
    return (
        <article className="rounded-2xl bg-white p-5 text-center sm:p-6">
            <div className="mb-4 flex justify-center text-wine-700">{icon}</div>
            <h3 className="font-geist m-0 text-[1.25rem] leading-7 font-500 tracking-[0.15px] text-ink-text sm:text-[1.5rem] sm:leading-8">
                {title}
            </h3>
            <p className="font-geist mt-2 m-0 text-[16px] leading-6 tracking-[0.15px] text-ink-text/80">{copy}</p>
        </article>
    );
}

export default function YourJourney() {
    const { t } = useTranslation('marketing');
    const rootRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    const left = useMemo(
        () => [
            {
                title: t('chauffeursPage.journey.income.title'),
                copy: t('chauffeursPage.journey.income.copy'),
                icon: LEFT_ICONS[0],
            },
            {
                title: t('chauffeursPage.journey.define.title'),
                copy: t('chauffeursPage.journey.define.copy'),
                icon: LEFT_ICONS[1],
            },
        ],
        [t],
    );

    const right = useMemo(
        () => [
            {
                title: t('chauffeursPage.journey.admin.title'),
                copy: t('chauffeursPage.journey.admin.copy'),
                icon: RIGHT_ICONS[0],
            },
            {
                title: t('chauffeursPage.journey.trust.title'),
                copy: t('chauffeursPage.journey.trust.copy'),
                icon: RIGHT_ICONS[1],
            },
        ],
        [t],
    );

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            const leftEls = leftRef.current?.children ? [...leftRef.current.children] : [];
            const rightEls = rightRef.current?.children ? [...rightRef.current.children] : [];

            if (leftEls.length) {
                gsap.from(leftEls, {
                    x: -80,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: root,
                        start: 'center 80%',
                        end: 'top 30%',
                        toggleActions: 'play none none reverse',
                    },
                });
            }
            if (rightEls.length) {
                gsap.from(rightEls, {
                    x: 80,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: root,
                        start: 'center 80%',
                        end: 'top 30%',
                        toggleActions: 'play none none reverse',
                    },
                });
            }
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={rootRef}
            className="relative bg-cover bg-top px-4 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
            style={{ backgroundImage: `url(${CH_IMG.journeyBg})` }}
        >
            <div className="mx-auto grid max-w-[1170px] grid-cols-1 items-center gap-6 lg:grid-cols-3 lg:gap-8">
                <div ref={leftRef} className="order-2 flex flex-col gap-4 lg:order-1 lg:gap-6">
                    {left.map((c) => (
                        <Card key={c.title} {...c} />
                    ))}
                </div>

                <div className="order-1 flex justify-center lg:order-2">
                    <img
                        src={CH_IMG.platform}
                        alt={t('chauffeursPage.journey.platformAlt')}
                        className="h-auto w-full max-w-[360px] object-contain lg:max-w-none"
                    />
                </div>

                <div ref={rightRef} className="order-3 flex flex-col gap-4 lg:gap-6">
                    {right.map((c) => (
                        <Card key={c.title} {...c} />
                    ))}
                </div>
            </div>
        </section>
    );
}
