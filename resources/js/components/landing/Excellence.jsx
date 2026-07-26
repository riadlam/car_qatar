import { useSectionAnim } from './useSectionAnim';
import iconWorldwide from './icons/excellence-worldwide.svg?raw';
import iconVehicles from './icons/excellence-vehicles.svg?raw';
import iconSafe from './icons/excellence-safe.svg?raw';

const PILLARS = [
    {
        title: 'Available worldwide',
        copy: 'Expert local chauffeurs in 500+ cities',
        icon: iconWorldwide,
    },
    {
        title: 'High-end vehicles',
        copy: 'Only the best recent models',
        icon: iconVehicles,
    },
    {
        title: 'Safe travels',
        copy: 'Trained professionals and reliable pickups',
        icon: iconSafe,
    },
];

export default function Excellence() {
    const rootRef = useSectionAnim();

    return (
        <section
            id="excellence"
            ref={rootRef}
            data-anim="section"
            className="w-full bg-page px-4 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-24"
        >
            <div className="mx-auto max-w-[1170px]">
                <div className="mb-8 text-center sm:mb-12 lg:mb-16">
                    <h2
                        data-anim="title"
                        className="font-fragment mx-auto mb-4 max-w-[800px] text-[1.75rem] leading-9 font-400 tracking-[0.25px] text-ink-text sm:mb-6 sm:text-[2.75rem] sm:leading-[3.25rem] lg:text-[5rem] lg:leading-[6rem]"
                    >
                        Expect excellence.
                    </h2>
                    <h3
                        data-anim="subtitle"
                        className="font-geist m-0 mx-auto max-w-[34rem] text-[1.125rem] leading-7 font-500 tracking-[0.15px] text-ink-text sm:text-[1.375rem] sm:leading-8 lg:max-w-none lg:text-[1.75rem] lg:leading-9 lg:tracking-[0.25px]"
                    >
                        Leave the car refreshed and ready for what&apos;s next.
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {PILLARS.map((p) => (
                        <div
                            key={p.title}
                            data-anim="item"
                            className="flex h-full min-h-0 flex-col rounded-2xl bg-tint p-5 text-center sm:p-6 lg:p-8 md:last:col-span-2 lg:last:col-span-1"
                        >
                            <div className="flex flex-1 flex-col gap-4 sm:gap-6">
                                <h3 className="font-geist m-0 text-[1.25rem] leading-7 font-500 tracking-[0.15px] text-ink-text sm:text-[1.5rem] sm:leading-8 lg:text-[1.75rem] lg:leading-9 lg:tracking-[0.25px]">
                                    {p.title}
                                </h3>
                                <p className="font-geist m-0 flex-1 text-[16px] leading-6 font-400 tracking-[0.15px] text-ink-text sm:text-[18px] sm:leading-[26px] sm:tracking-[0.25px]">
                                    {p.copy}
                                </p>
                                {/* Crisp icons — no blur/filter; aspect ratio preserved */}
                                <div
                                    className="excellence-icon mt-1 flex w-full items-end justify-center overflow-visible lg:mt-8 [&_svg]:h-auto [&_svg]:w-[200px] [&_svg]:max-w-full"
                                    dangerouslySetInnerHTML={{ __html: p.icon }}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
