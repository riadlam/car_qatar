import { useTranslation } from 'react-i18next';
import { REGISTER_HREF } from './assets';

export default function CalloutBanner({ title, body, cta, href = REGISTER_HREF }) {
    const { t } = useTranslation('marketing');

    return (
        <section className="bg-tint px-6 py-10 lg:px-12 lg:py-12">
            <div className="mx-auto flex max-w-[1170px] flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                    <h2 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] lg:text-[40px] lg:leading-[48px]">
                        {title ?? t('corporations.callout.title')}
                    </h2>
                    <p className="font-geist mt-2 m-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-ink-text/80 lg:text-[18px] lg:leading-7">
                        {body ?? t('corporations.callout.body')}
                    </p>
                </div>
                <a
                    href={href}
                    className="font-geist inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                >
                    {cta ?? t('corporations.callout.cta')}
                </a>
            </div>
        </section>
    );
}
