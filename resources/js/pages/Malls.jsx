import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import ScrollTop from '../components/corporations/ScrollTop';
import DestinationScheduler from '../components/explore/DestinationScheduler';
import { MALL_IMG, MALL_DESTINATIONS, BOOK_HREF } from '../components/malls/assets';
import { useExploreCategory } from '../hooks/useExploreCategory';

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

function HeroScheduler({ stacked = false, explore }) {
    const { t } = useTranslation('marketing');
    return (
        <DestinationScheduler
            destinations={explore.destinations}
            selectedDestination={explore.selectedDestination}
            onDestinationChange={explore.setSelectedDestination}
            destinationLabel={t('explore.malls.destLabel')}
            destinationPlaceholder={t('explore.malls.destPlaceholder')}
            pickupPlaceholder={t('explore.scheduler.pickupPlaceholder')}
            service="one_way"
            title={t('explore.malls.scheduleTitle')}
            subtitle={t('explore.malls.scheduleSubtitle')}
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
    const heroTitle = t('explore.malls.title');
    const heroSubtitle = t('explore.malls.subtitle');

    if (isPhone) {
        return (
            <section id="top" className="bg-white" aria-label={heroTitle}>
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
                <li aria-current="page">{t('explore.malls.title')}</li>
            </ol>
        </nav>
    );
}

export default function Malls() {
    const { t } = useTranslation('marketing');
    const explore = useExploreCategory('mall', MALL_CARDS, MALL_DESTINATIONS);

    return (
        <SiteLayout>
            <Hero explore={explore} />
            <Breadcrumb />
            <CardCarousel
                title={t('explore.malls.carouselTitle')}
                cards={explore.cards}
                onCardClick={explore.onCardClick}
            />
            <CalloutBanner
                title={t('explore.malls.calloutSee.title')}
                body={t('explore.malls.calloutSee.body')}
                cta={t('explore.malls.calloutSee.cta')}
                href="#schedule"
            />
            <SeoSplit
                imageOn="right"
                title={t('explore.malls.seoArrive.title')}
                body={t('explore.malls.seoArrive.body')}
                bullets={[
                    t('explore.malls.seoArrive.b1'),
                    t('explore.malls.seoArrive.b2'),
                    t('explore.malls.seoArrive.b3'),
                ]}
                image={MALL_IMG.seoShop}
                alt={t('explore.malls.seoArrive.alt')}
            />
            <SeoSplit
                imageOn="left"
                title={t('explore.malls.seoHourly.title')}
                body={t('explore.malls.seoHourly.body')}
                bullets={[
                    t('explore.malls.seoHourly.b1'),
                    t('explore.malls.seoHourly.b2'),
                    t('explore.malls.seoHourly.b3'),
                ]}
                image={MALL_IMG.seoTransfer}
                alt={t('explore.malls.seoHourly.alt')}
                cta={{ label: t('common.bookByTheHour'), href: '/?service=by_hour#book' }}
            />
            <SeoSplit
                imageOn="right"
                title={t('explore.malls.seoMeet.title')}
                body={t('explore.malls.seoMeet.body')}
                bullets={[
                    t('explore.malls.seoMeet.b1'),
                    t('explore.malls.seoMeet.b2'),
                    t('explore.malls.seoMeet.b3'),
                ]}
                image={MALL_IMG.seoEvening}
                alt={t('explore.malls.seoMeet.alt')}
            />
            <CtaStrip label={t('explore.malls.ctaStrip')} href="#schedule" />
            <CalloutBanner
                title={t('common.readyWhen')}
                body={t('explore.malls.ready.body')}
                cta={t('common.backToBooking')}
                href={BOOK_HREF}
            />
            <ScrollTop />
        </SiteLayout>
    );
}
