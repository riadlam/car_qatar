import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { IMG } from './motion';
import { useSectionAnim } from './useSectionAnim';

/** AL MAJD social profiles — same URLs encoded in ops/qr-codes */
const SOCIAL_LINKS = {
    instagram: 'https://www.instagram.com/almajd.luxury.car/',
    facebook: 'https://www.facebook.com/share/1DAAgfkpHy/',
    tiktok: 'https://www.tiktok.com/@almajd_luxury_car',
    snapchat: 'https://www.snapchat.com/add/almajdluxurycar',
};

const SOCIAL_ICONS = {
    instagram: (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" />
            <path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    facebook: (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 2H14C12.6739 2 11.4021 2.52678 10.4645 3.46447C9.52678 4.40215 9 5.67392 9 7V10H6V14H9V22H13V14H16L17 10H13V7C13 6.73478 13.1054 6.48043 13.2929 6.29289C13.4804 6.10536 13.7348 6 14 6H17V2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    tiktok: (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18C11.6569 18 13 16.6569 13 15V6C13.3333 7 14.6 9 17 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    snapchat: (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 3C9.2 3 7.5 5.1 7.5 7.6V9.2C7.5 10.1 7.2 11.5 6.2 12.2C5.5 12.7 4.8 13.1 4.5 13.5C4.1 14 4.2 14.6 4.7 14.9C5.4 15.3 6.3 15.1 7 15.5C7.5 15.8 7.7 16.5 7.9 17.1C8.2 18.1 8.6 19.2 10 19.7C10.6 19.9 11.3 20 12 20C12.7 20 13.4 19.9 14 19.7C15.4 19.2 15.8 18.1 16.1 17.1C16.3 16.5 16.5 15.8 17 15.5C17.7 15.1 18.6 15.3 19.3 14.9C19.8 14.6 19.9 14 19.5 13.5C19.2 13.1 18.5 12.7 17.8 12.2C16.8 11.5 16.5 10.1 16.5 9.2V7.6C16.5 5.1 14.8 3 12 3Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
};

export default function Footer() {
    const { t } = useTranslation(['landing', 'common']);
    const rootRef = useSectionAnim({ start: 'top 90%' });
    const year = new Date().getFullYear();

    const cols = useMemo(
        () => [
            {
                key: 'company',
                title: t('footer.company.title'),
                links: [
                    { label: t('footer.company.howItWorks'), href: '/#services' },
                    { label: t('common:nav.aboutUs'), href: '/about-us' },
                    { label: t('footer.company.career'), href: '#' },
                    { label: t('footer.company.press'), href: '#' },
                    { label: t('footer.company.greenInitiatives'), href: '#' },
                    { label: t('footer.company.becomeChauffeurPartner'), href: '/partners' },
                ],
            },
            {
                key: 'business',
                title: t('footer.business.title'),
                id: 'business',
                links: [
                    { label: t('footer.business.overview'), href: '/business' },
                    { label: t('footer.business.corporations'), href: '/corporations' },
                    { label: t('footer.business.travelAgencies'), href: '/travel-agencies' },
                    { label: t('footer.business.strategicPartnerships'), href: '/strategic-partnerships' },
                ],
            },
            {
                key: 'services',
                title: t('common:footer.services'),
                links: [
                    { label: t('common:footer.oneWay'), href: '/#book' },
                    { label: t('common:footer.multiStops'), href: '/#book' },
                    { label: t('common:footer.byHour'), href: '/#book' },
                    { label: t('common:footer.cityTour'), href: '/#book' },
                    { label: t('common:footer.arabGulf'), href: '/#book' },
                    { label: t('common:footer.school'), href: '/#book' },
                ],
            },
            {
                key: 'topCities',
                title: t('footer.topCities.title'),
                links: [
                    { label: t('footer.topCities.doha'), href: '#' },
                    { label: t('footer.topCities.alRayyan'), href: '#' },
                    { label: t('footer.topCities.lusail'), href: '#' },
                    { label: t('footer.topCities.alWakrah'), href: '#' },
                    { label: t('footer.topCities.alKhor'), href: '#' },
                    { label: t('footer.topCities.mesaieed'), href: '#' },
                ],
            },
            {
                key: 'explore',
                title: t('footer.explore.title'),
                links: [
                    { label: t('common:explore.iconicPlaces'), href: '/iconic-places' },
                    { label: t('common:explore.hotels'), href: '/hotels' },
                    { label: t('common:explore.malls'), href: '/malls' },
                    { label: t('common:explore.beaches'), href: '/beaches' },
                    { label: t('common:explore.restaurants'), href: '/restaurants' },
                    { label: t('footer.explore.airportTransfer'), href: '/#book' },
                ],
            },
        ],
        [t],
    );

    const legal = useMemo(
        () => [
            { label: t('footer.legal.terms'), href: '#' },
            { label: t('footer.legal.privacy'), href: '#' },
            { label: t('footer.legal.legalNotice'), href: '#' },
            { label: t('footer.legal.accessibility'), href: '#' },
        ],
        [t],
    );

    const social = useMemo(
        () => [
            {
                label: t('footer.social.instagram'),
                href: SOCIAL_LINKS.instagram,
                icon: SOCIAL_ICONS.instagram,
            },
            {
                label: t('footer.social.facebook'),
                href: SOCIAL_LINKS.facebook,
                icon: SOCIAL_ICONS.facebook,
            },
            {
                label: t('footer.social.tiktok'),
                href: SOCIAL_LINKS.tiktok,
                icon: SOCIAL_ICONS.tiktok,
            },
            {
                label: t('footer.social.snapchat'),
                href: SOCIAL_LINKS.snapchat,
                icon: SOCIAL_ICONS.snapchat,
            },
        ],
        [t],
    );

    return (
        <footer id="help" ref={rootRef} data-anim="section" className="bg-page">
            <div className="mx-auto max-w-[1170px] px-4 pt-10 pb-8 sm:px-6 lg:px-12 lg:pt-16">
                <div
                    data-anim="fade"
                    className="flex flex-col gap-6 border-b border-[#eef1f3] pb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                    <Logo inverted />
                    <div className="flex flex-wrap gap-3">
                        <a href="#" data-anim="badge" aria-label={t('footer.appStore')}>
                            <img src={IMG.appStoreDark} alt={t('footer.appStore')} className="h-10 w-auto" />
                        </a>
                        <a href="#" data-anim="badge" aria-label={t('footer.googlePlay')}>
                            <img src={IMG.playStoreDark} alt={t('footer.googlePlay')} className="h-10 w-auto" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 sm:py-10 lg:grid-cols-5 lg:gap-6">
                    {cols.map((col) => (
                        <div key={col.key} id={col.id} data-anim="item">
                            <h4 className="font-geist text-[16px] leading-6 font-600 text-ink-text">
                                {col.title}
                            </h4>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <a
                                            href={l.href}
                                            className="font-geist text-[14px] leading-5 text-ink-text/70 transition hover:text-ink-text"
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Blacklane LegalSection — copyright + links left, social right */}
                <div
                    data-anim="fade"
                    className="flex flex-col-reverse items-start gap-6 border-t border-[#eef1f3] py-5 text-ink-text sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
                >
                    <div className="flex w-full flex-col-reverse items-start gap-3 lg:w-auto lg:flex-row lg:items-center lg:gap-8">
                        <p className="font-geist m-0 text-[16px] leading-6 font-600 tracking-[0.15px] text-ink-text">
                            {t('footer.copyright', { year })}
                        </p>
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                            {legal.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    className="font-geist text-[14px] leading-5 text-ink-text/70 transition hover:text-ink-text"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-start gap-4 lg:w-auto lg:justify-end">
                        {social.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className="flex items-center justify-center text-ink-text transition-colors duration-200 hover:text-[#6e6e73]"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
