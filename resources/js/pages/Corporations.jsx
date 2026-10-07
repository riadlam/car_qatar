import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

export default function Corporations() {
    const { t } = useTranslation('marketing');

    const serviceCards = useMemo(
        () => [
            {
                title: t('corporations.useCases.meetings.title'),
                body: t('corporations.useCases.meetings.body'),
                img: CORP_IMG.serviceBusiness,
            },
            {
                title: t('corporations.useCases.cityToCity.title'),
                body: t('corporations.useCases.cityToCity.body'),
                img: CORP_IMG.serviceCity,
                cta: t('corporations.useCases.cityToCity.cta'),
                href: '#',
            },
            {
                title: t('corporations.useCases.airport.title'),
                body: t('corporations.useCases.airport.body'),
                img: CORP_IMG.serviceAirport,
            },
            {
                title: t('corporations.useCases.clients.title'),
                body: t('corporations.useCases.clients.body'),
                img: CORP_IMG.servicePartner,
            },
        ],
        [t],
    );

    const sustainCards = useMemo(
        () => [
            {
                title: t('corporations.sustainability.newNormal.title'),
                body: t('corporations.sustainability.newNormal.body'),
                img: CORP_IMG.sustainEv,
            },
            {
                title: t('corporations.sustainability.offset.title'),
                body: t('corporations.sustainability.offset.body'),
                img: CORP_IMG.sustainCarbon,
            },
        ],
        [t],
    );

    const articleCards = useMemo(
        () => [
            {
                title: t('corporations.stories.hudson.title'),
                body: t('corporations.stories.hudson.body'),
                img: CORP_IMG.articleHudson,
                cta: t('corporations.stories.hudson.cta'),
                href: '#',
                badge: t('common.newBadge'),
            },
            {
                title: t('corporations.stories.flow.title'),
                body: t('corporations.stories.flow.body'),
                img: CORP_IMG.articleFlow,
                cta: t('corporations.stories.flow.cta'),
                href: '#',
            },
            {
                title: t('corporations.stories.trends.title'),
                body: t('corporations.stories.trends.body'),
                img: CORP_IMG.articleTrends,
                cta: t('corporations.stories.trends.cta'),
                href: '#',
            },
        ],
        [t],
    );

    return (
        <SiteLayout>
            <Hero />
            <Breadcrumb />
            <CardCarousel title={t('corporations.carouselServices')} cards={serviceCards} />
            <CtaStrip label={t('corporations.ctaTry')} href="#get-in-touch" />
            <Testimonial />
            <SeoSplit
                title={t('corporations.seo.reliability.title')}
                body={t('corporations.seo.reliability.body')}
                bullets={[
                    t('corporations.benefits.availability'),
                    t('corporations.benefits.chauffeurs'),
                    t('corporations.benefits.tracking'),
                    t('corporations.benefits.fleet'),
                ]}
                image={CORP_IMG.seoReliability}
                alt={t('corporations.seo.reliability.alt')}
            />
            <SeoSplit
                title={t('corporations.seo.invoicing.title')}
                body={t('corporations.seo.invoicing.body')}
                bullets={[
                    t('corporations.benefits.platform'),
                    t('corporations.benefits.invoicing'),
                    t('corporations.benefits.support'),
                    t('corporations.benefits.rebates'),
                ]}
                image={CORP_IMG.seoInvoicing}
                alt={t('corporations.seo.invoicing.alt')}
            />
            <CtaStrip label={t('corporations.ctaCreate')} href={REGISTER_HREF} />
            <SeoSplit
                title={t('corporations.seo.bookers.title')}
                body={t('corporations.seo.bookers.body')}
                image={CORP_IMG.seoBookers}
                alt={t('corporations.seo.bookers.alt')}
                link={{ label: t('corporations.learnMore'), href: '/business' }}
            />
            <SeoSplit
                title={t('corporations.seo.hourly.title')}
                body={t('corporations.seo.hourly.body')}
                image={CORP_IMG.seoHourly}
                alt={t('corporations.seo.hourly.alt')}
                link={{ label: t('corporations.seo.hourly.link'), href: '#' }}
            />
            <Awards />
            <CalloutBanner />
            <CardCarousel title={t('corporations.carouselSustainability')} cards={sustainCards} />
            <Benefits />
            <CardCarousel title={t('corporations.carouselArticles')} cards={articleCards} panel={false} />
            <ContactForm />
            <Faqs />
            <ScrollTop />
        </SiteLayout>
    );
}
