import { useSectionAnim } from './useSectionAnim';

export default function Sustainability() {
    const rootRef = useSectionAnim();

    return (
        <section
            ref={rootRef}
            data-anim="section"
            className="flex min-h-0 items-center bg-white py-12 sm:min-h-[380px] sm:py-16 lg:min-h-[450px] lg:py-20"
        >
            <div className="mx-auto flex w-full max-w-[1170px] flex-col items-center px-4 text-center sm:px-6 lg:px-12">
                <h2
                    data-anim="title"
                    className="font-fragment text-[1.375rem] leading-8 font-400 text-ink-text sm:text-[1.75rem] sm:leading-9"
                >
                    Sustainability partners
                </h2>
                <div className="mt-8 flex w-full flex-col items-center gap-8 sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-12 lg:gap-16">
                    <a
                        href="#excellence"
                        data-anim="item"
                        className="block transition-transform duration-500 hover:scale-105"
                        aria-label="Climate Pledge"
                    >
                        <img
                            src="/images/partner-climate.svg"
                            alt="Climate Pledge"
                            className="h-[72px] w-[110px] sm:h-[94px] sm:w-[140px]"
                        />
                    </a>
                    <a
                        href="#excellence"
                        data-anim="item"
                        className="block transition-transform duration-500 hover:scale-105"
                        aria-label="Leaders"
                    >
                        <img
                            src="/images/partner-leaders.svg"
                            alt="Leaders"
                            className="h-[72px] w-[110px] sm:h-[94px] sm:w-[140px]"
                        />
                    </a>
                    <a
                        href="#excellence"
                        data-anim="item"
                        className="block transition-transform duration-500 hover:scale-105"
                        aria-label="South Pole"
                    >
                        <img
                            src="/images/partner-southpole.svg"
                            alt="South Pole"
                            className="h-[72px] w-[110px] sm:h-[94px] sm:w-[140px]"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
}
