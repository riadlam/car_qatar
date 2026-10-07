import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BIZ_IMG } from './assets';

/** Blacklane Awards — sticky bottom band */
export default function Awards() {
    const { t } = useTranslation('marketing');

    const awards = useMemo(
        () => [
            { src: BIZ_IMG.awardLux, alt: t('business.awards.lux') },
            { src: BIZ_IMG.awardTravel, alt: t('business.awards.travel') },
            { src: BIZ_IMG.awardWorld, alt: t('business.awards.world') },
        ],
        [t],
    );

    return (
        <section className="sticky bottom-0 z-[2] bg-white py-12 text-center">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <h2 className="font-fragment mb-8 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10 lg:text-[40px] lg:leading-[48px]">
                    {t('business.awards.title')}
                </h2>
                <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-0">
                    {awards.map((a, i) => (
                        <div key={a.alt} className="flex items-center">
                            {i > 0 && (
                                <div
                                    className="mx-8 hidden h-20 w-px bg-[#aeaeae] lg:block"
                                    aria-hidden="true"
                                />
                            )}
                            <img src={a.src} alt={a.alt} className="h-20 w-auto object-contain" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
