import { useSectionAnim } from '../landing/useSectionAnim';

export default function Quote() {
    const rootRef = useSectionAnim();

    return (
        <section
            ref={rootRef}
            data-anim="section"
            className="bg-page px-4 py-16 text-center sm:px-8 sm:py-20 lg:px-12 lg:py-28"
        >
            <div className="mx-auto max-w-[1200px]">
                <blockquote
                    data-anim="title"
                    className="font-fragment m-0 text-[1.5rem] leading-8 font-400 tracking-[0.25px] text-wine-400 sm:text-[2rem] sm:leading-10 lg:text-[3.5rem] lg:leading-[4.25rem]"
                >
                    &ldquo;AL MAJD is 60% of my revenue. I&apos;ve grown from 2 to 20 chauffeurs and have
                    10 vehicles from working with them.&rdquo;
                </blockquote>
                <p
                    data-anim="subtitle"
                    className="font-geist mt-6 whitespace-pre-line text-[16px] leading-6 font-500 tracking-[0.15px] text-ink-text sm:mt-8 sm:text-[18px] sm:leading-7"
                >
                    {'Angel T.\nAL MAJD chauffeur, Madrid'}
                </p>
            </div>
        </section>
    );
}
