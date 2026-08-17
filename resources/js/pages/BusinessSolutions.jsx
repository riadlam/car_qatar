import { useState } from 'react';
import SiteLayout from '../components/landing/SiteLayout';
import { BIZ_IMG } from '../components/business/assets';

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition placeholder:text-muted/70 focus:border-wine-700';

const SALES_CONTACTS = [
    {
        label: 'Email our sales team',
        value: 'business@almajd.com',
        href: 'mailto:business@almajd.com',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6.5L12 13L21 6.5M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        label: 'Call our sales team',
        value: '+974 4444 0000',
        href: 'tel:+97444440000',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8.4 3.5L10.1 7.3C10.3 7.8 10.2 8.4 9.8 8.8L8.4 10.2C9.5 12.6 11.4 14.5 13.8 15.6L15.2 14.2C15.6 13.8 16.2 13.7 16.7 13.9L20.5 15.6C21.1 15.9 21.4 16.5 21.2 17.1L20.6 20C20.5 20.6 19.9 21 19.3 21C10.3 21 3 13.7 3 4.7C3 4.1 3.4 3.5 4 3.4L6.9 2.8C7.5 2.6 8.1 2.9 8.4 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        label: 'Chat on WhatsApp',
        value: '+974 4444 0000',
        href: 'https://wa.me/97444440000',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20.5 11.7C20.5 16.5 16.6 20.4 11.8 20.4C10.3 20.4 8.9 20 7.7 19.3L3.5 20.5L4.7 16.4C3.9 15.1 3.5 13.5 3.5 11.7C3.5 6.9 7.3 3 12 3C16.7 3 20.5 6.9 20.5 11.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.3 7.8C8.6 7.5 9 7.6 9.2 7.9L10.1 10C10.2 10.3 10.2 10.6 10 10.8L9.4 11.5C10.1 12.8 11.1 13.8 12.5 14.5L13.2 13.8C13.4 13.6 13.7 13.6 14 13.7L16 14.7C16.3 14.8 16.4 15.2 16.2 15.5C15.7 16.3 14.8 16.8 13.9 16.7C10.5 16.3 7.8 13.6 7.3 10.2C7.2 9.3 7.6 8.4 8.3 7.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

export default function BusinessSolutions() {
    const [sent, setSent] = useState(false);

    const onSubmit = (event) => {
        event.preventDefault();
        setSent(true);
    };

    return (
        <SiteLayout>
            <div id="top" className="bg-page pt-[72px] lg:pt-[88px]">
                <section className="mx-auto grid w-full max-w-[1170px] items-center gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] lg:px-12 lg:py-20">
                    <div>
                        <p className="font-geist m-0 text-[14px] leading-5 font-500 tracking-[0.15px] text-wine-700 uppercase">
                            Business solutions
                        </p>
                        <h1 className="font-fragment mt-4 mb-0 text-[38px] leading-[46px] font-400 tracking-[0.25px] text-ink-text sm:text-[48px] sm:leading-[56px] lg:text-[56px] lg:leading-[64px]">
                            Chauffeur solutions built around your business
                        </h1>
                        <p className="font-geist mt-6 mb-0 max-w-[620px] text-[17px] leading-7 text-ink-text/75">
                            From executive travel and airport transfers to events and recurring
                            journeys, our team creates reliable transportation plans tailored to
                            your company.
                        </p>
                        <a
                            href="#register-interest"
                            className="font-geist mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                        >
                            Talk to our sales team
                        </a>
                    </div>

                    <div className="overflow-hidden rounded-2xl">
                        <img
                            src={BIZ_IMG.hero}
                            alt="Premium chauffeur service for business travel"
                            className="h-[320px] w-full object-cover sm:h-[420px]"
                        />
                    </div>
                </section>
            </div>

            <section className="bg-white px-6 py-16 lg:px-12 lg:py-20">
                <div className="mx-auto max-w-[1170px]">
                    <div className="max-w-[680px]">
                        <h2 className="font-fragment m-0 text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text lg:text-[40px] lg:leading-[48px]">
                            Speak with our sales team
                        </h2>
                        <p className="font-geist mt-4 mb-0 text-[16px] leading-7 text-ink-text/70">
                            Tell us what your business needs. Our team will help you find the right
                            service, booking setup, and travel solution.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {SALES_CONTACTS.map((contact) => (
                            <a
                                key={contact.label}
                                href={contact.href}
                                target={contact.href.startsWith('http') ? '_blank' : undefined}
                                rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                                className="group rounded-2xl border border-[#e8e8ea] bg-page p-6 transition hover:border-wine-200 hover:shadow-sm"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                                    {contact.icon}
                                </span>
                                <span className="font-geist mt-5 block text-[14px] leading-5 text-muted">
                                    {contact.label}
                                </span>
                                <span className="font-geist mt-1 block text-[17px] leading-6 font-500 text-ink-text group-hover:text-wine-700">
                                    {contact.value}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section id="register-interest" className="scroll-mt-28 bg-page px-6 py-16 lg:px-12 lg:py-24">
                <div className="mx-auto grid max-w-[1170px] gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
                    <div>
                        <p className="font-geist m-0 text-[14px] leading-5 font-500 tracking-[0.15px] text-wine-700 uppercase">
                            Register your interest
                        </p>
                        <h2 className="font-fragment mt-4 mb-0 text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text lg:text-[40px] lg:leading-[48px]">
                            Let&apos;s discuss how we can help
                        </h2>
                        <p className="font-geist mt-4 mb-0 text-[16px] leading-7 text-ink-text/70">
                            Share a few details and your question. A member of our sales team will
                            contact you shortly.
                        </p>
                    </div>

                    {sent ? (
                        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-wine-200 bg-wine-50 p-8 text-center">
                            <div>
                                <h3 className="font-fragment m-0 text-[28px] leading-9 font-400 text-ink-text">
                                    Thank you for your interest
                                </h3>
                                <p className="font-geist mt-3 mb-0 text-[16px] leading-6 text-ink-text/75">
                                    Our sales team will be in touch shortly.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={onSubmit}
                            className="space-y-5 rounded-2xl border border-[#e8e8ea] bg-white p-6 shadow-sm sm:p-8"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        Full name *
                                    </span>
                                    <input required name="name" autoComplete="name" className={fieldClass} />
                                </label>
                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        Company *
                                    </span>
                                    <input required name="company" autoComplete="organization" className={fieldClass} />
                                </label>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        Work email *
                                    </span>
                                    <input required type="email" name="email" autoComplete="email" className={fieldClass} />
                                </label>
                                <label className="block">
                                    <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                        Phone number *
                                    </span>
                                    <input required type="tel" name="phone" autoComplete="tel" className={fieldClass} />
                                </label>
                            </div>

                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] font-500 text-ink-text">
                                    How can we help? *
                                </span>
                                <textarea
                                    required
                                    name="message"
                                    rows={5}
                                    placeholder="Tell us what you would like to ask or discuss..."
                                    className={`${fieldClass} resize-y`}
                                />
                            </label>

                            <p className="font-geist m-0 text-[13px] leading-5 text-muted">
                                By submitting this form, you agree that our sales team may contact
                                you about your enquiry.
                            </p>

                            <button
                                type="submit"
                                className="font-geist inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 sm:w-auto"
                            >
                                Submit enquiry
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
