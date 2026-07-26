import { BIZ_IMG, CREATE_ACCOUNT_HREF, SIGN_IN_HREF } from './assets';

/** Blacklane CtaHero parity for Business overview */
export default function CtaHero() {
    return (
        <section
            id="top"
            className="flex min-h-[100vh] flex-col bg-white"
            aria-label="Corporate transportation"
        >
            <div
                className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-b-[16px] bg-cover pb-[72px] lg:pb-[96px]"
                style={{
                    backgroundImage: `url(${BIZ_IMG.hero})`,
                    backgroundPosition: 'center top',
                    backgroundSize: 'cover',
                }}
            >
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(15,19,25,0.45) 0%, transparent 40%), linear-gradient(0deg, rgba(15,19,25,0.65) 0%, transparent 50%)',
                    }}
                    aria-hidden="true"
                />
                <div className="relative z-[1] mx-auto flex w-full max-w-[900px] flex-col items-center gap-4 px-6 py-8 text-center lg:px-8">
                    <h1 className="font-fragment m-0 mb-5 text-[28px] leading-9 font-400 tracking-[0.25px] text-white sm:text-[48px] sm:leading-[56px] lg:text-[64px] lg:leading-[72px]">
                        Corporate transportation services
                    </h1>
                    <p className="font-geist m-0 text-[18px] leading-7 font-500 tracking-[0.15px] text-white sm:text-[22px] sm:leading-8 lg:text-[28px] lg:leading-9">
                        Five-star chauffeurs worldwide for corporations, agencies, and partners.
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-center gap-5 bg-white px-6 py-8 text-center">
                <a
                    href={CREATE_ACCOUNT_HREF}
                    className="font-geist inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                >
                    Create a business account
                </a>
                <p className="font-geist m-0 text-[16px] leading-6 text-ink-text">
                    Already have an account?{' '}
                    <a
                        href={`${SIGN_IN_HREF}?from=${encodeURIComponent('/business')}`}
                        className="cursor-pointer font-500 text-wine-700 underline-offset-2 hover:underline"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </section>
    );
}
