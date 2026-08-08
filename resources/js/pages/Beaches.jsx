import { useEffect, useState } from 'react';
import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import ScrollTop from '../components/corporations/ScrollTop';
import DestinationScheduler from '../components/explore/DestinationScheduler';
import { BEACH_IMG, BEACH_DESTINATIONS, BOOK_HREF } from '../components/beaches/assets';

const BEACH_CARDS = [
    {
        title: 'Katara Beach',
        body: 'West Bay Lagoon sand and cafés — curb-side drop-off so the day starts on the shore.',
        img: BEACH_IMG.katara,
    },
    {
        title: 'Sealine Beach',
        body: 'Mesaieed dunes meet the Gulf. Ideal for a day trip with a waiting chauffeur.',
        img: BEACH_IMG.sealine,
    },
    {
        title: 'Simaisma Beach',
        body: 'North-coast calm — family-friendly sands with a smooth hotel-to-beach transfer.',
        img: BEACH_IMG.simaisma,
    },
    {
        title: 'Fuwairit Beach',
        body: 'North Qatar stretch for quieter mornings — punctual pickup when the tide turns.',
        img: BEACH_IMG.fuwairit,
    },
    {
        title: 'Ras Abrouq (Zekreet)',
        body: 'West-coast cliffs and desert shoreline — scenic day rides with local chauffeurs.',
        img: BEACH_IMG.rasAbrouq,
    },
    {
        title: 'Marsa Malaz Beach',
        body: 'The Pearl’s resort beach — lobby to lounger without parking stress.',
        img: BEACH_IMG.marsaMalaz,
    },
    {
        title: 'Four Seasons Doha Beach',
        body: 'West Bay resort shoreline — airport Meet & Greet then straight to the sand.',
        img: BEACH_IMG.fourSeasons,
    },
    {
        title: 'Banana Island Resort',
        body: 'Private-island escape — coordinated transfers to the boat and back to the city.',
        img: BEACH_IMG.bananaIsland,
    },
];

function HeroScheduler({ stacked = false }) {
    return (
        <DestinationScheduler
            destinations={BEACH_DESTINATIONS}
            destinationLabel="Beach / resort"
            destinationPlaceholder="Search beaches & resorts in Qatar…"
            pickupPlaceholder="Address, airport, hotel, ..."
            service="one_way"
            title="Schedule your beach transfer"
            subtitle="Pick a Qatar beach or resort, set pickup time, and view chauffeur options."
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
            <section id="top" className="bg-white" aria-label="Beaches and resorts in Qatar">
                <div
                    className="relative flex min-h-[100svh] flex-col justify-center rounded-b-[16px] bg-cover bg-center px-3 py-4 pt-[72px]"
                    style={{
                        backgroundImage: `url(${BEACH_IMG.hero})`,
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
                                Beaches and resorts
                            </h1>
                            <p className="font-geist mt-1.5 m-0 text-[15px] leading-6 font-500 tracking-[0.15px] text-white/90 sm:text-[18px] sm:leading-7">
                                Chauffeur transfers to Qatar&apos;s shores and resorts.
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
        <section id="top" className="bg-white pb-8 lg:pb-10" aria-label="Beaches and resorts in Qatar">
            <div className="relative">
                <div
                    className="relative flex min-h-[90svh] flex-col rounded-b-[16px] bg-cover bg-center pt-[120px] lg:min-h-[92svh] lg:pt-[132px]"
                    style={{
                        backgroundImage: `url(${BEACH_IMG.hero})`,
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
                                Beaches and resorts
                            </h1>
                            <p className="font-geist m-0 text-[24px] leading-8 font-500 tracking-[0.15px] text-white lg:text-[30px] lg:leading-10">
                                Hotel to shoreline — chauffeured day trips across Qatar&apos;s beaches
                                and island resorts.
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
                <li aria-current="page">Beaches and resorts</li>
            </ol>
        </nav>
    );
}

export default function Beaches() {
    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title="Shores and resorts we drive to daily" cards={BEACH_CARDS} />
            <CalloutBanner
                title="Skip the parking — keep the sea view"
                body="Curb-side drop-off at beaches and resorts, then a calm ride back when you’re ready."
                cta="Schedule a transfer"
                href="#schedule"
            />
            <SeoSplit
                imageOn="right"
                title="Arrive at the sand, not the car park"
                body="From Katara Beach to Sealine and Banana Island, we time your transfer so you step out ready — towels optional, logistics handled."
                bullets={[
                    'Beach and resort entrance drop-offs across Qatar',
                    'Hotel-to-beach and beach-to-hotel transfers',
                    'Hamad Airport links for same-day coastal trips',
                ]}
                image={BEACH_IMG.seoBeach}
                alt="Beach destination in Qatar"
            />
            <SeoSplit
                imageOn="left"
                title="Resort day, one chauffeur"
                body="Planning Sealine then a West Bay dinner? Use by-the-hour service and keep the same vehicle for a seamless coastal day."
                bullets={[
                    'By-the-hour beach and resort itineraries',
                    'Flexible wait-and-return options',
                    'Local chauffeurs who know Mesaieed, Lusail, and Pearl access',
                ]}
                image={BEACH_IMG.seoTransfer}
                alt="Resort transfer in Qatar"
                cta={{ label: 'Book by the hour', href: '/?service=by_hour#book' }}
            />
            <SeoSplit
                imageOn="right"
                title="Island and lagoon escapes without the logistics"
                body="Premium fleet and clear pricing before you confirm — built for guests who want Qatar’s shoreline, not the route planning."
                bullets={[
                    'Punctual morning and sunset runs',
                    'Complimentary waiting time on transfers',
                    'Discreet service for families and VIP resort stays',
                ]}
                image={BEACH_IMG.seoResort}
                alt="Coastal resort day in Qatar"
            />
            <CtaStrip label="Schedule your beach transfer" href="#schedule" />
            <CalloutBanner
                title="Ready when you are"
                body="Choose a beach or resort above, or start from the homepage booking widget for any trip type."
                cta="Back to booking"
                href={BOOK_HREF}
            />
            <ScrollTop />
        </SiteLayout>
    );
}
