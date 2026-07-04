const PLACES = [
    'Hamad Airport', 'West Bay', 'The Pearl', 'Lusail', 'Msheireb', 'Corniche',
    'Katara', 'Al Waab', 'Education City', 'Souq Waqif', 'Al Sadd', 'Doha Hotels',
];

export default function Marquee() {
    const items = [...PLACES, ...PLACES];

    return (
        <div className="relative overflow-hidden border-y border-white/5 bg-ink-soft py-4 sm:py-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-ink-soft to-transparent sm:w-24 lg:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink-soft to-transparent sm:w-24 lg:w-32" />
            <div className="flex w-max animate-marquee items-center gap-8 sm:gap-12">
                {items.map((place, i) => (
                    <div key={i} className="flex items-center gap-8 sm:gap-12">
                        <span className="whitespace-nowrap font-display text-sm font-500 tracking-[0.22em] text-ivory/45 uppercase sm:text-lg sm:tracking-[0.28em]">
                            {place}
                        </span>
                        <span className="h-1 w-1 shrink-0 rounded-full bg-gold-500/60" />
                    </div>
                ))}
            </div>
        </div>
    );
}
