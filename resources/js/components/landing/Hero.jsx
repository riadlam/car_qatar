import { IMG } from './motion';
import BookingWidget from './BookingWidget';
import { useHeroAnim } from './useSectionAnim';

/** Sampled from the hero photo bottom — mobile extension colour (Blacklane-style) */
const HERO_EXTEND = '#5b5754';

export default function Hero() {
    const rootRef = useHeroAnim();

    return (
        <section id="top" ref={rootRef} aria-label="Hero section" className="relative w-full">
            {/* Shared booking anchor — works for mobile + desktop scroll targets */}
            <div id="book" className="pointer-events-none absolute top-0 h-0 w-0 scroll-mt-[88px]" aria-hidden="true" />
            {/*
              Mobile / tablet:
              - Photo is ONLY the top block (not a full-section background)
              - Solid grey below extends the photo (#5b5754 from image bottom)
              - Then Hero_content order: title → booking widget
            */}
            <div data-hero="mobile" className="lg:hidden" style={{ backgroundColor: HERO_EXTEND }}>
                {/* Top image only */}
                <div className="relative h-[38svh] min-h-[240px] max-h-[340px] w-full overflow-hidden sm:h-[42svh] sm:max-h-[400px]">
                    <img
                        src={IMG.hero}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
                    />
                    {/* Nav readability */}
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent"
                        aria-hidden="true"
                    />
                    {/* Soft blend into the grey extension */}
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                        style={{
                            background: `linear-gradient(to bottom, transparent, ${HERO_EXTEND})`,
                        }}
                        aria-hidden="true"
                    />
                </div>

                {/* Hero_content — title then booking (same order as source) */}
                <div
                    data-anim="hero-content"
                    className="relative z-[1] -mt-6 flex w-full flex-col items-center px-5 pb-10 sm:-mt-8 sm:px-8 sm:pb-12"
                >
                    <h1
                        data-anim="hero-title"
                        className="font-fragment mb-5 max-w-[20rem] text-center text-[1.75rem] leading-9 font-400 tracking-[0.25px] text-hero-title sm:mb-6 sm:max-w-[26rem] sm:text-[2.125rem] sm:leading-10"
                    >
                        Your chauffeur awaits.
                    </h1>

                    <div data-anim="hero-widget" className="w-full max-w-lg">
                        <BookingWidget variant="mobile" />
                    </div>
                </div>
            </div>

            {/* Desktop — unchanged full-bleed fixed hero */}
            <div
                data-hero="desktop"
                className="relative hidden min-h-[100svh] w-full bg-cover bg-center bg-fixed lg:flex"
                style={{ backgroundImage: `url(${IMG.hero})` }}
            >
                <div
                    data-anim="hero-content"
                    className="relative z-[1] flex w-full flex-1 flex-col items-center justify-end px-6 pb-10"
                >
                    <h1
                        data-anim="hero-title"
                        className="font-fragment mb-6 max-w-[800px] text-center text-[4rem] leading-[4.5rem] font-400 tracking-[0.25px] text-hero-title"
                    >
                        Your chauffeur awaits.
                    </h1>
                    <div data-anim="hero-widget" className="w-full max-w-[1120px]">
                        <BookingWidget variant="desktop" />
                    </div>
                </div>
            </div>
        </section>
    );
}
