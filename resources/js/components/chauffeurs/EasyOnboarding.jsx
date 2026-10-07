import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CH_IMG, APPLY_HREF } from './assets';

function GlassCta({ href, children }) {
    return (
        <a
            href={href}
            className="bl-glass-dark font-geist relative z-[2] inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-6 py-3 text-[16px] font-500 whitespace-nowrap text-white transition hover:brightness-105 active:brightness-110"
        >
            {children}
        </a>
    );
}

function SlideCard({ slide }) {
    return (
        <article className="relative h-[480px] w-full overflow-hidden rounded-lg max-lg:h-[612px]">
            <div className="absolute inset-0">
                <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover object-center" />
            </div>

            <div className="bl-glass-dark absolute inset-x-0 bottom-0 z-[1] m-5 flex flex-col gap-4 rounded-lg border border-white/40 p-5 sm:m-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:p-6">
                <div className="min-w-0 flex-1">
                    <h3 className="font-geist m-0 text-[20px] leading-7 font-500 tracking-[0.15px] text-white sm:text-[28px] sm:leading-9">
                        {slide.title}
                    </h3>
                    <ul className="font-geist mt-2 mb-0 list-disc space-y-0.5 pl-5 text-[16px] leading-6 font-400 tracking-[0.25px] text-white sm:mt-3 sm:text-[18px] sm:leading-[26px]">
                        {slide.items.map((item) => (
                            <li key={item} className="m-0">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex shrink-0 justify-end">
                    <GlassCta href={slide.href}>{slide.cta}</GlassCta>
                </div>
            </div>
        </article>
    );
}

/**
 * Blacklane EasyOnboarding: pill switcher + horizontal track wipe (LTR / RTL).
 */
export default function EasyOnboarding() {
    const { t } = useTranslation('marketing');
    const [index, setIndex] = useState(0);

    const slides = useMemo(
        () => [
            {
                id: 'onboarding',
                label: t('chauffeursPage.onboarding.onboarding.label'),
                title: t('chauffeursPage.onboarding.onboarding.title'),
                image: CH_IMG.onboarding,
                alt: t('chauffeursPage.onboarding.onboarding.alt'),
                items: t('chauffeursPage.onboarding.onboarding.items', { returnObjects: true }),
                cta: t('chauffeursPage.onboarding.onboarding.cta'),
                href: APPLY_HREF,
            },
            {
                id: 'requirements',
                label: t('chauffeursPage.onboarding.requirements.label'),
                title: t('chauffeursPage.onboarding.requirements.title'),
                image: CH_IMG.requirements,
                alt: t('chauffeursPage.onboarding.requirements.alt'),
                items: t('chauffeursPage.onboarding.requirements.items', { returnObjects: true }),
                cta: t('chauffeursPage.onboarding.requirements.cta'),
                href: APPLY_HREF,
            },
        ],
        [t],
    );

    return (
        <section
            className="overflow-hidden bg-page py-[112px] max-lg:py-[112px] lg:py-[144px]"
            aria-label={t('chauffeursPage.onboarding.ariaLabel')}
        >
            <div
                role="radiogroup"
                aria-label={t('chauffeursPage.onboarding.sectionsAria')}
                className="mx-auto mb-8 flex w-fit gap-2 rounded-lg p-2"
            >
                {slides.map((s, i) => (
                    <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={index === i}
                        onClick={() => setIndex(i)}
                        className={`font-geist cursor-pointer rounded-lg border-0 px-6 py-2 text-[16px] leading-6 tracking-[0.15px] transition ${
                            index === i
                                ? 'bg-wine-700 font-400 text-white'
                                : 'bg-transparent font-400 text-muted hover:text-ink-text'
                        }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            <div className="mx-auto w-full px-5 lg:px-12">
                <div className="mx-auto w-full max-w-[1250px] overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {slides.map((slide) => (
                            <div
                                key={slide.id}
                                role="group"
                                aria-roledescription="slide"
                                className="w-full shrink-0 grow-0 basis-full"
                            >
                                <SlideCard slide={slide} />
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    role="group"
                    aria-label={t('chauffeursPage.onboarding.slideAria')}
                    className="mt-8 flex justify-center gap-2"
                >
                    {slides.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            aria-label={t('chauffeursPage.onboarding.slideN', { n: i + 1 })}
                            aria-current={index === i ? 'step' : undefined}
                            onClick={() => setIndex(i)}
                            className={`h-2 w-2 rounded-full transition ${
                                index === i ? 'bg-wine-700' : 'bg-wine-100'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
