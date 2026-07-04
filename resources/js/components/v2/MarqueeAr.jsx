import { CITIES } from './data';

export default function MarqueeAr() {
    const items = [...CITIES, ...CITIES];

    return (
        <div className="relative overflow-hidden border-y border-gold-500/10 bg-ink-soft py-4 sm:py-6">
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink-soft to-transparent sm:w-24 lg:w-32" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink-soft to-transparent sm:w-24 lg:w-32" />
            <div className="marquee-rtl flex w-max animate-marquee items-center gap-8 sm:gap-12">
                {items.map((city, i) => (
                    <div key={i} className="flex items-center gap-8 sm:gap-12">
                        <span className="whitespace-nowrap font-ar-display text-xl text-ivory/50 sm:text-2xl">
                            {city}
                        </span>
                        <span className="h-1 w-1 shrink-0 rounded-full bg-gold-500/60" />
                    </div>
                ))}
            </div>
        </div>
    );
}
