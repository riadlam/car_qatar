import { useTranslation } from 'react-i18next';

export default function Testimonial() {
    const { t } = useTranslation('marketing');

    return (
        <section className="bg-[#f5f5f5] px-6 py-16 text-center lg:px-12 lg:py-20">
            <div className="mx-auto max-w-[900px]">
                <blockquote className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-wine-700 sm:text-[28px] sm:leading-9 lg:text-[32px] lg:leading-10">
                    &ldquo;{t('corporations.testimonial.text')}&rdquo;
                </blockquote>
                <p className="font-geist mt-8 m-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-muted">
                    {t('corporations.testimonial.attribution')}
                </p>
            </div>
        </section>
    );
}
