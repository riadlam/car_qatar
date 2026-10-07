import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SiteLayout from '../components/landing/SiteLayout';
import CardCarousel from '../components/corporations/CardCarousel';
import CalloutBanner from '../components/corporations/CalloutBanner';
import SeoSplit from '../components/corporations/SeoSplit';
import Benefits from '../components/strategicPartnerships/Benefits';
import { SP_IMG, PARTNERS_HREF } from '../components/strategicPartnerships/assets';

function Hero() {
    const { t } = useTranslation('marketing');

    return (
        <div
            id="top"
            className="relative mx-auto flex w-full min-w-[320px] flex-col bg-page pt-[72px] lg:pt-[88px]"
        >
            <section className="box-border mx-auto w-full max-w-[1170px] px-4 sm:px-6">
                <p className="font-geist m-0 mt-5 text-[14px] leading-5 font-500 tracking-[0.15px] text-wine-700 uppercase">
                    {t('strategicPartnerships.eyebrow')}
                </p>
                <h1 className="font-fragment m-0 my-4 p-0 text-[32px] leading-10 font-400 tracking-[0.15px] text-ink-text md:text-[40px] md:leading-[48px] lg:text-[44px] lg:leading-[56px]">
                    {t('strategicPartnerships.title')}
                </h1>
                <p className="font-geist m-0 mb-5 max-w-[720px] text-[16px] leading-7 text-ink-text/75 md:text-[17px]">
                    {t('strategicPartnerships.subtitle')}
                </p>
                <a
                    href="#get-in-touch"
                    className="font-geist mb-5 inline-flex min-h-12 items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                >
                    {t('strategicPartnerships.cta')}
                </a>
            </section>
            <div className="relative z-0 w-full overflow-hidden">
                <img
                    src={SP_IMG.hero}
                    alt={t('strategicPartnerships.heroAlt')}
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
                <li aria-current="page">{t('strategicPartnerships.breadcrumbCurrent')}</li>
            </ol>
        </nav>
    );
}

function Awards() {
    const { t } = useTranslation('marketing');
    const awards = useMemo(
        () => [
            { src: SP_IMG.awardLux, alt: t('common.awardLux') },
            { src: SP_IMG.awardTravel, alt: t('common.awardTravel') },
            { src: SP_IMG.awardWorld, alt: t('common.awardWorld') },
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

export default function StrategicPartnerships() {
    const { t } = useTranslation('marketing');

    const partnerCards = useMemo(
        () =>
            ['aviation', 'cruise', 'financial', 'hotel'].map((key) => ({
                title: t(`strategicPartnerships.partners.${key}.title`),
                body: t(`strategicPartnerships.partners.${key}.body`),
                img: SP_IMG[key],
                bullets: [
                    t(`strategicPartnerships.partners.${key}.b1`),
                    t(`strategicPartnerships.partners.${key}.b2`),
                    t(`strategicPartnerships.partners.${key}.b3`),
                ],
            })),
        [t],
    );

    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title={t('strategicPartnerships.carouselTitle')} cards={partnerCards} />
            <Benefits />
            <SeoSplit
                imageOn="left"
                title={t('strategicPartnerships.seo.api.title')}
                body={t('strategicPartnerships.seo.api.body')}
                bullets={[
                    {
                        lead: t('strategicPartnerships.seo.api.gdsLead'),
                        text: t('strategicPartnerships.seo.api.gdsText'),
                    },
                    {
                        lead: t('strategicPartnerships.seo.api.obtLead'),
                        text: t('strategicPartnerships.seo.api.obtText'),
                    },
                    {
                        lead: t('strategicPartnerships.seo.api.realtimeLead'),
                        text: t('strategicPartnerships.seo.api.realtimeText'),
                    },
                ]}
                image={SP_IMG.seoApi}
                alt={t('strategicPartnerships.seo.api.alt')}
                cta={{ label: t('strategicPartnerships.seo.api.cta'), href: '/business' }}
            />
            <Awards />
            <CalloutBanner
                title={t('strategicPartnerships.callout.title')}
                body={t('strategicPartnerships.callout.body')}
                cta={t('strategicPartnerships.callout.cta')}
                href={PARTNERS_HREF}
            />
        </SiteLayout>
    );
}
