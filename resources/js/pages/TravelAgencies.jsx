import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import ScrollTop from '../components/corporations/ScrollTop';
import Benefits from '../components/travelAgencies/Benefits';
import ContactForm from '../components/travelAgencies/ContactForm';
import Faqs from '../components/travelAgencies/Faqs';
import { TA_IMG, REGISTER_HREF } from '../components/travelAgencies/assets';

const SERVICE_CARDS = [
    {
        title: 'Award-winning quality',
        body: 'Won the "Best Global Chauffeur Services Company" by Magellan Awards, and "Best on the Road" by Travolution Awards.',
        img: TA_IMG.serviceAward,
    },
    {
        title: 'Ease of booking',
        body: "Prioritize your clients' duty of care with our rigorously trained chauffeurs, and hygiene protocols.",
        img: TA_IMG.serviceEase,
    },
    {
        title: 'Global yet local',
        body: 'Offer a globally consistent service with a local flavor, ensuring comfort and convenience across borders.',
        img: TA_IMG.serviceGlobal,
    },
    {
        title: 'Carbon offset travel',
        body: 'Progress towards sustainable tourism by providing the green travel option of electric vehicles in select cities.',
        img: TA_IMG.serviceCarbon,
    },
];

const FLEET_CARDS = [
    {
        title: 'Fit for solo or group travel',
        body: "Whether your client's party size one or many, our service adapts. We effortlessly accommodate groups in select cities, ensuring seamless transit.",
        img: TA_IMG.fleetSolo,
    },
    {
        title: 'Memorable amenities',
        body: 'Our service is designed to make all kinds of travel smooth. Each car is added with complimentary waiting time, water, charging cables, and the ease of Meet and Greet too.',
        img: TA_IMG.fleetAmenities,
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
                    Global Chauffeur Services for Travel Agencies
                </h1>
            </section>
            <div className="relative z-0 w-full overflow-hidden">
                <img
                    src={TA_IMG.hero}
                    alt="A two-tone Mercedes EQS serving as an AL MAJD limo is parked outside an elegant building on a city street."
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
                <li aria-current="page">Global Chauffeur Services for Travel Agencies</li>
            </ol>
        </nav>
    );
}

function Testimonial() {
    return (
        <section className="bg-[#f5f5f5] px-6 py-16 text-center lg:px-12 lg:py-20">
            <div className="mx-auto max-w-[900px]">
                <blockquote className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-wine-700 sm:text-[28px] sm:leading-9 lg:text-[32px] lg:leading-10">
                    &ldquo;We especially value the speed of booking and cost efficiency. We always
                    include AL MAJD in our corporate pitches to new and existing clients.
                    All-around a very, very important supplier to us here.&rdquo;
                </blockquote>
                <p className="font-geist mt-8 m-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-muted">
                    David Strange, Corporate Director, EFR Travel Group
                </p>
            </div>
        </section>
    );
}

function TaAwards() {
    const awards = [
        { src: TA_IMG.awardLux, alt: 'LUX Life Leaders in Luxury Awards' },
        { src: TA_IMG.awardTravel, alt: 'Business Travel Awards Europe 2024' },
        { src: TA_IMG.awardWorld, alt: 'World Travel Awards Winner' },
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

export default function TravelAgencies() {
    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title="Elevate Your Travel Agency Services" cards={SERVICE_CARDS} />
            <CalloutBanner
                title="Transform your clients' travel"
                body="Partner with AL MAJD and enhance your agency's travel offerings."
                cta="Create your account"
                href={REGISTER_HREF}
            />
            <Testimonial />
            <SeoSplit
                imageOn="right"
                title="Additional revenue and commission, without the hassle"
                body="AL MAJD's partnership model presents you an opportunity to generate additional revenue without having to manage the end-to-end operations, making it a profitable addition to your portfolio."
                bullets={[
                    'Stress-free additional revenue streams',
                    'Predictable income with our commission model',
                    'No operational overhead costs',
                ]}
                image={TA_IMG.seoRevenue}
                alt="Business traveler with phone"
            />
            <SeoSplit
                imageOn="right"
                title="Vehicles ready for all occasions"
                body="Your clients can travel in comfort with our modern fleet with a range of vehicles, including stand-outs like Jaguar I-PACE and Mercedes EQE. Expect top-tier amenities - from umbrellas for rainy days to complimentary water, refreshments, charging cables and Wi-Fi."
                bullets={[
                    'High-end fleet',
                    'Electric vehicles through the fleet',
                    'Signature Meet & Greet service',
                ]}
                image={TA_IMG.seoVehicles}
                alt="Premium chauffeur vehicle"
            />
            <SeoSplit
                imageOn="right"
                title="Deliver top-notch client satisfaction"
                body="We prioritize exceeding client expectations while providing them quality, safe, and sustainable travel options. Bring these offerings to your clients, allowing you to make a positive impact on client satisfaction and brand loyalty."
                bullets={[
                    'Industry-leading quality',
                    'Environmentally-conscious travel options',
                    'Improvement of client loyalty',
                ]}
                image={TA_IMG.seoSatisfaction}
                alt="A glamorous couple laugh in the backseat of a limousine."
            />
            <SeoSplit
                imageOn="right"
                title="Boost your brand reputation"
                body="Partner with AL MAJD and be associated with a globally recognized and award-winning chauffeur service, which resonates positively with your clients and elevates your brand reputation."
                bullets={[
                    'Enhance your credibility',
                    'Increase client trust',
                    'Promote upgraded client experiences',
                ]}
                image={TA_IMG.seoReputation}
                alt="A woman steps out of an AL MAJD limo as a chauffeur holds open the door."
            />
            <CtaStrip label="Get in touch" href="#get-in-touch" />
            <CardCarousel title="Our modern fleet" cards={FLEET_CARDS} />
            <CalloutBanner
                title="Try it out"
                body="Start today and create your own account in minutes."
                cta="Open an account"
                href={REGISTER_HREF}
            />
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
                image={TA_IMG.seoIntegrations}
                alt="A slow-capture of a cityscape at sunset."
                cta={{ label: 'Learn more', href: '/business' }}
            />
            <SeoSplit
                imageOn="left"
                title="Check out our dedicated pages"
                image={TA_IMG.seoDedicated}
                alt="An AL MAJD Mercedes EQE speeds through the wooded countryside at sunset."
                bodyNode={
                    <div className="space-y-4">
                        <p className="m-0">
                            <a href="#" className="font-500 text-wine-700 underline-offset-2 hover:underline">
                                Leisure Travel Agency
                            </a>
                            : Delivering seamless airport transfers, personalized city tours, and
                            premium experiences for high-net-worth clients.
                        </p>
                        <p className="m-0">
                            <a href="#" className="font-500 text-wine-700 underline-offset-2 hover:underline">
                                Corporate Travel Agency
                            </a>
                            : Streamline business travel for your clients with global coverage,
                            reliable services, and seamless integration with booking tools.
                        </p>
                    </div>
                }
            />
            <Benefits />
            <ContactForm />
            <Faqs />
            <ScrollTop />
            <TaAwards />
        </SiteLayout>
    );
}
