import { useEffect, useState } from 'react';
import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import ScrollTop from '../components/corporations/ScrollTop';
import DestinationScheduler from '../components/explore/DestinationScheduler';
import { IP_IMG, ICONIC_DESTINATIONS, BOOK_HREF } from '../components/iconicPlaces/assets';

const PLACE_CARDS = [
    {
        title: 'Museum of Islamic Art',
        body: 'I.M. Pei’s masterpiece on the Corniche — arrive with time to spare and leave the logistics to your chauffeur.',
        img: IP_IMG.mia,
    },
    {
        title: 'Souq Waqif',
        body: 'Narrow lanes, spice stalls, and evening energy. Door-to-door drop-off at the heart of old Doha.',
        img: IP_IMG.souq,
    },
    {
        title: 'Katara Cultural Village',
        body: 'Amphitheatre, galleries, and waterfront dining — a calm transfer for a full cultural afternoon.',
        img: IP_IMG.katara,
    },
    {
        title: 'The Pearl Qatar',
        body: 'Marina promenades and boutique streets. Ideal for shopping stops or a sunset stroll.',
        img: IP_IMG.pearl,
    },
    {
        title: 'National Museum of Qatar',
        body: 'Jean Nouvel’s desert rose — punctual Meet & Greet so your visit starts on schedule.',
        img: IP_IMG.nationalMuseum,
    },
    {
        title: 'Doha Corniche',
        body: 'Skyline views along the waterfront. Perfect as a scenic link between hotels and landmarks.',
        img: IP_IMG.corniche,
    },
    {
        title: 'Lusail',
        body: 'Boulevard, marina, and stadium district — modern Qatar, chauffeured end to end.',
        img: IP_IMG.lusail,
    },
    {
        title: 'Education City',
        body: 'Campuses and museums in Al Rayyan. Reliable transfers for visitors and conferences.',
        img: IP_IMG.educationCity,
    },
];

function HeroScheduler({ stacked = false }) {
    return (
        <DestinationScheduler
            destinations={ICONIC_DESTINATIONS}
            destinationLabel="Iconic place"
            destinationPlaceholder="Search iconic places…"
            pickupPlaceholder="Address, airport, hotel, ..."
            service="tourist_trip"
            title="Schedule your visit"
            subtitle="Select a landmark, set your pickup, and view chauffeur options."
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
            <section id="top" className="bg-white" aria-label="Iconic places in Qatar">
                <div
                    className="relative flex min-h-[100svh] flex-col justify-center rounded-b-[16px] bg-cover bg-center px-3 py-4 pt-[72px]"
                    style={{
                        backgroundImage: `url(${IP_IMG.hero})`,
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
                                Iconic places in Qatar
                            </h1>
                            <p className="font-geist mt-1.5 m-0 text-[15px] leading-6 font-500 tracking-[0.15px] text-white/90 sm:text-[18px] sm:leading-7">
                                Chauffeured visits to Doha&apos;s landmarks.
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
        <section id="top" className="bg-white pb-8 lg:pb-10" aria-label="Iconic places in Qatar">
            <div className="relative">
                <div
                    className="relative flex min-h-[90svh] flex-col rounded-b-[16px] bg-cover bg-center pt-[120px] lg:min-h-[92svh] lg:pt-[132px]"
                    style={{
                        backgroundImage: `url(${IP_IMG.hero})`,
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
                                Iconic places in Qatar
                            </h1>
                            <p className="font-geist m-0 text-[24px] leading-8 font-500 tracking-[0.15px] text-white lg:text-[30px] lg:leading-10">
                                Chauffeured visits to Doha&apos;s landmarks — museums, souqs, and
                                waterfront icons.
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
                <li aria-current="page">Iconic places in Qatar</li>
            </ol>
        </nav>
    );
}

export default function IconicPlaces() {
    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title="Landmarks worth the ride" cards={PLACE_CARDS} />
            <CalloutBanner
                title="See Qatar without the parking hunt"
                body="Your chauffeur knows the drop-off points — you keep the afternoon for the visit."
                cta="Schedule a visit"
                href="#schedule"
            />
            <SeoSplit
                imageOn="right"
                title="Arrive composed at every landmark"
                body="Whether it’s a museum opening or an evening at the Souq, we time your transfer so you step out ready — water, Wi-Fi, and waiting time included."
                bullets={[
                    'Punctual drop-off at major Doha attractions',
                    'Flight and hotel pickups across Qatar',
                    'Meet & Greet available for Hamad Airport',
                ]}
                image={IP_IMG.seoArrive}
                alt="Chauffeur assisting a guest from a premium vehicle"
            />
            <SeoSplit
                imageOn="left"
                title="Link several places in one booking"
                body="Planning Katara, then The Pearl, then dinner? Use by-the-hour service and keep the same chauffeur for a seamless day of icons."
                bullets={[
                    'By-the-hour city itineraries',
                    'Flexible multi-stop routes',
                    'Local chauffeurs who know Doha traffic patterns',
                ]}
                image={IP_IMG.seoHourly}
                alt="Premium vehicle on a city route"
                cta={{ label: 'Book by the hour', href: '/?service=by_hour#book' }}
            />
            <SeoSplit
                imageOn="right"
                title="Travel between hotel and icon in quiet comfort"
                body="High-end fleet, discreet service, and a booking flow built for visitors who want landmarks — not logistics."
                bullets={[
                    'Modern premium vehicles',
                    'Complimentary waiting time on transfers',
                    'Clear pricing before you confirm',
                ]}
                image={IP_IMG.seoMeet}
                alt="Luxury vehicle interior"
            />
            <CtaStrip label="Schedule your iconic visit" href="#schedule" />
            <CalloutBanner
                title="Ready when you are"
                body="Pick a landmark above, or start from the homepage booking widget for any trip type."
                cta="Back to booking"
                href={BOOK_HREF}
            />
            <ScrollTop />
        </SiteLayout>
    );
}
