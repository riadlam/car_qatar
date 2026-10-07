import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CORP_IMG } from './assets';

export default function Awards() {
    const { t } = useTranslation('marketing');

    const awards = useMemo(
        () => [
            { src: CORP_IMG.awardLux, alt: t('common.awardLux') },
            { src: CORP_IMG.awardTravel, alt: t('common.awardTravel') },
            { src: CORP_IMG.awardWorld, alt: t('common.awardWorld') },
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
