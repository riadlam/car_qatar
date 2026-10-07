import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RIDE_VALUES = ['1-10', '11-100', '101+'];
const COUNTRY_KEYS = ['us', 'uk', 'de', 'fr', 'ae', 'sa', 'dz', 'ca', 'au', 'other'];

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

export default function ContactForm() {
    const { t } = useTranslation('marketing');
    const [sent, setSent] = useState(false);
    const countries = useMemo(
        () =>
            COUNTRY_KEYS.map((key) => ({
                key,
                label: t(`travelAgencies.contactForm.countries.${key}`),
            })),
        [t],
    );

    const onSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <section id="get-in-touch" className="scroll-mt-28 bg-page px-6 py-16 lg:px-12 lg:py-20">
            <div className="mx-auto max-w-[720px]">
                <h2 className="font-fragment m-0 text-center text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] lg:text-[40px] lg:leading-[48px]">
                    {t('travelAgencies.contactForm.title')}
                </h2>
                <p className="font-geist mt-4 m-0 text-center text-[16px] leading-6 text-ink-text/80">
                    {t('travelAgencies.contactForm.subtitle')}
                </p>
                <p className="font-geist mt-3 m-0 text-center text-[14px] leading-5 text-muted">
                    {t('travelAgencies.contactForm.support')}{' '}
                    <a
                        href="mailto:business@almajd.com"
                        className="text-wine-700 underline-offset-2 hover:underline"
                    >
                        business@almajd.com
                    </a>
                    .
                </p>

                {sent ? (
                    <p className="font-geist mt-10 rounded-2xl border border-wine-200 bg-wine-50 p-6 text-center text-[16px] text-ink-text">
                        {t('travelAgencies.contactForm.thanks')}
                    </p>
                ) : (
                    <form
                        onSubmit={onSubmit}
                        className="mt-10 space-y-5 rounded-2xl border border-[#e8e8ea] bg-white p-6 sm:p-8"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    {t('travelAgencies.contactForm.firstName')}
                                </span>
                                <input required name="firstName" className={fieldClass} />
                            </label>
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    {t('travelAgencies.contactForm.lastName')}
                                </span>
                                <input required name="lastName" className={fieldClass} />
                            </label>
                        </div>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('travelAgencies.contactForm.workEmail')}
                            </span>
                            <input required type="email" name="email" className={fieldClass} />
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('travelAgencies.contactForm.phone')}
                            </span>
                            <input type="tel" name="phone" className={fieldClass} />
                        </label>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    {t('travelAgencies.contactForm.company')}
                                </span>
                                <input required name="company" className={fieldClass} />
                            </label>
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    {t('travelAgencies.contactForm.based')}
                                </span>
                                <select
                                    required
                                    name="country"
                                    defaultValue="us"
                                    className={fieldClass}
                                >
                                    {countries.map((c) => (
                                        <option key={c.key} value={c.key}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    {t('travelAgencies.contactForm.rides')}
                                </span>
                                <select required name="rides" defaultValue="" className={fieldClass}>
                                    <option value="" disabled>
                                        {t('travelAgencies.contactForm.select')}
                                    </option>
                                    {RIDE_VALUES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    {t('travelAgencies.contactForm.hearAbout')}
                                </span>
                                <input required name="hearAbout" className={fieldClass} />
                            </label>
                        </div>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                {t('travelAgencies.contactForm.help')}
                            </span>
                            <textarea required name="message" rows={4} className={fieldClass} />
                        </label>

                        <p className="font-geist m-0 text-[13px] leading-5 text-muted">
                            {t('travelAgencies.contactForm.privacyLead')}{' '}
                            <a href="#" className="text-wine-700 underline-offset-2 hover:underline">
                                {t('travelAgencies.contactForm.privacy')}
                            </a>
                            .
                        </p>

                        <button
                            type="submit"
                            className="font-geist inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 sm:w-auto"
                        >
                            {t('travelAgencies.contactForm.submit')}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
