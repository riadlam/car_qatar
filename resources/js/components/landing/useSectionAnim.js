import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'power1.out';

function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

/**
 * Blacklane-style section reveals.
 * Desktop: scrubbed fromTo (reliable reverse on scroll up).
 * Mobile: play/reverse without scrub (avoids sticky touch scroll).
 */
export function useSectionAnim(options = {}) {
    const rootRef = useRef(null);
    const { start = 'top 85%', end = 'top 60%' } = options;

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        if (prefersReducedMotion()) {
            root.querySelectorAll('[data-anim]').forEach((el) => {
                gsap.set(el, { clearProps: 'all', opacity: 1 });
            });
            return;
        }

        const q = (sel) => [...root.querySelectorAll(sel)].filter(isVisible);

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // —— Desktop: scrubbed fromTo so reverse scroll restores ——
            mm.add('(min-width: 1024px)', () => {
                const st = (trigger, s = start, e = end, scrub = 2) => ({
                    trigger,
                    start: s,
                    end: e,
                    scrub,
                    invalidateOnRefresh: true,
                });

                const sections = root.matches('[data-anim="section"]')
                    ? [root]
                    : q('[data-anim="section"]');

                sections.forEach((el) => {
                    gsap.fromTo(
                        el,
                        { opacity: 0.55 },
                        { opacity: 1, ease: EASE, immediateRender: false, scrollTrigger: st(el, 'top 92%', 'top 70%', 1.5) },
                    );
                });

                q('[data-anim="title"]').forEach((el) => {
                    gsap.fromTo(
                        el,
                        { y: 100, opacity: 0 },
                        { y: 0, opacity: 1, ease: EASE, immediateRender: false, scrollTrigger: st(el, 'top 90%', end, 2) },
                    );
                });

                q('[data-anim="subtitle"]').forEach((el) => {
                    gsap.fromTo(
                        el,
                        { y: 80, opacity: 0 },
                        { y: 0, opacity: 1, ease: EASE, immediateRender: false, scrollTrigger: st(el, start, end, 2) },
                    );
                });

                q('[data-anim="line"]').forEach((el) => {
                    gsap.fromTo(
                        el,
                        { scaleX: 0 },
                        {
                            scaleX: 1,
                            transformOrigin: 'left center',
                            ease: EASE,
                            immediateRender: false,
                            scrollTrigger: st(el, 'top 90%', 'top 65%', 1.5),
                        },
                    );
                });

                const items = q('[data-anim="item"]');
                if (items.length) {
                    gsap.fromTo(
                        items,
                        { y: 100, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            ease: EASE,
                            stagger: 0.08,
                            immediateRender: false,
                            scrollTrigger: st(items[0].parentElement || items[0], 'top 88%', 'top 55%', 2),
                        },
                    );

                    items.forEach((card) => {
                        const img = card.querySelector('[data-anim="img"]');
                        if (!img) return;
                        gsap.fromTo(
                            img,
                            { scale: 1.12 },
                            {
                                scale: 1,
                                ease: EASE,
                                immediateRender: false,
                                scrollTrigger: st(card, 'top 88%', 'top 55%', 2),
                            },
                        );
                    });
                }

                q('[data-anim="left"]').forEach((el) => {
                    gsap.fromTo(
                        el,
                        { x: -120, opacity: 0 },
                        { x: 0, opacity: 1, ease: EASE, immediateRender: false, scrollTrigger: st(el, 'top 75%', 'top 30%', 1.5) },
                    );
                });

                q('[data-anim="right"]').forEach((el) => {
                    gsap.fromTo(
                        el,
                        { x: 120, opacity: 0 },
                        { x: 0, opacity: 1, ease: EASE, immediateRender: false, scrollTrigger: st(el, 'top 75%', 'top 30%', 1.5) },
                    );
                });

                q('[data-anim="fade"]').forEach((el) => {
                    gsap.fromTo(
                        el,
                        { opacity: 0, y: 50 },
                        { opacity: 1, y: 0, ease: EASE, immediateRender: false, scrollTrigger: st(el, start, end, 2) },
                    );
                });

                q('[data-anim="scale"]').forEach((el) => {
                    gsap.fromTo(
                        el,
                        { y: 60, scale: 0.92, opacity: 0 },
                        { y: 0, scale: 1, opacity: 1, ease: EASE, immediateRender: false, scrollTrigger: st(el, 'top 88%', 'top 55%', 2) },
                    );
                });

                q('[data-anim="img"]').forEach((el) => {
                    if (el.closest('[data-anim="item"]')) return;
                    gsap.fromTo(
                        el,
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, ease: EASE, immediateRender: false, scrollTrigger: st(el, 'top 85%', end, 2) },
                    );
                });

                const badges = q('[data-anim="badge"]');
                if (badges.length) {
                    gsap.fromTo(
                        badges,
                        { y: 40, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            ease: EASE,
                            stagger: 0.06,
                            immediateRender: false,
                            scrollTrigger: st(badges[0].parentElement || badges[0], 'top 90%', 'top 65%', 1.5),
                        },
                    );
                }
            });

            // —— Mobile: toggle reverse, no scrub ——
            mm.add('(max-width: 1023px)', () => {
                const st = (trigger, s = start) => ({
                    trigger,
                    start: s,
                    toggleActions: 'play none none reverse',
                });

                const sections = root.matches('[data-anim="section"]')
                    ? [root]
                    : q('[data-anim="section"]');

                sections.forEach((el) => {
                    gsap.from(el, {
                        opacity: 0.75,
                        duration: 0.8,
                        ease: EASE,
                        scrollTrigger: st(el, 'top 92%'),
                    });
                });

                q('[data-anim="title"]').forEach((el) => {
                    gsap.from(el, {
                        y: 48,
                        opacity: 0,
                        duration: 0.85,
                        ease: EASE,
                        scrollTrigger: st(el, 'top 90%'),
                    });
                });

                q('[data-anim="subtitle"]').forEach((el) => {
                    gsap.from(el, {
                        y: 36,
                        opacity: 0,
                        duration: 0.8,
                        delay: 0.06,
                        ease: EASE,
                        scrollTrigger: st(el, start),
                    });
                });

                q('[data-anim="line"]').forEach((el) => {
                    gsap.from(el, {
                        scaleX: 0,
                        transformOrigin: 'left center',
                        duration: 0.7,
                        ease: EASE,
                        scrollTrigger: st(el, 'top 90%'),
                    });
                });

                const items = q('[data-anim="item"]');
                if (items.length) {
                    gsap.from(items, {
                        y: 40,
                        opacity: 0,
                        duration: 0.75,
                        ease: EASE,
                        stagger: 0.1,
                        scrollTrigger: st(items[0].parentElement || items[0], 'top 88%'),
                    });
                }

                q('[data-anim="left"]').forEach((el) => {
                    gsap.from(el, {
                        x: -40,
                        opacity: 0,
                        duration: 0.85,
                        ease: EASE,
                        scrollTrigger: st(el, 'top 80%'),
                    });
                });

                q('[data-anim="right"]').forEach((el) => {
                    gsap.from(el, {
                        x: 40,
                        opacity: 0,
                        duration: 0.85,
                        ease: EASE,
                        scrollTrigger: st(el, 'top 80%'),
                    });
                });

                q('[data-anim="fade"]').forEach((el) => {
                    gsap.from(el, {
                        opacity: 0,
                        y: 24,
                        duration: 0.7,
                        ease: EASE,
                        scrollTrigger: st(el, start),
                    });
                });

                q('[data-anim="scale"]').forEach((el) => {
                    gsap.from(el, {
                        y: 28,
                        scale: 0.97,
                        opacity: 0,
                        duration: 0.8,
                        ease: EASE,
                        scrollTrigger: st(el, 'top 88%'),
                    });
                });

                q('[data-anim="img"]').forEach((el) => {
                    if (el.closest('[data-anim="item"]')) return;
                    gsap.from(el, {
                        y: 24,
                        opacity: 0,
                        duration: 0.8,
                        ease: EASE,
                        scrollTrigger: st(el, 'top 85%'),
                    });
                });

                const badges = q('[data-anim="badge"]');
                if (badges.length) {
                    gsap.from(badges, {
                        y: 20,
                        opacity: 0,
                        duration: 0.6,
                        ease: EASE,
                        stagger: 0.06,
                        scrollTrigger: st(badges[0].parentElement || badges[0], 'top 90%'),
                    });
                }
            });
        }, root);

        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => ctx.revert();
    }, [start, end]);

    return rootRef;
}

/** Hero — load entrance + desktop collapse over fixed bg (scrub reverses on scroll up). */
export function useHeroAnim() {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        if (prefersReducedMotion()) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add('(max-width: 1023px)', () => {
                const mobile = root.querySelector('[data-hero="mobile"]');
                if (!mobile) return;
                const title = mobile.querySelector('[data-anim="hero-title"]');
                const widget = mobile.querySelector('[data-anim="hero-widget"]');
                const info = mobile.querySelector('[data-anim="hero-info"]');
                const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                if (title) tl.from(title, { y: 28, opacity: 0, duration: 0.75 }, 0.08);
                if (widget) tl.from(widget, { y: 32, opacity: 0, duration: 0.7 }, '-=0.4');
                if (info) tl.from(info, { y: 20, opacity: 0, duration: 0.55 }, '-=0.3');
            });

            mm.add('(min-width: 1024px)', () => {
                const desktop = root.querySelector('[data-hero="desktop"]');
                if (!desktop) return;
                const content = desktop.querySelector('[data-anim="hero-content"]');
                const title = desktop.querySelector('[data-anim="hero-title"]');
                const widget = desktop.querySelector('[data-anim="hero-widget"]');
                const info = desktop.querySelector('[data-anim="hero-info"]');

                const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                if (title) tl.from(title, { y: 72, opacity: 0, duration: 1.1 }, 0.2);
                if (widget) tl.from(widget, { y: 56, opacity: 0, duration: 0.95 }, '-=0.55');
                if (info) tl.from(info, { y: 40, opacity: 0, duration: 0.75 }, '-=0.4');

                if (content) {
                    gsap.fromTo(
                        content,
                        { y: 0, opacity: 1 },
                        {
                            y: -280,
                            opacity: 0,
                            ease: 'none',
                            immediateRender: false,
                            scrollTrigger: {
                                trigger: desktop,
                                start: 'top top',
                                end: 'bottom top',
                                scrub: 1,
                                invalidateOnRefresh: true,
                            },
                        },
                    );
                }
            });
        }, root);

        return () => ctx.revert();
    }, []);

    return rootRef;
}
