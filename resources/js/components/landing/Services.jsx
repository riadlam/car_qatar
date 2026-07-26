import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMG } from './motion';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
    {
        tag: 'Airport transfers',
        title: 'Smooth landings, every time.',
        copy: 'Delayed flight? Chauffeurs track arrivals and adjust accordingly. Plus, you have 1 hour of complimentary wait time just in case.',
        img: IMG.service1,
        href: '#airport',
    },
    {
        tag: 'Hourly and full day hire',
        title: 'Seize the day.',
        copy: "Reserve a dedicated chauffeur from 2 to 24 hours. They'll be on standby as long as you need them.",
        img: IMG.service2,
        href: '#hourly',
    },
    {
        tag: 'City-to-city',
        title: 'Between cities, done better.',
        copy: 'Turn long-distance journeys into time well spent. Arrive refreshed, not stressed.',
        img: IMG.service3,
        href: '#city-to-city',
    },
    {
        tag: 'Enterprise and agency solutions',
        title: 'Corporate travel, simplified.',
        copy: 'One platform for companies and agencies to book, track, and account for every journey.',
        img: IMG.service4,
        href: '#business',
    },
];

export default function Services() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const titleBlockRef = useRef(null);
    const cardsRef = useRef(null);
    const trackRef = useRef(null);
    const [index, setIndex] = useState(0);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const title = titleRef.current;
        const subtitle = subtitleRef.current;
        const titleBlock = titleBlockRef.current;
        const cards = cardsRef.current;
        if (!section || !title || !subtitle || !titleBlock || !cards) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Desktop-only: scrub reveals + bg shift + title collapse (keeps PC behavior + reverse)
            mm.add('(min-width: 1024px)', () => {
                gsap.fromTo(
                    title,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'power1.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: title,
                            start: 'top 85%',
                            end: 'top 60%',
                            scrub: 2,
                            invalidateOnRefresh: true,
                        },
                    },
                );
                gsap.fromTo(
                    subtitle,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'power1.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: subtitle,
                            start: 'top 85%',
                            end: 'top 60%',
                            scrub: 2,
                            invalidateOnRefresh: true,
                        },
                    },
                );

                gsap.to(section, {
                    backgroundColor: '#fbf8f2',
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cards,
                        start: 'top 50%',
                        end: 'top 50%',
                        toggleActions: 'play none none reverse',
                    },
                });

                gsap.fromTo(
                    titleBlock,
                    { y: 0, opacity: 1, scale: 1 },
                    {
                        y: -280,
                        opacity: 0,
                        scale: 0.85,
                        ease: 'none',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: cards,
                            start: 'top 60%',
                            end: 'top 30%',
                            scrub: 1,
                            invalidateOnRefresh: true,
                        },
                    },
                );

                gsap.fromTo(
                    cards,
                    { opacity: 0.3, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        ease: 'none',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: cards,
                            start: 'top 80%',
                            end: 'top 30%',
                            scrub: 1,
                            invalidateOnRefresh: true,
                        },
                    },
                );
            });

            // Mobile / tablet: light fade-in only (no scrub — scrub sticks touch scroll)
            mm.add('(max-width: 1023px)', () => {
                gsap.from([title, subtitle], {
                    y: 36,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: 'power1.out',
                    scrollTrigger: {
                        trigger: titleBlock,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse',
                    },
                });

                gsap.from(cards, {
                    y: 28,
                    opacity: 0,
                    duration: 0.75,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: cards,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });
        }, section);

        return () => ctx.revert();
    }, []);

    const scrollTo = (i) => {
        const el = trackRef.current;
        if (!el) return;
        const slide = el.children[i];
        if (!slide) return;
        slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        setIndex(i);
    };

    const onScroll = () => {
        const el = trackRef.current;
        if (!el) return;
        const slides = [...el.children];
        let best = 0;
        let bestDist = Infinity;
        slides.forEach((s, i) => {
            const d = Math.abs(s.offsetLeft - el.scrollLeft);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        });
        setIndex(best);
    };

    return (
        <section id="services" ref={sectionRef} className="overflow-hidden bg-tint text-center">
            <div
                ref={titleBlockRef}
                className="mx-auto flex min-h-[100svh] w-full items-center justify-center px-4 py-16 sm:px-8 lg:px-12"
            >
                <div className="flex max-w-[900px] flex-col items-center justify-center gap-3 text-center sm:gap-4 lg:gap-6">
                    <h2
                        ref={titleRef}
                        className="font-fragment m-0 text-[1.75rem] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[2.75rem] sm:leading-[3.25rem] lg:text-[6.5rem] lg:leading-[7.5rem]"
                    >
                        Arrive at your best.
                    </h2>
                    <p
                        ref={subtitleRef}
                        className="font-geist m-0 max-w-[34rem] text-[1.125rem] leading-7 font-500 tracking-[0.15px] text-ink-text sm:text-[1.5rem] sm:leading-8 lg:max-w-none lg:text-[1.75rem] lg:leading-9 lg:tracking-[0.25px]"
                    >
                        Effortless journeys, tailored to you.
                    </p>
                </div>
            </div>

            <div ref={cardsRef} className="pb-10 sm:pb-12 lg:pb-16">
                <div className="mx-auto max-w-[1440px] text-left">
                    <div
                        ref={trackRef}
                        onScroll={onScroll}
                        aria-label="Book services"
                        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 lg:gap-5 lg:px-12 [&::-webkit-scrollbar]:hidden"
                    >
                        {SERVICES.map((s) => (
                            <article
                                key={s.tag}
                                // Mobile/tablet: one card peek; desktop unchanged 50%
                                className="group w-[85%] shrink-0 snap-start rounded-2xl bg-transparent transition-colors hover:bg-white sm:w-[70%] lg:w-[calc(50%-0.625rem)]"
                            >
                                <div className="h-[220px] overflow-hidden rounded-2xl sm:h-[260px] lg:h-[312px]">
                                    <img
                                        src={s.img}
                                        alt={s.tag}
                                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>
                                <div className="px-1 pt-4 pb-2 sm:px-2 sm:pt-5">
                                    <p className="font-geist text-[14px] leading-5 tracking-[0.15px] text-muted">
                                        {s.tag}
                                    </p>
                                    <h3 className="font-fragment mt-2 text-[1.375rem] leading-8 font-400 text-ink-text sm:text-[2rem] sm:leading-10">
                                        {s.title}
                                    </h3>
                                    <p className="font-geist mt-3 text-[15px] leading-6 tracking-[0.15px] text-ink-text/80 sm:text-[16px]">
                                        {s.copy}
                                    </p>
                                    <a
                                        href={s.href}
                                        className="font-geist mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-wine-700 px-4 py-2 text-[16px] font-500 text-wine-700 transition hover:bg-page sm:mt-5"
                                    >
                                        Learn more
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-1 flex justify-center gap-2 px-4 sm:mt-2 sm:px-6">
                        {SERVICES.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => scrollTo(i)}
                                className={`h-2 w-2 rounded-full transition ${
                                    index === i ? 'bg-wine-700' : 'bg-wine-700/25'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
