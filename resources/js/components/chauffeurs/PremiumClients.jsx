import { useSectionAnim } from '../landing/useSectionAnim';

/**
 * Blacklane PremiumClients parity (wine tint instead of #aecff3):
 * padding-top: spacing-7xl*2 (192 / 144 mobile)
 * padding-bottom: spacing-6xl*2 (160 / 128 mobile)
 * title: display lg + mb spacing-xl
 * body: subheadline sm
 */
export default function PremiumClients() {
    const rootRef = useSectionAnim();

    return (
        <section
            ref={rootRef}
            data-anim="section"
            className="flex bg-tint px-0 pt-[144px] pb-[128px] text-center lg:pt-[192px] lg:pb-[160px]"
        >
            <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
                <h2
                    data-anim="title"
                    className="font-fragment mb-6 text-[48px] leading-[56px] font-400 tracking-[0.25px] text-ink-text lg:mb-8 lg:text-[104px] lg:leading-[120px]"
                >
                    Unlock global demand
                </h2>
                <h3
                    data-anim="subtitle"
                    className="font-geist mx-auto m-0 max-w-[900px] text-[18px] leading-[26px] font-500 tracking-[0.15px] text-ink-text lg:max-w-none lg:text-[24px] lg:leading-8"
                >
                    Connect with guests from around the world via our app and website. Take only the
                    rides that suit your schedule.
                </h3>
            </div>
        </section>
    );
}
