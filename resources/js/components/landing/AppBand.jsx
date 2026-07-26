import { IMG } from './motion';
import { useSectionAnim } from './useSectionAnim';

export default function AppBand() {
    const rootRef = useSectionAnim();

    return (
        <section id="app" ref={rootRef} data-anim="section" className="bg-tint py-12 sm:py-16 lg:py-24">
            <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-4 sm:gap-12 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:px-12">
                <div className="w-full max-w-md flex-1 text-center lg:max-w-[33%] lg:text-left">
                    <h2
                        data-anim="title"
                        className="font-fragment text-[1.75rem] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[2.75rem] sm:leading-[3.25rem] lg:text-[4rem] lg:leading-[4.5rem]"
                    >
                        We move with you.
                    </h2>
                    <p
                        data-anim="subtitle"
                        className="font-fragment mt-3 text-[1.125rem] leading-7 font-400 text-ink-text sm:mt-4 sm:text-[1.375rem] sm:leading-8 lg:text-[1.5rem]"
                    >
                        Have all your journeys in the palm of your hand with the AL MAJD app.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 lg:justify-start">
                        <a href="#" data-anim="badge" aria-label="Download on the App Store">
                            <img src={IMG.appStoreLight} alt="Download on the App Store" className="h-10 w-auto" />
                        </a>
                        <a href="#" data-anim="badge" aria-label="Get it on Google Play">
                            <img src={IMG.playStoreLight} alt="Get it on Google Play" className="h-10 w-auto" />
                        </a>
                    </div>
                </div>
                <div data-anim="right" className="w-full flex-[2] overflow-hidden px-2 sm:px-0">
                    <img
                        src={IMG.platform}
                        alt="AL MAJD platform"
                        className="mx-auto h-auto w-full max-w-3xl object-contain"
                    />
                </div>
            </div>
        </section>
    );
}
