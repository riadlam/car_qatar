import { MapPinSvg } from './icons';

/**
 * Map panel — OSM embed (no Google key). Pin + pickup chip overlay match Blacklane layout.
 */
export default function BookingMap({ pickupLabel = 'Pickup location', pickupTime = '10:15', pickupPeriod = 'pm', lat = 36.7538, lng = 3.0588 }) {
    const delta = 0.012;
    const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
        <div className="booking-map relative h-[220px] w-full overflow-hidden bg-[#e5e3df] lg:h-[280px]">
            <iframe
                title="Pickup map"
                src={src}
                className="absolute inset-0 h-full w-full border-0 grayscale-[15%] contrast-[0.95]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-full">
                <MapPinSvg />
            </div>
            <div className="absolute left-1/2 top-2.5 z-10 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-stretch gap-0 overflow-hidden rounded-lg bg-white shadow-[0_2px_12px_rgba(15,19,25,0.12)]">
                <div className="min-w-0 px-3 py-2">
                    <div className="font-geist text-[12px] leading-4 text-muted">Pick up</div>
                    <div className="font-geist truncate text-[14px] leading-5 font-500 text-ink-text">{pickupLabel}</div>
                </div>
                <div className="flex shrink-0 items-center border-l border-[#eef1f3] bg-page px-3 py-2">
                    <div className="text-center">
                        <div className="font-geist text-[14px] leading-5 font-500 text-ink-text">{pickupTime}</div>
                        <div className="font-geist text-[12px] leading-4 text-muted">{pickupPeriod}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
