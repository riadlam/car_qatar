import { HELP_HREF } from './assets';

/**
 * Blacklane Help section parity (filled CTA, wine instead of blue).
 * Not sticky — user asked sticky removed earlier.
 */
export default function Help() {
    return (
        <section id="partner-help" className="bg-white pt-[112px] text-center lg:pt-[144px]">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-3 border-b border-[#eef1f3] px-6 pb-12 lg:gap-4 lg:px-12 lg:pb-16">
                <h2 className="font-fragment m-0 text-[32px] leading-[48px] font-400 tracking-[0.25px] text-ink-text lg:text-[48px] lg:leading-[56px]">
                    Still have questions?
                </h2>
                <h3 className="font-geist m-0 text-[20px] leading-7 font-500 tracking-[0.15px] text-ink-text lg:text-[28px] lg:leading-9">
                    Visit our help center.
                </h3>
                <a
                    href={HELP_HREF}
                    className="font-geist mt-1 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                >
                    Learn more
                </a>
            </div>
        </section>
    );
}
