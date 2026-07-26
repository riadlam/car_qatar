import { useState } from 'react';
import { PRIVACY_HREF } from './assets';

const COMPANY_SIZES = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '10,001+ employees',
];

const COUNTRIES = [
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'United Arab Emirates',
    'Saudi Arabia',
    'Algeria',
    'Canada',
    'Australia',
    'Other',
];

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

export default function ContactForm() {
    const [sent, setSent] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <section id="get-in-touch" className="scroll-mt-28 bg-page px-6 py-16 lg:px-12 lg:py-20">
            <div className="mx-auto max-w-[720px]">
                <h2 className="font-fragment m-0 text-center text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] lg:text-[40px] lg:leading-[48px]">
                    Elevate your business travel
                </h2>
                <p className="font-geist mt-4 m-0 text-center text-[16px] leading-6 text-ink-text/80">
                    Experience our award-winning service by submitting the form.
                </p>
                <p className="font-geist mt-3 m-0 text-center text-[14px] leading-5 text-muted">
                    For account support, email{' '}
                    <a href="mailto:business@almajd.com" className="text-wine-700 underline-offset-2 hover:underline">
                        business@almajd.com
                    </a>
                    .
                </p>

                {sent ? (
                    <p className="font-geist mt-10 rounded-2xl border border-wine-200 bg-wine-50 p-6 text-center text-[16px] text-ink-text">
                        Thank you — we&apos;ll be in touch shortly.
                    </p>
                ) : (
                    <form
                        onSubmit={onSubmit}
                        className="mt-10 space-y-5 rounded-2xl border border-[#e8e8ea] bg-white p-6 sm:p-8"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    First name *
                                </span>
                                <input required name="firstName" className={fieldClass} />
                            </label>
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    Last name *
                                </span>
                                <input required name="lastName" className={fieldClass} />
                            </label>
                        </div>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Work email *
                            </span>
                            <input required type="email" name="email" className={fieldClass} />
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Phone
                            </span>
                            <input type="tel" name="phone" className={fieldClass} />
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Company name *
                            </span>
                            <input required name="company" className={fieldClass} />
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Where are you based? *
                            </span>
                            <select required name="country" defaultValue="United States" className={fieldClass}>
                                {COUNTRIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                Company size *
                            </span>
                            <select required name="companySize" defaultValue="" className={fieldClass}>
                                <option value="" disabled>
                                    Select…
                                </option>
                                {COMPANY_SIZES.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                How did you hear about us? *
                            </span>
                            <input required name="hearAbout" className={fieldClass} />
                        </label>

                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                How can we help? *
                            </span>
                            <textarea required name="message" rows={4} className={fieldClass} />
                        </label>

                        <p className="font-geist m-0 text-[13px] leading-5 text-muted">
                            Learn how we handle your data in our{' '}
                            <a href={PRIVACY_HREF} className="text-wine-700 underline-offset-2 hover:underline">
                                Privacy Policy
                            </a>
                            .
                        </p>

                        <button
                            type="submit"
                            className="font-geist inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 sm:w-auto"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
