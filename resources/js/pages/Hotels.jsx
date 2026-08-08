import { useEffect, useState } from 'react';
import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import ScrollTop from '../components/corporations/ScrollTop';
import DestinationScheduler from '../components/explore/DestinationScheduler';
import { HOTEL_IMG, HOTEL_DESTINATIONS, BOOK_HREF } from '../components/hotels/assets';

const HOTEL_CARDS = [
    {
        title: 'Four Seasons Hotel Doha',
        body: 'West Bay waterfront icon — airport Meet & Greet and lobby drop-off timed to your check-in.',
        img: HOTEL_IMG.fourSeasons,
    },
    {
        title: 'The St. Regis Doha',
        body: 'Classic West Bay hospitality. Discreet chauffeur service for arrivals, dinners, and events.',
        img: HOTEL_IMG.stRegis,
    },
    {
        title: 'Mandarin Oriental, Doha',
        body: 'Msheireb elegance. Seamless transfers between the hotel, Corniche, and Hamad Airport.',
        img: HOTEL_IMG.mandarin,
    },
    {
        title: 'W Doha Hotel & Residences',
        body: 'West Bay energy — night outs, meetings, and early flights with the same reliable chauffeur.',
        img: HOTEL_IMG.wDoha,
    },
    {
        title: 'The Ritz-Carlton, Doha',
        body: 'Lagoon-side calm. Ideal for family days, beach clubs, and punctual airport runs.',
        img: HOTEL_IMG.ritz,
    },
    {
        title: 'Sharq Village & Spa',
        body: 'Corniche resort living — spa mornings and city evenings without parking stress.',
        img: HOTEL_IMG.sharq,
    },
    {
        title: 'Marsa Malaz Kempinski',
        body: 'The Pearl’s palace hotel. Marina dinners and island-style arrivals, chauffeured.',
        img: HOTEL_IMG.marsaMalaz,
    },
    {
        title: 'Banana Island Resort Doha',
        body: 'Private-island escape — coordinated transfers to the boat and back to the city.',
        img: HOTEL_IMG.bananaIsland,
    },
];

function HeroScheduler({ stacked = false }) {
    return (
        <DestinationScheduler
            destinations={HOTEL_DESTINATIONS}
            destinationLabel="Hotel"
            destinationPlaceholder="Search hotels in Qatar…"
            pickupPlaceholder="Address, airport, hotel, ..."
            service="one_way"
            title="Schedule your hotel transfer"
            subtitle="Pick your Doha hotel, set pickup time, and view chauffeur options."
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
            <section id="top" className="bg-white" aria-label="Hotels in Qatar">
                <div
                    className="relative flex min-h-[100svh] flex-col justify-center rounded-b-[16px] bg-cover bg-center px-3 py-4 pt-[72px]"
                    style={{
                        backgroundImage: `url(${HOTEL_IMG.hero})`,
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
                                Hotels in Qatar
                            </h1>
                            <p className="font-geist mt-1.5 m-0 text-[15px] leading-6 font-500 tracking-[0.15px] text-white/90 sm:text-[18px] sm:leading-7">
                                Chauffeur transfers to Doha&apos;s finest hotels.
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
        <section id="top" className="bg-white pb-8 lg:pb-10" aria-label="Hotels in Qatar">
            <div className="relative">
                <div
                    className="relative flex min-h-[90svh] flex-col rounded-b-[16px] bg-cover bg-center pt-[120px] lg:min-h-[92svh] lg:pt-[132px]"
                    style={{
                        backgroundImage: `url(${HOTEL_IMG.hero})`,
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
                                Hotels in Qatar
                            </h1>
                            <p className="font-geist m-0 text-[24px] leading-8 font-500 tracking-[0.15px] text-white lg:text-[30px] lg:leading-10">
                                Airport to lobby — chauffeured transfers across Doha&apos;s West Bay,
                                The Pearl, and beyond.
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
                <li aria-current="page">Hotels</li>
            </ol>
        </nav>
    );
}

export default function Hotels() {
    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title="Stay destinations we drive to daily" cards={HOTEL_CARDS} />
            <CalloutBanner
                title="From Hamad Airport to your hotel lobby"
                body="Flight tracking, Meet & Greet, and a calm ride — so check-in starts on time."
                cta="Schedule a transfer"
                href="#schedule"
            />
            <SeoSplit
                imageOn="right"
                title="Arrive at the porte-cochère, not the car park"
                body="Whether you’re staying in West Bay, The Pearl, or on Banana Island, we time your transfer so you step into the lobby ready — luggage handled, waiting time included."
                bullets={[
                    'Hotel lobby and porte-cochère drop-offs across Doha',
                    'Hamad International Airport Meet & Greet',
                    'Hotel-to-hotel and hotel-to-landmark rides',
                ]}
                image={HOTEL_IMG.seoLobby}
                alt="Luxury hotel interior in Doha"
            />
            <SeoSplit
                imageOn="left"
                title="One chauffeur for your full Qatar stay"
                body="Use by-the-hour service between your hotel, dinners, and meetings — same vehicle, same standard, no rebooking friction."
                bullets={[
                    'By-the-hour coverage from your hotel base',
                    'Flexible multi-stop evenings',
                    'Local chauffeurs who know West Bay and Pearl traffic',
                ]}
                image={HOTEL_IMG.seoTransfer}
                alt="Doha hotel waterfront at night"
                cta={{ label: 'Book by the hour', href: '/?service=by_hour#book' }}
            />
            <SeoSplit
                imageOn="right"
                title="Early flights, late arrivals — we keep the schedule"
                body="Premium fleet and clear pricing before you confirm. Built for guests who treat the hotel as home base in Qatar."
                bullets={[
                    'Punctual airport runs day and night',
                    'Complimentary waiting time on transfers',
                    'Discreet service for VIP and family travel',
                ]}
                image={HOTEL_IMG.seoAirport}
                alt="Premium hotel stay in Qatar"
            />
            <CtaStrip label="Schedule your hotel transfer" href="#schedule" />
            <CalloutBanner
                title="Ready when you are"
                body="Choose a hotel above, or start from the homepage booking widget for any trip type."
                cta="Back to booking"
                href={BOOK_HREF}
            />
            <ScrollTop />
        </SiteLayout>
    );
}
