import { useEffect, useState } from 'react';
import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import ScrollTop from '../components/corporations/ScrollTop';
import DestinationScheduler from '../components/explore/DestinationScheduler';
import { MALL_IMG, MALL_DESTINATIONS, BOOK_HREF } from '../components/malls/assets';

const MALL_CARDS = [
    {
        title: 'Place Vendôme Mall',
        body: 'Lusail’s grand shopping destination — porte-cochère drop-off without the parking hunt.',
        img: MALL_IMG.placeVendome,
    },
    {
        title: 'Mall of Qatar',
        body: 'Al Rayyan’s mega-mall. Family days and evening runs with a chauffeur who knows the entrances.',
        img: MALL_IMG.mallOfQatar,
    },
    {
        title: 'Doha Festival City',
        body: 'Retail, dining, and entertainment in one stop — timed transfers from hotel or Hamad Airport.',
        img: MALL_IMG.festivalCity,
    },
    {
        title: 'Villaggio Mall',
        body: 'Al Waab classic — Venetian canals, boutiques, and easy curb-side pickup when you’re done.',
        img: MALL_IMG.villaggio,
    },
    {
        title: 'Lagoona Mall',
        body: 'West Bay Lagoon shopping — short hops from nearby hotels and the Corniche.',
        img: MALL_IMG.lagoona,
    },
    {
        title: 'Landmark Mall',
        body: 'Al Gharrafa favourite for everyday shopping — reliable drop-off and wait options.',
        img: MALL_IMG.landmark,
    },
    {
        title: 'City Center Doha',
        body: 'West Bay convenience — mall, cinema, and dining linked to your hotel by chauffeur.',
        img: MALL_IMG.cityCenter,
    },
    {
        title: 'Souq Waqif',
        body: 'Old Doha’s shopping lanes — door-to-door so you skip circling for a spot.',
        img: MALL_IMG.souq,
    },
];

function HeroScheduler({ stacked = false }) {
    return (
        <DestinationScheduler
            destinations={MALL_DESTINATIONS}
            destinationLabel="Mall / shopping"
            destinationPlaceholder="Search malls in Qatar…"
            pickupPlaceholder="Address, airport, hotel, ..."
            service="one_way"
            title="Schedule your shopping transfer"
            subtitle="Pick a Doha mall, set pickup time, and view chauffeur options."
            stacked={stacked}
        />
    );
}

function useIsPhone() {
    const [isPhone, setIsPhone] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : true,
    );

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1023px)');
        const onChange = () => setIsPhone(mq.matches);
        onChange();
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    return isPhone;
}

function Hero() {
    const isPhone = useIsPhone();

    if (isPhone) {
        return (
            <section id="top" className="bg-white" aria-label="Malls and shopping in Qatar">
                <div
                    className="relative flex min-h-[100svh] flex-col justify-center rounded-b-[16px] bg-cover bg-center px-3 py-4 pt-[72px]"
                    style={{
                        backgroundImage: `url(${MALL_IMG.hero})`,
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                    }}
                >
                    <div
                        className="pointer-events-none absolute inset-0 rounded-b-[16px]"
                        style={{
                            background:
                                'linear-gradient(180deg, rgba(15,19,25,0.55) 0%, rgba(15,19,25,0.35) 45%, rgba(15,19,25,0.5) 100%)',
                        }}
                        aria-hidden="true"
                    />

                    <div className="relative z-10 flex w-full -translate-y-[4%] flex-col items-center gap-3 sm:max-w-xl sm:self-center sm:gap-4">
                        <div className="w-full px-1 text-center">
                            <h1 className="font-fragment m-0 text-[32px] leading-9 font-400 tracking-[0.25px] text-white sm:text-[40px] sm:leading-[48px]">
                                Malls and shopping
                            </h1>
                            <p className="font-geist mt-1.5 m-0 text-[15px] leading-6 font-500 tracking-[0.15px] text-white/90 sm:text-[18px] sm:leading-7">
                                Chauffeur transfers to Doha&apos;s malls and souqs.
                            </p>
                        </div>

                        <div className="w-full">
                            <HeroScheduler stacked />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="top" className="bg-white pb-8 lg:pb-10" aria-label="Malls and shopping in Qatar">
            <div className="relative">
                <div
                    className="relative flex min-h-[90svh] flex-col rounded-b-[16px] bg-cover bg-center pt-[120px] lg:min-h-[92svh] lg:pt-[132px]"
                    style={{
                        backgroundImage: `url(${MALL_IMG.hero})`,
                        backgroundPosition: 'center top',
                        backgroundSize: 'cover',
                    }}
                >
                    <div
                        className="pointer-events-none absolute inset-0 rounded-b-[16px]"
                        style={{
                            background:
                                'linear-gradient(180deg, rgba(15,19,25,0.5) 0%, transparent 38%), linear-gradient(0deg, rgba(15,19,25,0.72) 0%, transparent 52%)',
                        }}
                        aria-hidden="true"
                    />

                    <div className="relative z-[1] mt-auto flex w-full flex-col items-center px-6 pb-32 text-center lg:pb-36">
                        <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-3 lg:gap-4">
                            <h1 className="font-fragment m-0 text-[56px] leading-[64px] font-400 tracking-[0.25px] text-white lg:text-[72px] lg:leading-[80px]">
                                Malls and shopping
                            </h1>
                            <p className="font-geist m-0 text-[24px] leading-8 font-500 tracking-[0.15px] text-white lg:text-[30px] lg:leading-10">
                                Hotel to mall — chauffeured shopping trips across Doha, Lusail, and
                                beyond.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mx-auto -mt-20 w-full max-w-[1170px] px-6 lg:-mt-24 lg:px-8">
                    <HeroScheduler />
                </div>
            </div>
        </section>
    );
}

function Breadcrumb() {
    return (
        <nav aria-label="Breadcrumb" className="bg-page px-6 py-4 text-center lg:px-12">
            <ol className="font-geist m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0 text-[14px] leading-5 text-muted">
                <li>
                    <a href="/" className="text-ink-text transition hover:text-wine-700">
                        Home
                    </a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                    <span className="text-ink-text">Explore Qatar</span>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">Malls and shopping</li>
            </ol>
        </nav>
    );
}

export default function Malls() {
    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title="Shopping destinations we drive to daily" cards={MALL_CARDS} />
            <CalloutBanner
                title="Skip the parking — keep the shopping bags"
                body="Curb-side drop-off at major Doha malls, then a calm ride back to your hotel."
                cta="Schedule a transfer"
                href="#schedule"
            />
            <SeoSplit
                imageOn="right"
                title="Arrive at the entrance, not the car park"
                body="From Place Vendôme to Villaggio and Souq Waqif, we time your transfer so you step out at the right door — bags optional on the way home."
                bullets={[
                    'Mall entrance and porte-cochère drop-offs across Qatar',
                    'Hotel-to-mall and mall-to-hotel transfers',
                    'Hamad Airport links for same-day shopping trips',
                ]}
                image={MALL_IMG.seoShop}
                alt="Shopping destination in Doha"
            />
            <SeoSplit
                imageOn="left"
                title="Several malls in one booking"
                body="Planning Festival City then Mall of Qatar? Use by-the-hour service and keep the same chauffeur for a seamless retail day."
                bullets={[
                    'By-the-hour multi-mall itineraries',
                    'Flexible wait-and-return options',
                    'Local chauffeurs who know Doha traffic and mall access roads',
                ]}
                image={MALL_IMG.seoTransfer}
                alt="Major shopping mall in Qatar"
                cta={{ label: 'Book by the hour', href: '/?service=by_hour#book' }}
            />
            <SeoSplit
                imageOn="right"
                title="Evening shopping without the logistics"
                body="Premium fleet, clear pricing before you confirm — built for visitors who want Doha’s malls, not the parking levels."
                bullets={[
                    'Punctual evening and weekend runs',
                    'Complimentary waiting time on transfers',
                    'Discreet service for families and VIP shopping',
                ]}
                image={MALL_IMG.seoEvening}
                alt="Evening shopping transfer in Doha"
            />
            <CtaStrip label="Schedule your shopping transfer" href="#schedule" />
            <CalloutBanner
                title="Ready when you are"
                body="Choose a mall above, or start from the homepage booking widget for any trip type."
                cta="Back to booking"
                href={BOOK_HREF}
            />
            <ScrollTop />
        </SiteLayout>
    );
}
