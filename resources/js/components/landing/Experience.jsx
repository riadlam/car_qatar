import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMG } from './motion';
import { useSectionAnim } from './useSectionAnim';

gsap.registerPlugin(ScrollTrigger);

const DETAILS = [
    {
        title: 'A welcome like no other',
        copy: 'The door is opened for you. Your luggage is stowed. Everything is taken care of.',
        img: IMG.ride1,
    },
    {
        title: 'You set the tone',
        copy: 'Sit back and relax. Music and temperature will be adjusted to your preferences.',
        img: IMG.ride2,
    },
    {
        title: 'Recharge your batteries',
        copy: 'Stay connected on the go with universal chargers for iOS and Android.',
        img: IMG.ride3,
    },
];

const GLASS = {
    backgroundColor: 'rgba(0,0,0,0.2)',
    backgroundImage:
        'radial-gradient(rgba(0,0,0,.15), rgba(0,0,0,0) 90%), radial-gradient(circle at 80% 200%, rgba(255,255,255,.25), rgba(255,255,255,0) 80%), linear-gradient(rgba(15,19,25,.2))',
    boxShadow: '0 2px 8px 0 rgba(6,10,13,.12), inset 4px 4px 8px rgba(0,0,0,.06)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
};

function PinnedSlides() {
    const containerRef = useRef(null);
    const slideRefs = useRef([]);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1024px)', () => {
            const container = containerRef.current;
            const slides = slideRefs.current.filter(Boolean);
            if (!container || !slides.length) return;

            slides.forEach((el, i) => {
                gsap.set(el, { zIndex: slides.length - i, yPercent: 0 });
            });

            // Copied 1:1 from Blacklane’s RideSection GSAP setup
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: '-104 top',
                    end: '+=200%',
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            slides.forEach((el, i) => {
                if (i < slides.length - 1) {
                    tl.to(el, { yPercent: -110, ease: 'none', duration: 1 }, i);
                }
            });

            // Refresh after images load so pin distances are correct
            const imgs = container.querySelectorAll('img');
            let pending = imgs.length;
            const done = () => {
                pending -= 1;
                if (pending <= 0) ScrollTrigger.refresh();
            };
            imgs.forEach((img) => {
                if (img.complete) done();
                else {
                    img.addEventListener('load', done, { once: true });
                    img.addEventListener('error', done, { once: true });
                }
            });

            return () => {
                tl.scrollTrigger?.kill();
                tl.kill();
            };
        });

        return () => mm.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative z-[2] hidden overflow-hidden rounded-2xl lg:block"
            style={{
                // Identical to .RideSection_imageContainer__40TAg
                width: '100%',
                height: 'calc(100vh - 96px - 24px)',
                margin: '0 auto',
                borderRadius: 16,
            }}
        >
            <ul
                className="relative m-0 h-full w-full list-none p-0"
                style={{ margin: 0, padding: 0, listStyle: 'none' }}
            >
                {DETAILS.map((item, i) => (
                    <div
                        key={item.title}
                        ref={(el) => {
                            slideRefs.current[i] = el;
                        }}
                        className="absolute inset-0 text-left"
                        style={{
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            willChange: 'transform',
                        }}
                    >
                        {/* ImageCard_background-image + RideSection_slide */}
                        <li
                            className="relative flex h-full w-full list-none flex-col overflow-hidden p-0"
                            style={{ borderRadius: 16 }}
                        >
                            {/* ImageCard_media-container + RideSection_slideMedia */}
                            <div className="relative flex min-h-0 flex-1">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        borderRadius: 16,
                                        willChange: 'transform',
                                        display: 'block',
                                    }}
                                />
                            </div>
                            {/* ImageCard_content */}
                            <div
                                className="absolute right-0 bottom-0 left-0 m-6 rounded-lg p-6"
                                style={GLASS}
                            >
                                <h3
                                    className="m-0 text-white"
                                    style={{
                                        fontFamily: 'Geist, sans-serif',
                                        fontWeight: 500,
                                        fontSize: 28,
                                        lineHeight: '36px',
                                        letterSpacing: '0.25px',
                                    }}
                                >
                                    {item.title}
                                </h3>
                                <div
                                    className="mt-1 text-white"
                                    style={{
                                        fontFamily: 'Geist, sans-serif',
                                        fontWeight: 400,
                                        fontSize: 18,
                                        lineHeight: '26px',
                                        letterSpacing: '0.25px',
                                    }}
                                >
                                    {item.copy}
                                </div>
                            </div>
                        </li>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default function Experience() {
    const rootRef = useSectionAnim();

    return (
        <section
            id="experience"
            ref={rootRef}
            data-anim="section"
            className="bg-white px-4 pt-12 pb-5 text-center sm:px-8 sm:pt-14 lg:px-12 lg:pt-24 lg:pb-5"
        >
            <div className="mx-auto max-w-[1170px] max-lg:px-0 max-lg:pt-0" style={{ margin: '0 auto' }}>
                <h2
                    data-anim="title"
                    className="font-fragment mx-auto mb-4 max-w-[800px] text-ink-text sm:mb-6 max-lg:text-[2rem] max-lg:leading-9"
                    style={{
                        fontSize: 'clamp(1.75rem, 6vw, 104px)',
                        lineHeight: 'clamp(2.25rem, 7vw, 120px)',
                        fontWeight: 400,
                        letterSpacing: '0.25px',
                        margin: '0 auto 16px',
                    }}
                >
                    Step in. Breathe out.
                </h2>
                <p
                    data-anim="subtitle"
                    className="font-fragment mx-auto max-w-[36rem] text-ink-text lg:max-w-none"
                    style={{
                        fontSize: 'clamp(1.0625rem, 2vw, 32px)',
                        lineHeight: 'clamp(1.625rem, 2.5vw, 40px)',
                        fontWeight: 400,
                        marginBottom: 'clamp(2rem, 5vw, 72px)',
                    }}
                >
                    Thoughtful details and discreet service transform every journey into your personal sanctuary.
                </p>
            </div>

            {/* Mobile / tablet carousel — desktop uses PinnedSlides */}
            <ul
                className="m-0 -mx-4 flex list-none gap-4 overflow-x-auto px-4 pb-1 sm:-mx-0 sm:gap-5 sm:px-0 lg:hidden"
                style={{
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                }}
            >
                {DETAILS.map((item) => (
                    <li
                        key={item.title}
                        data-anim="item"
                        className="relative shrink-0 overflow-hidden text-left"
                        style={{
                            flex: '0 0 85%',
                            height: 'min(420px, 70svh)',
                            borderRadius: 16,
                            scrollSnapAlign: 'center',
                        }}
                    >
                        <img
                            data-anim="img"
                            src={item.img}
                            alt={item.title}
                            loading="lazy"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                        />
                        <div className="absolute right-0 bottom-0 left-0 m-4 rounded-lg p-5" style={GLASS}>
                            <h3
                                className="m-0 text-white"
                                style={{ fontFamily: 'Geist, sans-serif', fontWeight: 500, fontSize: 24 }}
                            >
                                {item.title}
                            </h3>
                            <p
                                className="mt-1 mb-0 text-white"
                                style={{ fontFamily: 'Geist, sans-serif', fontSize: 16, lineHeight: '24px' }}
                            >
                                {item.copy}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            <PinnedSlides />
        </section>
    );
}
