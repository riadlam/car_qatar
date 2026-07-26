import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CH_IMG } from './assets';

gsap.registerPlugin(ScrollTrigger);

const LEFT = [
    {
        title: 'Increase your income',
        copy: 'Clear rates. Reliable payments. Straight to your account.',
        icon: (
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                <circle cx="27" cy="27" r="26" stroke="currentColor" strokeWidth="1.5" />
                <path d="M27 16v22M18 25l9-9 9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: 'Define your day',
        copy: "Airport transfers. By-the-hour. City-to-city. Across town. It's your choice.",
        icon: (
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                <circle cx="27" cy="27" r="26" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="27" cy="27" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M27 18v9l6 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

const RIGHT = [
    {
        title: 'Ease your admin',
        copy: 'Simplify ride management with a platform built for your needs.',
        icon: (
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                <circle cx="27" cy="27" r="26" stroke="currentColor" strokeWidth="1.5" />
                <rect x="17" y="18" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M21 24h12M21 29h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        title: 'Trust your team',
        copy: "Dedicated 24/7 support. Local operations teams. We're here for you.",
        icon: (
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" aria-hidden="true">
                <circle cx="27" cy="27" r="26" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="27" cy="22" r="5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M17 36c2.5-4 6-6 10-6s7.5 2 10 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
        ),
    },
];

function Card({ title, copy, icon }) {
    return (
        <article className="rounded-2xl bg-white p-5 text-center sm:p-6">
            <div className="mb-4 flex justify-center text-wine-700">{icon}</div>
            <h3 className="font-geist m-0 text-[1.25rem] leading-7 font-500 tracking-[0.15px] text-ink-text sm:text-[1.5rem] sm:leading-8">
                {title}
            </h3>
            <p className="font-geist mt-2 m-0 text-[16px] leading-6 tracking-[0.15px] text-ink-text/80">
                {copy}
            </p>
        </article>
    );
}

export default function YourJourney() {
    const rootRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            const left = leftRef.current?.children ? [...leftRef.current.children] : [];
            const right = rightRef.current?.children ? [...rightRef.current.children] : [];

            if (left.length) {
                gsap.from(left, {
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
            if (right.length) {
                gsap.from(right, {
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
                {/* Desktop: left cards · Mobile order: image first */}
                <div ref={leftRef} className="order-2 flex flex-col gap-4 lg:order-1 lg:gap-6">
                    {LEFT.map((c) => (
                        <Card key={c.title} {...c} />
                    ))}
                </div>

                <div className="order-1 flex justify-center lg:order-2">
                    <img
                        src={CH_IMG.platform}
                        alt="AL MAJD platform"
                        className="h-auto w-full max-w-[360px] object-contain lg:max-w-none"
                    />
                </div>

                <div ref={rightRef} className="order-3 flex flex-col gap-4 lg:gap-6">
                    {RIGHT.map((c) => (
                        <Card key={c.title} {...c} />
                    ))}
                </div>
            </div>
        </section>
    );
}
