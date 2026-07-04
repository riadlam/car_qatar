const ITEMS = [
    'Airport to hotel',
    'Hotel to airport',
    'Hamad International',
    'West Bay',
    'The Pearl',
    'Lusail',
    'Msheireb',
    'Corniche hotels',
];

export default function Ticker3() {
    const items = [...ITEMS, ...ITEMS];
    return (
        <div className="overflow-hidden border-y border-[#5b0520]/20 bg-[#5b0520] py-4">
            <div className="flex w-max animate-marquee items-center gap-10">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-10">
                        <span className="whitespace-nowrap font-editorial text-xl italic text-[#f7f2ea]/90 sm:text-2xl">
                            {item}
                        </span>
                        <span className="text-[#c9a24b]">✦</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
