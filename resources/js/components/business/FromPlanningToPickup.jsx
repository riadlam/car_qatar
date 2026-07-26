import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BIZ_IMG, CREATE_ACCOUNT_HREF } from './assets';

gsap.registerPlugin(ScrollTrigger);

export default function FromPlanningToPickup() {
    const rootRef = useRef(null);
    const textRef = useRef(null);
    const imgRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            mm.add('(min-width: 1024px)', () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 75%',
                        end: 'bottom+=70% top',
                        scrub: 1.5,
                    },
                });

                if (textRef.current) {
                    tl.from(textRef.current, { x: -150, opacity: 0, duration: 1, ease: 'power1.out' }, 0);
                }
                if (imgRef.current) {
                    tl.from(imgRef.current, { x: 150, opacity: 0, duration: 1, ease: 'power1.out' }, 0);
                }

                tl.to({}, { duration: 5 });

                if (textRef.current) {
                    tl.to(textRef.current, { x: -150, opacity: 0, duration: 1, ease: 'power1.in' });
                }
                if (imgRef.current) {
                    tl.to(imgRef.current, { x: 150, opacity: 0, duration: 1, ease: 'power1.in' }, '<');
                }
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={rootRef} className="bg-tint px-6 pt-[112px] pb-[72px] lg:px-12 lg:pt-[144px]">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-5 lg:flex-row lg:items-center">
                <div
                    ref={textRef}
                    className="w-full max-w-none flex-1 text-center lg:max-w-[33.33%] lg:text-left"
                >
                    <h2 className="font-fragment m-0 mb-8 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[48px] sm:leading-[56px] lg:mb-10 lg:text-[64px] lg:leading-[72px]">
                        From planning to pickup.
                    </h2>
                    <h3 className="font-geist m-0 mb-8 text-[18px] leading-[26px] font-500 tracking-[0.15px] text-ink-text lg:text-[24px] lg:leading-8">
                        Our platforms are built to make your airport transfers, commutes, and
                        city-to-city journeys a breeze.
                    </h3>
                    <a
                        href={CREATE_ACCOUNT_HREF}
                        className="font-geist inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                    >
                        Create a business account
                    </a>
                </div>
                <div ref={imgRef} className="w-full min-w-0 flex-[2]">
                    <img
                        src={BIZ_IMG.portal}
                        alt="booking"
                        width={2767}
                        height={1691}
                        className="h-auto w-full max-w-full object-contain"
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
}
