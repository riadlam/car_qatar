import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import ScrollTop from '../components/corporations/ScrollTop';
import DestinationScheduler from '../components/explore/DestinationScheduler';
import { RESTAURANT_IMG, RESTAURANT_DESTINATIONS, BOOK_HREF } from '../components/restaurants/assets';
import { useExploreCategory } from '../hooks/useExploreCategory';

const RESTAURANT_CARDS = [
    {
        title: 'Balhambar',
        body: 'Corniche views and Gulf cuisine — curb-side drop-off before your table.',
        img: RESTAURANT_IMG.balhambar,
    },
    {
        title: 'Souq Waqif dining',
        body: 'Cafés and traditional restaurants — walk in without hunting for parking.',
        img: RESTAURANT_IMG.souqCafe,
    },
    {
        title: 'Hotel fine dining',
        body: 'Nobu, Hakkasan, Market by Jean-Georges — lobby to entrance, on time.',
        img: RESTAURANT_IMG.mandarin,
    },
    {
        title: 'Business lunch, West Bay',
        body: 'Tower-to-restaurant runs with a waiting chauffeur for the return.',
        img: RESTAURANT_IMG.westbay,
    },
    {
        title: 'Katara evenings',
        body: 'Cultural Village terraces — hotel pickup and a calm ride home.',
        img: RESTAURANT_IMG.katara,
    },
    {
        title: 'Msheireb Downtown',
        body: 'Contemporary dining clusters — drop at the door, skip the garage.',
        img: RESTAURANT_IMG.msheireb,
    },
    {
        title: 'Pearl waterfront',
        body: 'Porto Arabia and marina tables — chauffeured arrival for guests and clients.',
        img: RESTAURANT_IMG.dining1,
    },
    {
        title: 'Souq nights',
        body: 'Evening markets and rooftop spots — punctual pickup when dessert ends.',
        img: RESTAURANT_IMG.souqNight,
    },
];

function HeroScheduler({ stacked = false, explore }) {
    const { t } = useTranslation('marketing');
    return (
        <DestinationScheduler
            destinations={explore.destinations}
            selectedDestination={explore.selectedDestination}
            onDestinationChange={explore.setSelectedDestination}
            destinationLabel={t('explore.restaurants.destLabel')}
            destinationPlaceholder={t('explore.restaurants.destPlaceholder')}
            pickupPlaceholder={t('explore.scheduler.pickupPlaceholder')}
            service="one_way"
            title={t('explore.restaurants.scheduleTitle')}
            subtitle={t('explore.restaurants.scheduleSubtitle')}
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

function Hero({ explore }) {
    const { t } = useTranslation('marketing');
    const isPhone = useIsPhone();
    const heroTitle = t('explore.restaurants.title');
    const heroSubtitle = t('explore.restaurants.subtitle');

    if (isPhone) {
        return (
            <section id="top" className="bg-white" aria-label={heroTitle}>
                <div
                    className="relative flex min-h-[100svh] flex-col justify-center rounded-b-[16px] bg-cover bg-center px-3 py-4 pt-[72px]"
                    style={{
                        backgroundImage: `url(${RESTAURANT_IMG.hero})`,
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
                                {heroTitle}
                            </h1>
                            <p className="font-geist mt-1.5 m-0 text-[15px] leading-6 font-500 tracking-[0.15px] text-white/90 sm:text-[18px] sm:leading-7">
                                {heroSubtitle}
                            </p>
                        </div>

                        <div className="w-full">
                            <HeroScheduler stacked explore={explore} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="top" className="bg-white pb-8 lg:pb-10" aria-label={heroTitle}>
            <div className="relative">
                <div
                    className="relative flex min-h-[90svh] flex-col rounded-b-[16px] bg-cover bg-center pt-[120px] lg:min-h-[92svh] lg:pt-[132px]"
                    style={{
                        backgroundImage: `url(${RESTAURANT_IMG.hero})`,
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
                                {heroTitle}
                            </h1>
                            <p className="font-geist m-0 text-[24px] leading-8 font-500 tracking-[0.15px] text-white lg:text-[30px] lg:leading-10">
                                {heroSubtitle}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mx-auto -mt-20 w-full max-w-[1170px] px-6 lg:-mt-24 lg:px-8">
                    <HeroScheduler explore={explore} />
                </div>
            </div>
        </section>
    );
}

function Breadcrumb() {
    const { t } = useTranslation('marketing');
    return (
        <nav aria-label={t('common.breadcrumb')} className="bg-page px-6 py-4 text-center lg:px-12">
            <ol className="font-geist m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0 text-[14px] leading-5 text-muted">
                <li>
                    <a href="/" className="text-ink-text transition hover:text-wine-700">
                        {t('common.home')}
                    </a>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                    <span className="text-ink-text">{t('explore.qatar')}</span>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{t('explore.restaurants.title')}</li>
            </ol>
        </nav>
    );
}

export default function Restaurants() {
    const { t } = useTranslation('marketing');
    const explore = useExploreCategory('restaurant', RESTAURANT_CARDS, RESTAURANT_DESTINATIONS);

    return (
        <SiteLayout>
            <Hero explore={explore} />
            <Breadcrumb />
            <CardCarousel
                title={t('explore.restaurants.carouselTitle')}
                cards={explore.cards}
                onCardClick={explore.onCardClick}
            />
            <CalloutBanner
                title={t('explore.restaurants.calloutSee.title')}
                body={t('explore.restaurants.calloutSee.body')}
                cta={t('explore.restaurants.calloutSee.cta')}
                href="#schedule"
            />
            <SeoSplit
                imageOn="right"
                title={t('explore.restaurants.seoArrive.title')}
                body={t('explore.restaurants.seoArrive.body')}
                bullets={[
                    t('explore.restaurants.seoArrive.b1'),
                    t('explore.restaurants.seoArrive.b2'),
                    t('explore.restaurants.seoArrive.b3'),
                ]}
                image={RESTAURANT_IMG.seoLunch}
                alt={t('explore.restaurants.seoArrive.alt')}
            />
            <SeoSplit
                imageOn="left"
                title={t('explore.restaurants.seoHourly.title')}
                body={t('explore.restaurants.seoHourly.body')}
                bullets={[
                    t('explore.restaurants.seoHourly.b1'),
                    t('explore.restaurants.seoHourly.b2'),
                    t('explore.restaurants.seoHourly.b3'),
                ]}
                image={RESTAURANT_IMG.seoTransfer}
                alt={t('explore.restaurants.seoHourly.alt')}
                cta={{ label: t('common.bookByTheHour'), href: '/?service=by_hour#book' }}
            />
            <SeoSplit
                imageOn="right"
                title={t('explore.restaurants.seoMeet.title')}
                body={t('explore.restaurants.seoMeet.body')}
                bullets={[
                    t('explore.restaurants.seoMeet.b1'),
                    t('explore.restaurants.seoMeet.b2'),
                    t('explore.restaurants.seoMeet.b3'),
                ]}
                image={RESTAURANT_IMG.seoEvening}
                alt={t('explore.restaurants.seoMeet.alt')}
            />
            <CtaStrip label={t('explore.restaurants.ctaStrip')} href="#schedule" />
            <CalloutBanner
                title={t('common.readyWhen')}
                body={t('explore.restaurants.ready.body')}
                cta={t('common.backToBooking')}
                href={BOOK_HREF}
            />
            <ScrollTop />
        </SiteLayout>
    );
}
