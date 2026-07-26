import { CORP_IMG } from './assets';

/**
 * Blacklane SEO Hero parity (corporations):
 * 1) Title in content container above
 * 2) Full-bleed image strip below
 * Not a title-over-image overlay.
 */
export default function Hero() {
    return (
        <div
            id="top"
            className="relative mx-auto flex w-full min-w-[320px] flex-col bg-page pt-[72px] lg:pt-[88px]"
        >
            <section className="box-border mx-auto w-full max-w-[1170px] px-4 sm:px-6">
                <h1 className="font-fragment m-0 my-5 p-0 text-[32px] leading-10 font-400 tracking-[0.15px] text-ink-text md:text-[40px] md:leading-[48px] lg:text-[44px] lg:leading-[56px]">
                    Corporate Travel Solutions for Business Executives
                </h1>
            </section>

            <div
                className="relative z-0 w-full overflow-hidden"
                style={{ ['--desktop-aspect-ratio']: '3.6' }}
            >
                <picture>
                    <source media="(max-width: 480px)" srcSet={CORP_IMG.hero} type="image/webp" />
                    <source media="(max-width: 768px)" srcSet={CORP_IMG.hero} type="image/webp" />
                    <img
                        src={CORP_IMG.hero}
                        alt="A woman smiles after getting out of an AL MAJD limousine service."
                        loading="eager"
                        className="block h-[264px] w-full object-cover object-center md:h-[370px] min-[1200px]:h-[400px] min-[1440px]:h-[550px]"
                    />
                </picture>
            </div>
        </div>
    );
}
