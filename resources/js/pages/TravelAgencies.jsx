import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

function Hero() {
    const { t } = useTranslation('marketing');

    return (
        <div
            id="top"
            className="relative mx-auto flex w-full min-w-[320px] flex-col bg-page pt-[72px] lg:pt-[88px]"
        >
            <section className="box-border mx-auto w-full max-w-[1170px] px-4 sm:px-6">
                <p className="font-geist m-0 mt-5 text-[14px] leading-5 font-500 tracking-[0.15px] text-wine-700 uppercase">
                    {t('travelAgencies.eyebrow')}
                </p>
                <h1 className="font-fragment m-0 my-4 p-0 text-[32px] leading-10 font-400 tracking-[0.15px] text-ink-text md:text-[40px] md:leading-[48px] lg:text-[44px] lg:leading-[56px]">
                    {t('travelAgencies.title')}
                </h1>
                <p className="font-geist m-0 mb-5 max-w-[720px] text-[16px] leading-7 text-ink-text/75 md:text-[17px]">
                    {t('travelAgencies.subtitle')}
                </p>
                <a
                    href={REGISTER_HREF}
                    className="font-geist mb-5 inline-flex min-h-12 items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                >
                    {t('travelAgencies.cta')}
                </a>
            </section>
            <div className="relative z-0 w-full overflow-hidden">
                <img
                    src={TA_IMG.hero}
                    alt={t('travelAgencies.heroAlt')}
                    loading="eager"
                    className="block h-[264px] w-full object-cover object-center md:h-[370px] min-[1200px]:h-[400px] min-[1440px]:h-[550px]"
                />
            </div>
        </div>
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
                <li aria-current="page">{t('travelAgencies.breadcrumbCurrent')}</li>
            </ol>
        </nav>
    );
}

function Testimonial() {
    const { t } = useTranslation('marketing');

    return (
        <section className="bg-[#f5f5f5] px-6 py-16 text-center lg:px-12 lg:py-20">
            <div className="mx-auto max-w-[900px]">
                <blockquote className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-wine-700 sm:text-[28px] sm:leading-9 lg:text-[32px] lg:leading-10">
                    &ldquo;{t('travelAgencies.testimonial.text')}&rdquo;
                </blockquote>
                <p className="font-geist mt-8 m-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-muted">
                    {t('travelAgencies.testimonial.attribution')}
                </p>
            </div>
        </section>
    );
}

function TaAwards() {
    const { t } = useTranslation('marketing');
    const awards = useMemo(
        () => [
            { src: TA_IMG.awardLux, alt: t('common.awardLux') },
            { src: TA_IMG.awardTravel, alt: t('common.awardTravel') },
            { src: TA_IMG.awardWorld, alt: t('common.awardWorld') },
        ],
        [t],
    );

    return (
        <section className="bg-page px-6 py-12 text-center lg:px-12 lg:py-16">
            <div className="mx-auto max-w-[1170px]">
                <p className="font-geist m-0 mb-8 text-[16px] leading-6 font-500 tracking-[0.15px] text-ink-text lg:text-[18px]">
                    {t('common.awardWinning')}
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
    const { t } = useTranslation('marketing');

    const serviceCards = useMemo(
        () => [
            {
                title: t('travelAgencies.services.award.title'),
                body: t('travelAgencies.services.award.body'),
                img: TA_IMG.serviceAward,
            },
            {
                title: t('travelAgencies.services.ease.title'),
                body: t('travelAgencies.services.ease.body'),
                img: TA_IMG.serviceEase,
            },
            {
                title: t('travelAgencies.services.global.title'),
                body: t('travelAgencies.services.global.body'),
                img: TA_IMG.serviceGlobal,
            },
            {
                title: t('travelAgencies.services.carbon.title'),
                body: t('travelAgencies.services.carbon.body'),
                img: TA_IMG.serviceCarbon,
            },
        ],
        [t],
    );

    const fleetCards = useMemo(
        () => [
            {
                title: t('travelAgencies.fleet.solo.title'),
                body: t('travelAgencies.fleet.solo.body'),
                img: TA_IMG.fleetSolo,
            },
            {
                title: t('travelAgencies.fleet.amenities.title'),
                body: t('travelAgencies.fleet.amenities.body'),
                img: TA_IMG.fleetAmenities,
            },
        ],
        [t],
    );

    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title={t('travelAgencies.carouselServices')} cards={serviceCards} />
            <CalloutBanner
                title={t('travelAgencies.callout.transform.title')}
                body={t('travelAgencies.callout.transform.body')}
                cta={t('travelAgencies.callout.transform.cta')}
                href={REGISTER_HREF}
            />
            <Testimonial />
            <SeoSplit
                imageOn="right"
                title={t('travelAgencies.seo.revenue.title')}
                body={t('travelAgencies.seo.revenue.body')}
                bullets={[
                    t('travelAgencies.seo.revenue.b1'),
                    t('travelAgencies.seo.revenue.b2'),
                    t('travelAgencies.seo.revenue.b3'),
                ]}
                image={TA_IMG.seoRevenue}
                alt={t('travelAgencies.seo.revenue.alt')}
            />
            <SeoSplit
                imageOn="right"
                title={t('travelAgencies.seo.vehicles.title')}
                body={t('travelAgencies.seo.vehicles.body')}
                bullets={[
                    t('travelAgencies.seo.vehicles.b1'),
                    t('travelAgencies.seo.vehicles.b2'),
                    t('travelAgencies.seo.vehicles.b3'),
                ]}
                image={TA_IMG.seoVehicles}
                alt={t('travelAgencies.seo.vehicles.alt')}
            />
            <SeoSplit
                imageOn="right"
                title={t('travelAgencies.seo.satisfaction.title')}
                body={t('travelAgencies.seo.satisfaction.body')}
                bullets={[
                    t('travelAgencies.seo.satisfaction.b1'),
                    t('travelAgencies.seo.satisfaction.b2'),
                    t('travelAgencies.seo.satisfaction.b3'),
                ]}
                image={TA_IMG.seoSatisfaction}
                alt={t('travelAgencies.seo.satisfaction.alt')}
            />
            <SeoSplit
                imageOn="right"
                title={t('travelAgencies.seo.reputation.title')}
                body={t('travelAgencies.seo.reputation.body')}
                bullets={[
                    t('travelAgencies.seo.reputation.b1'),
                    t('travelAgencies.seo.reputation.b2'),
                    t('travelAgencies.seo.reputation.b3'),
                ]}
                image={TA_IMG.seoReputation}
                alt={t('travelAgencies.seo.reputation.alt')}
            />
            <CtaStrip label={t('travelAgencies.ctaGetInTouch')} href="#get-in-touch" />
            <CardCarousel title={t('travelAgencies.carouselFleet')} cards={fleetCards} />
            <CalloutBanner
                title={t('travelAgencies.callout.try.title')}
                body={t('travelAgencies.callout.try.body')}
                cta={t('travelAgencies.callout.try.cta')}
                href={REGISTER_HREF}
            />
            <SeoSplit
                imageOn="left"
                title={t('travelAgencies.seo.api.title')}
                body={t('travelAgencies.seo.api.body')}
                bullets={[
                    {
                        lead: t('travelAgencies.seo.api.gdsLead'),
                        text: t('travelAgencies.seo.api.gdsText'),
                    },
                    {
                        lead: t('travelAgencies.seo.api.obtLead'),
                        text: t('travelAgencies.seo.api.obtText'),
                    },
                    {
                        lead: t('travelAgencies.seo.api.realtimeLead'),
                        text: t('travelAgencies.seo.api.realtimeText'),
                    },
                ]}
                image={TA_IMG.seoIntegrations}
                alt={t('travelAgencies.seo.api.alt')}
                cta={{ label: t('travelAgencies.seo.api.cta'), href: '/business' }}
            />
            <SeoSplit
                imageOn="left"
                title={t('travelAgencies.seo.dedicated.title')}
                image={TA_IMG.seoDedicated}
                alt={t('travelAgencies.seo.dedicated.alt')}
                bodyNode={
                    <div className="space-y-4">
                        <p className="m-0">
                            <a href="#" className="font-500 text-wine-700 underline-offset-2 hover:underline">
                                {t('travelAgencies.seo.dedicated.leisureTitle')}
                            </a>
                            {t('travelAgencies.seo.dedicated.leisureBody')}
                        </p>
                        <p className="m-0">
                            <a href="#" className="font-500 text-wine-700 underline-offset-2 hover:underline">
                                {t('travelAgencies.seo.dedicated.corporateTitle')}
                            </a>
                            {t('travelAgencies.seo.dedicated.corporateBody')}
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
