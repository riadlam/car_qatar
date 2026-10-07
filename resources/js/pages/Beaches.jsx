import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CtaStrip from '../components/corporations/CtaStrip';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import ScrollTop from '../components/corporations/ScrollTop';
import DestinationScheduler from '../components/explore/DestinationScheduler';
import { BEACH_IMG, BEACH_DESTINATIONS, BOOK_HREF } from '../components/beaches/assets';
import { useExploreCategory } from '../hooks/useExploreCategory';

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

function HeroScheduler({ stacked = false, explore }) {
    const { t } = useTranslation('marketing');
    return (
        <DestinationScheduler
            destinations={explore.destinations}
            selectedDestination={explore.selectedDestination}
            onDestinationChange={explore.setSelectedDestination}
            destinationLabel={t('explore.beaches.destLabel')}
            destinationPlaceholder={t('explore.beaches.destPlaceholder')}
            pickupPlaceholder={t('explore.scheduler.pickupPlaceholder')}
            service="one_way"
            title={t('explore.beaches.scheduleTitle')}
            subtitle={t('explore.beaches.scheduleSubtitle')}
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
    const heroTitle = t('explore.beaches.title');
    const heroSubtitle = t('explore.beaches.subtitle');

    if (isPhone) {
        return (
            <section id="top" className="bg-white" aria-label={heroTitle}>
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
                <li aria-current="page">{t('explore.beaches.title')}</li>
            </ol>
        </nav>
    );
}

export default function Beaches() {
    const { t } = useTranslation('marketing');
    const explore = useExploreCategory('beach', BEACH_CARDS, BEACH_DESTINATIONS);

    return (
        <SiteLayout>
            <Hero explore={explore} />
            <Breadcrumb />
            <CardCarousel
                title={t('explore.beaches.carouselTitle')}
                cards={explore.cards}
                onCardClick={explore.onCardClick}
            />
            <CalloutBanner
                title={t('explore.beaches.calloutSee.title')}
                body={t('explore.beaches.calloutSee.body')}
                cta={t('explore.beaches.calloutSee.cta')}
                href="#schedule"
            />
            <SeoSplit
                imageOn="right"
                title={t('explore.beaches.seoArrive.title')}
                body={t('explore.beaches.seoArrive.body')}
                bullets={[
                    t('explore.beaches.seoArrive.b1'),
                    t('explore.beaches.seoArrive.b2'),
                    t('explore.beaches.seoArrive.b3'),
                ]}
                image={BEACH_IMG.seoBeach}
                alt={t('explore.beaches.seoArrive.alt')}
            />
            <SeoSplit
                imageOn="left"
                title={t('explore.beaches.seoHourly.title')}
                body={t('explore.beaches.seoHourly.body')}
                bullets={[
                    t('explore.beaches.seoHourly.b1'),
                    t('explore.beaches.seoHourly.b2'),
                    t('explore.beaches.seoHourly.b3'),
                ]}
                image={BEACH_IMG.seoTransfer}
                alt={t('explore.beaches.seoHourly.alt')}
                cta={{ label: t('common.bookByTheHour'), href: '/?service=by_hour#book' }}
            />
            <SeoSplit
                imageOn="right"
                title={t('explore.beaches.seoMeet.title')}
                body={t('explore.beaches.seoMeet.body')}
                bullets={[
                    t('explore.beaches.seoMeet.b1'),
                    t('explore.beaches.seoMeet.b2'),
                    t('explore.beaches.seoMeet.b3'),
                ]}
                image={BEACH_IMG.seoResort}
                alt={t('explore.beaches.seoMeet.alt')}
            />
            <CtaStrip label={t('explore.beaches.ctaStrip')} href="#schedule" />
            <CalloutBanner
                title={t('common.readyWhen')}
                body={t('explore.beaches.ready.body')}
                cta={t('common.backToBooking')}
                href={BOOK_HREF}
            />
            <ScrollTop />
        </SiteLayout>
    );
}
