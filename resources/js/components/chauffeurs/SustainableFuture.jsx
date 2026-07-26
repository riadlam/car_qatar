import { useSectionAnim } from '../landing/useSectionAnim';

/**
 * Blacklane SustainableFuture parity (wine tint):
 * title full-width display lg — not contained
 * description ~2 lines, then Learn more
 */
export default function SustainableFuture() {
    const rootRef = useSectionAnim();

    return (
        <section
            ref={rootRef}
            data-anim="section"
            className="bg-tint px-0 pt-[192px] pb-[112px] text-center lg:pt-[240px] lg:pb-[144px]"
        >
            <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
                <h2
                    data-anim="title"
                    className="font-fragment mb-6 text-[48px] leading-[56px] font-400 tracking-[0.25px] text-ink-text lg:mb-8 lg:text-[104px] lg:leading-[120px]"
                >
                    Driving a sustainable future
                </h2>
                <p
                    data-anim="subtitle"
                    className="font-geist mx-auto mb-8 max-w-[36rem] text-[18px] leading-[26px] font-500 tracking-[0.15px] text-balance text-ink-text sm:max-w-[42rem] lg:mb-10 lg:max-w-[44rem] lg:text-[24px] lg:leading-8"
                >
                    We&apos;re moving toward an all-electric fleet. Every ride since 2017 is
                    carbon-offset, and we&apos;re progressing to offset our historical emissions to
                    2011.
                </p>
                <a
                    data-anim="fade"
                    href="#partner-help"
                    className="font-geist inline-flex min-h-11 items-center justify-center rounded-full border border-wine-700 px-6 py-2.5 text-[16px] font-500 text-wine-700 transition hover:bg-page"
                >
                    Learn more
                </a>
            </div>
        </section>
    );
}
