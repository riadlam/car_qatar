import { useRef, useState, useEffect } from 'react';

/**
 * Horizontal scroll-snap card row (services / sustainability / articles).
 */
export default function CardCarousel({ title, cards, panel = true }) {
    const scrollerRef = useRef(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return undefined;
        const onScroll = () => {
            const children = [...el.children];
            if (!children.length) return;
            const mid = el.scrollLeft + el.clientWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            children.forEach((c, i) => {
                const center = c.offsetLeft + c.offsetWidth / 2;
                const d = Math.abs(center - mid);
                if (d < bestDist) {
                    bestDist = d;
                    best = i;
                }
            });
            setIndex(best);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (i) => {
        const el = scrollerRef.current;
        const child = el?.children?.[i];
        if (!el || !child) return;
        child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    return (
        <section className="bg-page px-6 py-12 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-[1170px]">
                {title ? (
                    <h2 className="font-fragment m-0 mb-8 text-center text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10 lg:mb-10 lg:text-[40px] lg:leading-[48px]">
                        {title}
                    </h2>
                ) : null}

                <div
                    ref={scrollerRef}
                    className={`flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory lg:grid lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden ${
                        cards.length === 2
                            ? 'lg:grid-cols-2'
                            : cards.length === 3
                              ? 'lg:grid-cols-3'
                              : 'lg:grid-cols-4'
                    }`}
                >
                    {cards.map((c) => (
                        <article
                            key={c.title}
                            className={`w-[min(85vw,320px)] shrink-0 snap-center overflow-hidden rounded-2xl bg-white lg:w-auto ${
                                panel ? 'border border-[#e8e8ea] shadow-sm' : 'border border-[#e8e8ea]'
                            }`}
                        >
                            <div className="relative h-[116px] w-full overflow-hidden">
                                <img
                                    src={c.img}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                                {c.badge ? (
                                    <span className="font-geist absolute top-3 left-3 rounded-full bg-wine-700 px-2.5 py-0.5 text-[12px] font-500 tracking-[0.15px] text-white">
                                        {c.badge}
                                    </span>
                                ) : null}
                            </div>
                            <div className="p-5">
                                <h3 className="font-geist m-0 text-[18px] leading-6 font-500 tracking-[0.15px] text-ink-text">
                                    {c.title}
                                </h3>
                                <p className="font-geist mt-2 m-0 text-[14px] leading-5 font-400 tracking-[0.15px] text-muted">
                                    {c.body}
                                </p>
                                {c.bullets?.length ? (
                                    <ul className="font-geist mt-3 m-0 list-none space-y-2 p-0 text-[13px] leading-5 text-ink-text/80">
                                        {c.bullets.map((b) => (
                                            <li key={b} className="flex gap-2">
                                                <span className="mt-0.5 shrink-0 text-wine-700" aria-hidden="true">
                                                    ✓
                                                </span>
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                                {c.cta ? (
                                    <a
                                        href={c.href || '#'}
                                        className="font-geist mt-4 inline-block text-[14px] font-500 text-wine-700 underline-offset-2 hover:underline"
                                    >
                                        {c.cta}
                                    </a>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-6 flex justify-center gap-2 lg:hidden">
                    {cards.map((c, i) => (
                        <button
                            key={c.title}
                            type="button"
                            aria-label={`Go to card ${i + 1}`}
                            onClick={() => scrollTo(i)}
                            className={`h-2 w-2 rounded-full transition ${
                                index === i ? 'bg-wine-700' : 'bg-wine-700/25'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
