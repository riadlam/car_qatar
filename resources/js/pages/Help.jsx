import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SiteLayout from '../components/landing/SiteLayout';

const CHEVRON = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-muted">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function ChatModal({ open, onClose, t }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-text/40 p-4" role="dialog" aria-modal="true">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t('help.chat.close')}
                    className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-ink-text transition hover:bg-black/5"
                >
                    <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
                <h2 className="font-fragment m-0 pr-8 text-[24px] leading-8 font-400 tracking-[0.25px] text-ink-text">
                    {t('help.chat.modalTitle')}
                </h2>
                <p className="font-geist mt-3 m-0 text-[15px] leading-6 text-muted">
                    {t('help.chat.modalBody')}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-wine-700 px-6 py-2.5 text-[16px] font-500 text-wine-700 transition hover:bg-wine-50"
                    >
                        {t('help.chat.startAnyway')}
                    </button>
                    <a
                        href={`/login?from=${encodeURIComponent('/help')}`}
                        className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-6 py-2.5 text-[16px] font-500 text-white transition hover:bg-wine-600"
                    >
                        {t('help.chat.signIn')}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function Help() {
    const { t } = useTranslation('marketing');
    const [chatOpen, setChatOpen] = useState(false);

    const sidebar = useMemo(
        () => [
            {
                title: t('help.sidebar.gettingStarted'),
                viewAll: { label: t('help.sidebar.viewAllGettingStarted'), href: '#' },
                items: [
                    { label: t('help.articles.vehicles'), href: '#' },
                    { label: t('help.articles.cities'), href: '#' },
                    { label: t('help.articles.luggage'), href: '#' },
                    { label: t('help.articles.delayed'), href: '#' },
                ],
            },
            {
                title: t('help.sidebar.manageBookings'),
                viewAll: { label: t('help.sidebar.viewAllBookings'), href: '#' },
                items: [
                    { label: t('help.articles.changes'), href: '#' },
                    { label: t('help.articles.offerCode'), href: '#' },
                    { label: t('help.articles.cancel'), href: '#' },
                    { label: t('help.articles.bookedForMe'), href: '#' },
                ],
            },
            {
                title: t('help.sidebar.billing'),
                viewAll: { label: t('help.sidebar.viewAllBilling'), href: '#' },
                items: [
                    { label: t('help.articles.tip'), href: '#' },
                    { label: t('help.articles.payment'), href: '#' },
                    { label: t('help.articles.changePayment'), href: '#' },
                ],
            },
        ],
        [t],
    );

    const resources = useMemo(
        () => [
            {
                title: t('help.resources.gettingStarted.title'),
                body: t('help.resources.gettingStarted.body'),
                href: '#',
                icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 11.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                ),
            },
            {
                title: t('help.resources.manageBookings.title'),
                body: t('help.resources.manageBookings.body'),
                href: '#',
                icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ),
            },
            {
                title: t('help.resources.billing.title'),
                body: t('help.resources.billing.body'),
                href: '#',
                icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M16.1538 7.15382C15.2054 6.20538 13.5351 5.54568 12 5.50437M7.84619 16.1538C8.73855 17.3436 10.3977 18.0222 12 18.0798M12 5.50437C10.1735 5.45522 8.5385 6.2815 8.5385 8.53845C8.5385 12.6923 16.1538 10.6154 16.1538 14.7692C16.1538 17.1383 14.127 18.1562 12 18.0798M12 5.50437V3M12 18.0798V20.9999"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ),
            },
            {
                title: t('help.resources.account.title'),
                body: t('help.resources.account.body'),
                href: '#',
                icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M7 18V17C7 14.2386 9.23858 12 12 12V12C14.7614 12 17 14.2386 17 17V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                            d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                ),
            },
            {
                title: t('help.resources.safety.title'),
                body: t('help.resources.safety.body'),
                href: '#',
                icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M8.5 11.5L11.5 14.5L16.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path
                            d="M5 18L3.13036 4.91253C3.05646 4.39524 3.39389 3.91247 3.90398 3.79912L11.5661 2.09641C11.8519 2.03291 12.1481 2.03291 12.4339 2.09641L20.096 3.79912C20.6061 3.91247 20.9435 4.39524 20.8696 4.91252L19 18C18.9293 18.495 18.5 21.5 12 21.5C5.5 21.5 5.07071 18.495 5 18Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ),
            },
            {
                title: t('help.resources.hailing.title'),
                body: t('help.resources.hailing.body'),
                href: '#',
                icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M8 10L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M7 14L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M16 14L17 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                            d="M3 18V11.4105C3 11.1397 3.05502 10.8716 3.16171 10.6227L5.4805 5.21216C5.79566 4.47679 6.51874 4 7.31879 4H16.6812C17.4813 4 18.2043 4.47679 18.5195 5.21216L20.8383 10.6227C20.945 10.8716 21 11.1397 21 11.4105V18M3 18V20.4C3 20.7314 3.26863 21 3.6 21H6.4C6.73137 21 7 20.7314 7 20.4V18M3 18H7M21 18V20.4C21 20.7314 20.7314 21 20.4 21H17.6C17.2686 21 17 20.7314 17 20.4V18M21 18H17M7 18H17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                ),
            },
        ],
        [t],
    );

    return (
        <SiteLayout>
            <div id="top" className="bg-page pt-[96px] pb-16 lg:pt-[120px] lg:pb-24">
                <div className="mx-auto max-w-[1170px] px-6 lg:px-12">
                    <h1 className="font-fragment m-0 text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text sm:text-[40px] sm:leading-[48px] lg:text-[48px] lg:leading-[56px]">
                        {t('help.pageTitle')}
                    </h1>

                    <div className="mt-10 flex flex-col gap-12 lg:mt-14 lg:flex-row lg:gap-16">
                        <aside className="w-full shrink-0 lg:w-[340px] xl:w-[380px]">
                            <div className="rounded-2xl border border-[#e8e8ea] bg-white p-6">
                                <p className="font-geist m-0 text-[16px] leading-6 font-500 text-ink-text">
                                    {t('help.sidebar.ridePrompt')}
                                </p>
                                <a
                                    href={`/login?from=${encodeURIComponent('/help')}`}
                                    className="font-geist mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-6 py-2.5 text-[16px] font-500 text-white transition hover:bg-wine-600"
                                >
                                    {t('help.sidebar.signIn')}
                                </a>
                            </div>

                            {sidebar.map((section) => (
                                <section key={section.title} className="mt-10">
                                    <p className="font-geist m-0 text-[14px] leading-5 font-500 tracking-[0.15px] text-muted uppercase">
                                        {section.title}
                                    </p>
                                    <ul className="mt-3 m-0 list-none space-y-1 p-0">
                                        {section.items.map((item) => (
                                            <li key={item.label}>
                                                <a
                                                    href={item.href}
                                                    className="font-geist flex items-center justify-between gap-3 rounded-lg px-1 py-3 text-[16px] leading-6 text-ink-text transition hover:bg-black/[0.03]"
                                                >
                                                    <span>{item.label}</span>
                                                    {CHEVRON}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="font-geist mt-2 m-0">
                                        <a
                                            href={section.viewAll.href}
                                            className="text-[14px] font-500 text-wine-700 underline-offset-2 hover:underline"
                                        >
                                            {section.viewAll.label}
                                        </a>
                                    </p>
                                </section>
                            ))}
                        </aside>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-geist m-0 text-[18px] leading-7 font-500 tracking-[0.15px] text-ink-text lg:text-[20px]">
                                {t('help.resourcesHeading')}
                            </h3>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {resources.map((r) => (
                                    <a
                                        key={r.title}
                                        href={r.href}
                                        className="group flex flex-col rounded-2xl border border-[#e8e8ea] bg-white p-5 transition hover:border-wine-200 hover:shadow-sm"
                                    >
                                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                                            {r.icon}
                                        </div>
                                        <h2 className="font-fragment m-0 text-[22px] leading-7 font-400 tracking-[0.25px] text-ink-text">
                                            {r.title}
                                        </h2>
                                        <p className="font-geist mt-2 m-0 text-[14px] leading-5 text-muted">
                                            {r.body}
                                        </p>
                                    </a>
                                ))}
                            </div>

                            <section className="mt-12">
                                <h2 className="font-geist m-0 text-[14px] leading-5 font-500 tracking-[0.15px] text-muted uppercase">
                                    {t('help.chat.notFound')}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setChatOpen(true)}
                                    aria-label={t('help.chat.cta')}
                                    className="font-geist mt-3 flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#e8e8ea] bg-white px-4 py-4 text-left text-[16px] leading-6 text-ink-text transition hover:border-wine-200 sm:w-auto sm:min-w-[320px]"
                                >
                                    <span className="flex items-center gap-3">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-wine-700">
                                            <path
                                                d="M4 13.4998L3.51493 13.6211C2.62459 13.8437 2 14.6437 2 15.5614V17.4383C2 18.356 2.62459 19.156 3.51493 19.3786L5.25448 19.8135C5.63317 19.9081 6 19.6217 6 19.2314V13.7683C6 13.378 5.63317 13.0916 5.25448 13.1862L4 13.4998ZM4 13.4998V13C4 8.02944 7.58172 4 12 4C16.4183 4 20 8.02944 20 13V13.5M20 13.5L20.4851 13.6211C21.3754 13.8437 22 14.6437 22 15.5614V17.4383C22 18.356 21.3754 19.156 20.4851 19.3786L18.7455 19.8135C18.3668 19.9081 18 19.6217 18 19.2314V13.7683C18 13.378 18.3668 13.0916 18.7455 13.1862L20 13.5Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>{t('help.chat.cta')}</span>
                                    </span>
                                    {CHEVRON}
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} t={t} />
        </SiteLayout>
    );
}
