import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BENEFITS = [
    {
        title: 'Global reliability',
        body: 'Count on instant confirmation and high-quality service in over 60 countries.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="20" cy="20" rx="8" ry="16" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 20h32M20 4c4 5 6 10 6 16s-2 11-6 16c-4-5-6-10-6-16s2-11 6-16z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        title: 'Competitive rates',
        body: 'Access excellent service at distance-based rates that are fair to you and our chauffeurs.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="14" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="26" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 17v6M11.5 20h5M26 17v6M23.5 20h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        title: 'Unrivaled flexibility',
        body: 'Change or cancel at no extra charge up until 1 hour before pickup.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 12v9l6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30 10l3 2-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: 'Priority 24/7 support',
        body: 'Receive multilingual care whenever you need it via chat, phone, or email.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M10 16a6 6 0 016-6h8a6 6 0 016 6v4a6 6 0 01-6 6h-2l-4 4v-4h-2a6 6 0 01-6-6v-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 18h12M14 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        title: 'Simplified management',
        body: 'Reduce accounting hassles with detailed reporting and individual or monthly invoicing.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <rect x="10" y="8" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14h12M14 19h12M14 24h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M24 27l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: 'Sustainability',
        body: 'Support your ESG goals with carbon-offset rides, and electric vehicles in many locations.',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M20 32V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 20c-6-2-10-8-10-12 8 0 12 4 14 10 2-6 6-10 14-10 0 4-4 10-10 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        ),
    },
];

export default function Arrival() {
    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const gridRef = useRef(null);

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
                const cards = gridRef.current?.children ? [...gridRef.current.children] : [];
                if (cards.length) {
                    gsap.from(cards, {
                        y: 80,
                        opacity: 0,
                        stagger: 0.15,
                        ease: 'power1.out',
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: 'top 85%',
                            end: 'top 55%',
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
        <section ref={rootRef} className="bg-page px-6 py-[112px] text-center lg:px-12 lg:pt-[144px] lg:pb-[72px]">
            <div className="mx-auto max-w-[1200px]">
                <h2
                    ref={titleRef}
                    className="font-fragment mb-10 text-[48px] leading-[56px] font-400 tracking-[0.25px] text-wine-400 lg:mb-12 lg:text-[64px] lg:leading-[72px]"
                >
                    How you arrive matters.
                </h2>
                <div ref={gridRef} className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
                    {BENEFITS.map((b) => (
                        <article key={b.title} className="rounded-2xl bg-[#eef1f3] p-6 text-center sm:p-8">
                            <div className="mb-4 flex justify-center text-wine-700">{b.icon}</div>
                            <h3 className="font-geist m-0 text-[20px] leading-7 font-500 tracking-[0.15px] text-ink-text sm:text-[24px] sm:leading-8">
                                {b.title}
                            </h3>
                            <p className="font-geist mt-2 m-0 text-[16px] leading-6 tracking-[0.15px] text-ink-text/80">
                                {b.body}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
