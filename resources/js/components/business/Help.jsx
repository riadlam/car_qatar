import { CONTACT_HREF } from './assets';

export default function Help() {
    return (
        <section id="business-help" className="bg-white pt-[112px] text-center lg:pt-[144px]">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-3 border-b border-[#eef1f3] px-6 pb-12 lg:gap-4 lg:px-12 lg:pb-16">
                <h2 className="font-fragment m-0 text-[32px] leading-[48px] font-400 tracking-[0.25px] text-ink-text lg:text-[48px] lg:leading-[56px]">
                    How can we help?
                </h2>
                <h3 className="font-geist m-0 text-[20px] leading-7 font-500 tracking-[0.15px] text-ink-text lg:text-[28px] lg:leading-9">
                    We&apos;re happy to answer any questions.
                </h3>
                <a
                    href={CONTACT_HREF}
                    className="font-geist mt-1 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-[#5b0520] px-8 py-3 text-[16px] font-500 text-white transition hover:bg-[#741133]"
                >
                    Get in touch
                </a>
            </div>
        </section>
    );
}
