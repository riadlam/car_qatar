import { useTranslation } from 'react-i18next';

export default function Breadcrumb() {
    const { t } = useTranslation('marketing');

    return (
        <nav
            aria-label={t('common.breadcrumb')}
            className="bg-page px-6 py-4 text-center lg:px-12"
        >
            <ol className="font-geist m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0 text-[14px] leading-5 text-muted">
                <li>
                    <a href="/" className="text-ink-text transition hover:text-wine-700">
                        {t('common.home')}
                    </a>
                </li>
                <li aria-hidden="true" className="text-muted">
                    /
                </li>
                <li className="text-muted" aria-current="page">
                    {t('corporations.breadcrumbCurrent')}
                </li>
            </ol>
        </nav>
    );
}
