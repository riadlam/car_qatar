import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import Benefits from '../components/strategicPartnerships/Benefits';
import { SP_IMG, PARTNERS_HREF } from '../components/strategicPartnerships/assets';

const PARTNER_CARDS = [
    {
        title: 'Aviation',
        body: 'Deliver market-leading chauffeur service for your First and Business Class guests.',
        img: SP_IMG.aviation,
        bullets: [
            'Rely on a trusted partner for top commercial airlines',
            'Serve your high-value airline guests globally',
            'Work with tailored solutions for complimentary, ancillary, and crew services',
        ],
    },
    {
        title: 'Cruise',
        body: "Elevate your guests' experience with a chauffeured transfer.",
        img: SP_IMG.cruise,
        bullets: [
            'Deliver your guests a seamless door-to-door experience',
            'Take advantage of our local expertise with port and airport pickups',
            'Fully white-label complimentary ride booking solution available',
        ],
    },
    {
        title: 'Financial services',
        body: 'Offer added-value benefits to your high net worth cardmembers.',
        img: SP_IMG.financial,
        bullets: [
            'Complimentary transfer booking for air travel',
            'Enhanced offerings for cardmember-paid services',
            'Support team experienced serving high-value customers in the financial sector',
        ],
    },
    {
        title: 'Hotel',
        body: 'Extend hospitality and provide exceptional travel experiences beyond the hotel doors.',
        img: SP_IMG.hotel,
        bullets: [
            'Treat your high-value guests to complimentary airport transfers',
            'Offer guests city excursions and tours using our by-the-hour service',
            'Rely on our global experience in serving travelers worldwide',
        ],
    },
];

function Hero() {
    return (
        <div
            id="top"
            className="relative mx-auto flex w-full min-w-[320px] flex-col bg-page pt-[72px] lg:pt-[88px]"
        >
            <section className="box-border mx-auto w-full max-w-[1170px] px-4 sm:px-6">
                <h1 className="font-fragment m-0 my-5 p-0 text-[32px] leading-10 font-400 tracking-[0.15px] text-ink-text md:text-[40px] md:leading-[48px] lg:text-[44px] lg:leading-[56px]">
                    Partnership Opportunities with AL MAJD
                </h1>
            </section>
            <div className="relative z-0 w-full overflow-hidden">
                <img
                    src={SP_IMG.hero}
                    alt="An AL MAJD chauffeur sits in the driver's seat of a limousine, smiling and looking over his shoulder into the back seat."
                    loading="eager"
                    className="block h-[264px] w-full object-cover object-center md:h-[370px] min-[1200px]:h-[400px] min-[1440px]:h-[550px]"
                />
            </div>
        </div>
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
                <li aria-current="page">Partnership Opportunities with AL MAJD</li>
            </ol>
        </nav>
    );
}

function Awards() {
    const awards = [
        { src: SP_IMG.awardLux, alt: 'LUX Life Leaders in Luxury Awards' },
        { src: SP_IMG.awardTravel, alt: 'Business Travel Awards Europe 2024' },
        { src: SP_IMG.awardWorld, alt: 'World Travel Awards Winner' },
    ];
    return (
        <section className="bg-page px-6 py-12 text-center lg:px-12 lg:py-16">
            <div className="mx-auto max-w-[1170px]">
                <p className="font-geist m-0 mb-8 text-[16px] leading-6 font-500 tracking-[0.15px] text-ink-text lg:text-[18px]">
                    Award-winning chauffeur service
                </p>
                <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-0">
                    {awards.map((a, i) => (
                        <div key={a.alt} className="flex items-center">
                            {i > 0 && (
                                <div
                                    className="mx-8 hidden h-20 w-px bg-[#aeaeae] lg:block"
                                    aria-hidden="true"
                                />
                            )}
                            <img src={a.src} alt={a.alt} className="h-20 w-auto object-contain" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function StrategicPartnerships() {
    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title="Become an AL MAJD partner" cards={PARTNER_CARDS} />
            <Benefits />
            <SeoSplit
                imageOn="left"
                title="Explore our API integrations"
                body="From instant bookings to streamlined cancellations, our cutting-edge integrations with global booking platforms make corporate travel effortless. Sync, scale, and simplify—without missing a beat."
                bullets={[
                    {
                        lead: 'Global GDS integration:',
                        text: 'Book and manage trips via Sabre, Amadeus, and Travelport with full functionality.',
                    },
                    {
                        lead: 'Top OBT compatibility:',
                        text: 'Leverage tools like SAP Concur and Navan for real-time bookings, directly integrated into your existing workflows.',
                    },
                    {
                        lead: 'Instant access, real-time updates:',
                        text: 'Live pricing, availability, and trip details keep you in control and your clients on track, no matter the destination.',
                    },
                ]}
                image={SP_IMG.seoApi}
                alt="A slow-capture of a cityscape at sunset."
                cta={{ label: 'Learn more', href: '/business' }}
            />
            <Awards />
            <CalloutBanner
                title="Join as a chauffeur partner today."
                body="Own or manage premium vehicles? Let's talk."
                cta="Become a chauffeur partner"
                href={PARTNERS_HREF}
            />
        </SiteLayout>
    );
}
