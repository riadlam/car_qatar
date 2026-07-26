import { useRef, useState, useEffect } from 'react';
import { CORP_IMG } from './assets';

const ROWS = [
    [
        {
            icon: CORP_IMG.iconCurrency,
            title: 'Competitive pricing',
            body: 'Access premium service at distance-based prices that are fair to you and our chauffeurs.',
        },
        {
            icon: CORP_IMG.iconGlobal,
            title: 'Global availability',
            body: 'Our worldwide chauffeur service guarantees prompt and reliable travel.',
        },
        {
            icon: CORP_IMG.iconCheck,
            title: 'Priority dispatching',
            body: 'Streamline your experience with priority bookings and real-time tracking.',
        },
    ],
    [
        {
            icon: CORP_IMG.iconTime,
            title: 'Easy booking',
            body: 'Easy one-page booking, with instant confirmation and transparent pricing.',
        },
        {
            icon: CORP_IMG.iconSupport,
            title: 'Corporate support',
            body: 'Our multilingual, 24/7 support team ensures corporate clients are covered around the clock.',
        },
        {
            icon: CORP_IMG.iconEco,
            title: 'Electric vehicle option',
            body: 'We proudly offer an array of EVs in select cities, and ensure our carbon footprint is offset!',
        },
    ],
];

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
    return (
        <section id="benefits" className="bg-page px-6 py-12 lg:px-12 lg:py-16">
            <div className="mx-auto max-w-[1170px]">
                <h2 className="font-fragment m-0 mb-10 text-center text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10 lg:mb-12 lg:text-[40px] lg:leading-[48px]">
                    Experience our corporate benefits
                </h2>
                <div className="flex flex-col gap-8 lg:gap-12">
                    {ROWS.map((row, i) => (
                        <BenefitRow key={i} items={row} />
                    ))}
                </div>
            </div>
        </section>
    );
}
