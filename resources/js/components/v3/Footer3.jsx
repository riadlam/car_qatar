import Logo3 from './Logo3';

const COLS = [
    {
        title: 'Services',
        links: ['Airport to hotel', 'Hotel to airport', 'Meet & greet', 'Hotel-area hire'],
    },
    {
        title: 'Areas we serve',
        links: ['Hamad International', 'West Bay', 'The Pearl', 'Lusail', 'Msheireb'],
    },
    {
        title: 'Contact',
        links: ['concierge@almajd.com', '+974 4000 0000', 'Doha, Qatar'],
    },
];

export default function Footer3() {
    return (
        <footer className="bg-[#14060c] pt-16 pb-8 text-[#f7f2ea] sm:pt-20 sm:pb-10">
            <div className="mx-auto max-w-[88rem] px-4 sm:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Logo3 dark />
                        <p className="mt-6 max-w-xs font-grotesk text-sm leading-relaxed text-[#f7f2ea]/50">
                            Private chauffeur transfers between Doha hotels and Hamad International Airport —
                            for guests who value time and discretion.
                        </p>
                        <div className="mt-6 flex gap-3">
                            {['in', 'ig', 'x'].map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f7f2ea]/12 font-grotesk text-xs uppercase text-[#f7f2ea]/60 transition hover:border-[#c9a24b]/60 hover:text-[#c9a24b]"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {COLS.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-grotesk text-[11px] font-600 tracking-[0.24em] text-[#c9a24b] uppercase">
                                {col.title}
                            </h4>
                            <ul className="mt-5 space-y-3">
                                {col.links.map((l) => (
                                    <li key={l}>
                                        <a href="#" className="font-grotesk text-sm text-[#f7f2ea]/55 transition hover:text-[#f7f2ea]">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#f7f2ea]/10 pt-8 sm:flex-row">
                    <p className="font-grotesk text-[11px] tracking-[0.14em] text-[#f7f2ea]/40 uppercase">
                        © {new Date().getFullYear()} AL MAJD · Luxury Car Transport · Qatar
                    </p>
                    <div className="flex gap-6">
                        {['Terms', 'Privacy', 'Legal'].map((l) => (
                            <a
                                key={l}
                                href="#"
                                className="font-grotesk text-[11px] tracking-[0.14em] text-[#f7f2ea]/40 uppercase transition hover:text-[#f7f2ea]/70"
                            >
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
