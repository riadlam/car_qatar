import SiteLayout from '../components/landing/SiteLayout';
import Hero from '../components/corporations/Hero';
import Breadcrumb from '../components/corporations/Breadcrumb';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import Testimonial from '../components/corporations/Testimonial';
import SeoSplit from '../components/corporations/SeoSplit';
import Awards from '../components/corporations/Awards';
import CalloutBanner from '../components/corporations/CalloutBanner';
import Benefits from '../components/corporations/Benefits';
import ContactForm from '../components/corporations/ContactForm';
import Faqs from '../components/corporations/Faqs';
import ScrollTop from '../components/corporations/ScrollTop';
import { CORP_IMG, REGISTER_HREF } from '../components/corporations/assets';

const SERVICE_CARDS = [
    {
        title: 'Business trips & meetings',
        body: 'Ensure punctual arrivals, seamless departures, and foster strong professional relationships at every meeting.',
        img: CORP_IMG.serviceBusiness,
    },
    {
        title: 'City-to-City travel',
        body: 'Effortlessly work while traveling City to City. Seamlessly travel between London to Manchester or Paris to Lyon, and more.',
        img: CORP_IMG.serviceCity,
        cta: 'Explore City-to-City',
        href: '#',
    },
    {
        title: 'Global airport transfers',
        body: 'Experience seamless airport pick-ups and drop-offs, making your corporate travels hassle-free.',
        img: CORP_IMG.serviceAirport,
    },
    {
        title: 'Client & partner travel',
        body: 'Impress clients and partners with exceptional chauffeur service, elevating their travel experience.',
        img: CORP_IMG.servicePartner,
    },
];

const SUSTAIN_CARDS = [
    {
        title: 'The new normal',
        body: 'Electric vehicles are naturally incorporated into our Business Class and First Class in many cities. Our goal is to continue making sustainable travel more easily accessible by growing our electric vehicle fleet.',
        img: CORP_IMG.sustainEv,
    },
    {
        title: '100% carbon offset',
        body: 'Whichever vehicle class you choose, we automatically offset the emissions with our carbon offset program.',
        img: CORP_IMG.sustainCarbon,
    },
];

const ARTICLE_CARDS = [
    {
        title: 'AL MAJD X Hudson Yards',
        body: "Discover AL MAJD's partnership with Hudson Yards in NYC.",
        img: CORP_IMG.articleHudson,
        cta: 'Read the story',
        href: '#',
        badge: 'NEW',
    },
    {
        title: 'Finding Flow in Business Travel: Report',
        body: 'Why better business travel improves performance.',
        img: CORP_IMG.articleFlow,
        cta: 'Read the whitepaper',
        href: '#',
    },
    {
        title: 'Travel trends report',
        body: 'Get an insight into how travel impacts productivity, backed with real data.',
        img: CORP_IMG.articleTrends,
        cta: 'Read the report',
        href: '#',
    },
];

export default function Corporations() {
    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title="Corporate chauffeur services for every occasion" cards={SERVICE_CARDS} />
            <CtaStrip label="Try our award-winning service" href="#get-in-touch" />
            <Testimonial />
            <SeoSplit
                title="A new level of chauffeur reliability"
                body="Our global network of locally licensed and insured chauffeurs ensures a seamless transportation experience for corporate travel. Check out our case studies of happy corporate customers to hear more."
                bullets={[
                    'Availability in 60+ countries',
                    'Skilled English-speaking chauffeurs',
                    'Real-time tracking and notifications',
                    'Modern fleet for a professional and productive travel',
                ]}
                image={CORP_IMG.seoReliability}
                alt="A suited chauffeur looks out the open window of the limo he is driving."
            />
            <SeoSplit
                title="A relief from chasing invoices"
                body="Simplify your bill management. Our automated invoicing system streamlines the process, while dedicated corporate support are ready to assist."
                bullets={[
                    'All-in-one platform for booking and reporting',
                    'Automated invoicing that saves time',
                    'Dedicated support & account managers',
                    'Enjoy corporate rebates & login access for 500+ travelers',
                ]}
                image={CORP_IMG.seoInvoicing}
                alt="Female passenger in backseat with phone; chauffeur holds door"
            />
            <CtaStrip label="Create an account" href={REGISTER_HREF} />
            <SeoSplit
                title="Booking for your executives"
                body="If you're a PA/EA or corporate booker that wants to manage your executive travel with ease using a booking platform designed for your fast-paced world, then you're in luck. We've dedicated a page to answer all your queries."
                image={CORP_IMG.seoBookers}
                alt="Stylish woman in back seat with shopping bags"
                link={{ label: 'Learn more here', href: '/business' }}
            />
            <SeoSplit
                title="By the hour"
                body="This service helps businesses globally. No more waiting for different taxis. Maximize your productivity with our by-the-hour service."
                image={CORP_IMG.seoHourly}
                alt="Chauffeur smiles and adjusts control while driving"
                link={{ label: 'by-the-hour service', href: '#' }}
            />
            <Awards />
            <CalloutBanner />
            <CardCarousel title="Sustainability initiatives" cards={SUSTAIN_CARDS} />
            <Benefits />
            <CardCarousel title="Check out our latest articles" cards={ARTICLE_CARDS} panel={false} />
            <ContactForm />
            <Faqs />
            <ScrollTop />
        </SiteLayout>
    );
}
