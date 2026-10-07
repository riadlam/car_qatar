import { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SP_IMG } from './assets';

function BenefitRow({ items }) {
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

    return (
        <div>
            <div
                ref={scrollerRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
                {items.map((b) => (
                    <article
                        key={b.title}
                        className="w-[min(85vw,300px)] shrink-0 snap-center rounded-2xl border border-[#e8e8ea] bg-white px-6 py-10 lg:w-auto"
                    >
                        <img src={b.icon} alt="" className="mb-5 h-16 w-16" loading="lazy" />
                        <h3 className="font-geist m-0 text-[20px] leading-7 font-500 tracking-[0.15px] text-ink-text">
                            {b.title}
                        </h3>
                        <p className="font-geist mt-3 m-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-muted">
                            {b.body}
                        </p>
                    </article>
                ))}
            </div>
            <div className="mt-5 flex justify-center gap-2 lg:hidden">
                {items.map((b, i) => (
                    <span
                        key={b.title}
                        className={`h-2 w-2 rounded-full ${index === i ? 'bg-wine-700' : 'bg-wine-700/25'}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Benefits() {
    const { t } = useTranslation('marketing');

    const rows = useMemo(
        () => [
            [
                {
                    icon: SP_IMG.iconGlobal,
                    title: t('strategicPartnerships.benefitsGrid.coverage.title'),
                    body: t('strategicPartnerships.benefitsGrid.coverage.body'),
                },
                {
                    icon: SP_IMG.iconShield,
                    title: t('strategicPartnerships.benefitsGrid.compliance.title'),
                    body: t('strategicPartnerships.benefitsGrid.compliance.body'),
                },
                {
                    icon: SP_IMG.iconTeam,
                    title: t('strategicPartnerships.benefitsGrid.support.title'),
                    body: t('strategicPartnerships.benefitsGrid.support.body'),
                },
            ],
            [
                {
                    icon: SP_IMG.iconCurrency,
                    title: t('strategicPartnerships.benefitsGrid.pricing.title'),
                    body: t('strategicPartnerships.benefitsGrid.pricing.body'),
                },
                {
                    icon: SP_IMG.iconKey,
                    title: t('strategicPartnerships.benefitsGrid.custom.title'),
                    body: t('strategicPartnerships.benefitsGrid.custom.body'),
                },
                {
                    icon: SP_IMG.iconFootprint,
                    title: t('strategicPartnerships.benefitsGrid.sustain.title'),
                    body: t('strategicPartnerships.benefitsGrid.sustain.body'),
                },
            ],
        ],
        [t],
    );

    return (
        <section className="bg-page px-6 py-12 lg:px-12 lg:py-16">
            <div className="mx-auto max-w-[1170px]">
                <h2 className="font-fragment m-0 mb-10 text-center text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10 lg:mb-12 lg:text-[40px] lg:leading-[48px]">
                    {t('strategicPartnerships.benefitsGrid.title')}
                </h2>
                <div className="flex flex-col gap-8 lg:gap-12">
                    {rows.map((row, i) => (
                        <BenefitRow key={i} items={row} />
                    ))}
                </div>
            </div>
        </section>
    );
}
