import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import BookingSidebar from '../components/booking/BookingSidebar';
import Picture from '../components/booking/Picture';
import {
    IconArrowDown,
    IconChevronLeft,
    IconChevronRight,
    IconInfo,
    IconLuggage,
    IconPassengers,
    IncludedIcon,
} from '../components/booking/icons';
import { INCLUDED, VEHICLES, formatMoney } from '../data/bookingVehicles';

function formatTimeParts(timeStr) {
    if (!timeStr) return { time: '10:15', period: 'pm' };
    const [hRaw, mRaw] = timeStr.split(':');
    let h = Number(hRaw);
    const m = mRaw || '00';
    const period = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    if (h === 0) h = 12;
    return { time: `${h}:${m}`, period };
}

export default function Booking() {
    const [params] = useSearchParams();
    const initialVehicle = params.get('vehicle') || 'business';
    const [selectedId, setSelectedId] = useState(
        () => VEHICLES.find((v) => v.id === initialVehicle)?.id || 'business',
    );
    const [vehicleIndex, setVehicleIndex] = useState(0);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [capacityTab, setCapacityTab] = useState('luggage');
    const [luggageId, setLuggageId] = useState('cabin_asset');
    const [seatingId, setSeatingId] = useState('maximum_asset');
    const detailsRef = useRef(null);
    const vehicleTrackRef = useRef(null);

    const vehicle = useMemo(
        () => VEHICLES.find((v) => v.id === selectedId) || VEHICLES[0],
        [selectedId],
    );

    const pickupLabel = params.get('pickup') || 'Embassy Of Algeria';
    const { time: pickupTime, period: pickupPeriod } = formatTimeParts(params.get('time') || '22:15');
    const mapLat = Number(params.get('lat')) || 28.564641;
    const mapLng = Number(params.get('lng')) || 77.159464;

    useEffect(() => {
        setHighlightIndex(0);
        setLuggageId(vehicle.luggageOptions[0]?.id || 'cabin_asset');
        setSeatingId(vehicle.seatingOptions[0]?.id || 'maximum_asset');
        setCapacityTab('luggage');
    }, [vehicle]);

    useEffect(() => {
        const idx = VEHICLES.findIndex((v) => v.id === selectedId);
        if (idx >= 0) setVehicleIndex(idx);
    }, [selectedId]);

    const scrollVehicles = (dir) => {
        const next = Math.min(Math.max(vehicleIndex + dir, 0), VEHICLES.length - 1);
        setVehicleIndex(next);
        setSelectedId(VEHICLES[next].id);
        const el = vehicleTrackRef.current;
        if (el) {
            const card = el.children[next];
            card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    };

    const luggageOpt =
        vehicle.luggageOptions.find((o) => o.id === luggageId) || vehicle.luggageOptions[0];
    const seatingOpt =
        vehicle.seatingOptions.find((o) => o.id === seatingId) || vehicle.seatingOptions[0];
    const highlight = vehicle.highlights[highlightIndex] || vehicle.highlights[0];

    return (
        <SiteLayout
            className="relative min-w-0 overflow-x-clip bg-page"
            mainClassName="booking-page"
            showFooter={false}
        >
            <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
                {/* Vehicles */}
                <div className="col-start-1 row-start-1 min-w-0 px-4 pt-[120px] sm:px-6 sm:pt-[88px] lg:px-10 xl:px-14">
                    <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                        Choose your experience
                    </h1>

                    <div className="relative mt-6" data-cy="vehicle-results">
                        <div
                            role="region"
                            aria-roledescription="carousel"
                            aria-label="Vehicle class options"
                        >
                            <div role="radiogroup" aria-label="Select vehicle class">
                                <div
                                    ref={vehicleTrackRef}
                                    className="booking-vehicle-track flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                >
                                    {VEHICLES.map((v) => {
                                        const checked = v.id === selectedId;
                                        return (
                                            <label
                                                key={v.id}
                                                data-cy="vehicle-card"
                                                className={`booking-vehicle-card relative w-[min(280px,78vw)] shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl border bg-white transition sm:w-[300px] ${
                                                    checked
                                                        ? 'border-wine-700 shadow-[0_0_0_1px_#5b0520]'
                                                        : 'border-[#e5e3df] hover:border-[#cfcbc3]'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="vehicle-selection"
                                                    className="sr-only"
                                                    value={v.id}
                                                    checked={checked}
                                                    onChange={() => setSelectedId(v.id)}
                                                />
                                                <div className="aspect-[16/10] overflow-hidden bg-[#f3f1ec]">
                                                    <Picture
                                                        lg={v.main.lg}
                                                        sm={v.main.sm}
                                                        imgClassName="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="flex items-start justify-between gap-3 px-4 py-3">
                                                    <div>
                                                        <span className="font-geist block text-[16px] leading-6 font-500 text-ink-text">
                                                            {v.name}
                                                        </span>
                                                        <div
                                                            className="mt-1.5 flex items-center gap-3 text-ink-text"
                                                            aria-label={`${v.passengers} passengers, ${v.luggage} luggages`}
                                                        >
                                                            <span className="inline-flex items-center gap-1">
                                                                <IconPassengers className="h-5 w-5" />
                                                                <span className="font-geist text-[14px]">{v.passengers}</span>
                                                            </span>
                                                            <span className="inline-flex items-center gap-1">
                                                                <IconLuggage className="h-5 w-5" />
                                                                <span className="font-geist text-[14px]">{v.luggage}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="font-geist shrink-0 text-[16px] leading-6 font-500 text-ink-text">
                                                        {formatMoney(v.total, v.currency)}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                aria-label="Previous slide"
                                disabled={vehicleIndex === 0}
                                onClick={() => scrollVehicles(-1)}
                                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#d8d4cc] bg-white text-ink-text transition enabled:hover:bg-page disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                <IconChevronLeft />
                            </button>
                            <button
                                type="button"
                                aria-label="Next slide"
                                disabled={vehicleIndex >= VEHICLES.length - 1}
                                onClick={() => scrollVehicles(1)}
                                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#d8d4cc] bg-white text-ink-text transition enabled:hover:bg-page disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                <IconChevronRight />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                            className="font-geist mt-4 inline-flex cursor-pointer items-center gap-2 text-[14px] font-500 text-ink-text underline-offset-2 hover:underline"
                        >
                            <IconArrowDown />
                            Explore {vehicle.name} details
                        </button>
                    </div>
                </div>

                {/* Map + reserve — under vehicles on mobile; sticky right column on desktop */}
                <div className="col-start-1 row-start-2 mt-6 w-full border-t border-[#e8e6e1] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:border-t-0 lg:border-l lg:border-[#e8e6e1] lg:pt-[80px]">
                    <BookingSidebar
                        vehicle={vehicle}
                        pickupLabel={pickupLabel}
                        pickupTime={pickupTime}
                        pickupPeriod={pickupPeriod}
                        mapLat={mapLat}
                        mapLng={mapLng}
                    />
                </div>

                {/* Details */}
                <div
                    ref={detailsRef}
                    className="col-start-1 row-start-3 min-w-0 scroll-mt-24 px-4 pb-10 sm:px-6 lg:row-start-2 lg:px-10 lg:pb-16 xl:px-14"
                >
                        <hr className="mt-8 border-0 border-t border-[#e8e6e1] lg:mt-8" />

                        {/* Highlights carousel */}
                        <div className="relative py-8">
                            <div
                                role="region"
                                aria-roledescription="carousel"
                                aria-label="Service highlights"
                                className="overflow-hidden rounded-2xl bg-[#ebe8e2]"
                            >
                                <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
                                    {vehicle.highlights.map((h, i) => (
                                        <div
                                            key={`${vehicle.id}-h-${i}`}
                                            className={`absolute inset-0 transition-opacity duration-500 ${
                                                i === highlightIndex ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            aria-hidden={i !== highlightIndex}
                                        >
                                            <Picture
                                                lg={h.lg}
                                                sm={h.sm}
                                                imgClassName="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute top-1/2 right-3 left-3 flex -translate-y-1/2 justify-between pointer-events-none">
                                <button
                                    type="button"
                                    aria-label="Previous slide"
                                    disabled={highlightIndex === 0}
                                    onClick={() => setHighlightIndex((i) => Math.max(0, i - 1))}
                                    className="pointer-events-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink-text shadow-sm backdrop-blur transition enabled:hover:bg-white disabled:opacity-35"
                                >
                                    <IconChevronLeft />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next slide"
                                    disabled={highlightIndex >= vehicle.highlights.length - 1}
                                    onClick={() =>
                                        setHighlightIndex((i) =>
                                            Math.min(vehicle.highlights.length - 1, i + 1),
                                        )
                                    }
                                    className="pointer-events-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink-text shadow-sm backdrop-blur transition enabled:hover:bg-white disabled:opacity-35"
                                >
                                    <IconChevronRight />
                                </button>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="font-geist m-0 text-[14px] leading-5 text-ink-text">
                                    {highlight.caption}
                                </p>
                                <div
                                    role="group"
                                    aria-label="Choose slide to display"
                                    className="flex gap-2"
                                >
                                    {vehicle.highlights.map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            aria-label={`Slide ${i + 1}`}
                                            aria-current={i === highlightIndex ? 'step' : undefined}
                                            onClick={() => setHighlightIndex(i)}
                                            className={`h-2 cursor-pointer rounded-full transition ${
                                                i === highlightIndex
                                                    ? 'w-6 bg-wine-700'
                                                    : 'w-2 bg-[#cfcbc3] hover:bg-[#a8a49c]'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="font-geist mt-4 m-0 max-w-2xl text-[16px] leading-6 text-ink-text">
                                {vehicle.description}
                            </p>
                        </div>

                        <hr className="border-0 border-t border-[#e8e6e1]" />

                        {/* What's included */}
                        <section className="py-8">
                            <h2 className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-ink-text sm:text-[24px]">
                                What&apos;s included
                            </h2>
                            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {INCLUDED.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3">
                                        <IncludedIcon type={item.icon} />
                                        <p className="font-geist m-0 pt-1.5 text-[14px] leading-5 text-ink-text">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <hr className="border-0 border-t border-[#e8e6e1]" />

                        {/* Capacity */}
                        <section className="py-8">
                            <h2 className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-ink-text sm:text-[24px]">
                                Capacity
                            </h2>
                            <div className="mt-5">
                                <div
                                    role="tablist"
                                    aria-label="Capacity information"
                                    className="inline-flex rounded-full border border-[#e0ddd6] bg-white p-1"
                                >
                                    {[
                                        { id: 'luggage', label: 'Luggage' },
                                        { id: 'seating', label: 'Seating' },
                                    ].map((tab) => {
                                        const active = capacityTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                role="tab"
                                                aria-selected={active}
                                                onClick={() => setCapacityTab(tab.id)}
                                                className={`font-geist cursor-pointer rounded-full px-4 py-2 text-[14px] font-500 transition ${
                                                    active
                                                        ? 'bg-wine-700 text-white'
                                                        : 'text-ink-text hover:bg-page'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-5">
                                    {capacityTab === 'luggage' ? (
                                        <div role="tabpanel">
                                            <p className="font-geist m-0 max-w-2xl text-[14px] leading-5 text-muted">
                                                Based on standard luggage sizes, which may differ from yours. You can
                                                specify the details of your luggage in the &quot;Pickup notes&quot; on
                                                the next step.
                                            </p>
                                            <div
                                                role="radiogroup"
                                                aria-label="Luggage options"
                                                className="mt-4 flex flex-wrap gap-2"
                                            >
                                                {vehicle.luggageOptions.map((opt) => {
                                                    const on = opt.id === luggageId;
                                                    return (
                                                        <label
                                                            key={opt.id}
                                                            className={`font-geist cursor-pointer rounded-full border px-4 py-2 text-[14px] transition ${
                                                                on
                                                                    ? 'border-wine-700 bg-wine-50 text-wine-800'
                                                                    : 'border-[#e0ddd6] bg-white text-ink-text hover:border-[#c9c5bc]'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="luggage-opt"
                                                                className="sr-only"
                                                                value={opt.id}
                                                                checked={on}
                                                                onChange={() => setLuggageId(opt.id)}
                                                            />
                                                            {opt.label}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            <div className="mt-5 overflow-hidden rounded-2xl bg-[#ebe8e2]">
                                                <Picture
                                                    lg={luggageOpt.image.lg}
                                                    sm={luggageOpt.image.sm}
                                                    imgClassName="mx-auto max-h-[320px] w-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div role="tabpanel">
                                            <p className="font-geist m-0 max-w-2xl text-[14px] leading-5 text-muted">
                                                Baby and child seats are available on request. Add your request in
                                                &quot;Pickup notes&quot; on the next step and include the child&apos;s
                                                age.
                                            </p>
                                            <div
                                                role="radiogroup"
                                                aria-label="Seating options"
                                                className="mt-4 flex flex-wrap gap-2"
                                            >
                                                {vehicle.seatingOptions.map((opt) => {
                                                    const on = opt.id === seatingId;
                                                    return (
                                                        <label
                                                            key={opt.id}
                                                            className={`font-geist cursor-pointer rounded-full border px-4 py-2 text-[14px] transition ${
                                                                on
                                                                    ? 'border-wine-700 bg-wine-50 text-wine-800'
                                                                    : 'border-[#e0ddd6] bg-white text-ink-text hover:border-[#c9c5bc]'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="seating-opt"
                                                                className="sr-only"
                                                                value={opt.id}
                                                                checked={on}
                                                                onChange={() => setSeatingId(opt.id)}
                                                            />
                                                            {opt.label}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            <div className="mt-5 overflow-hidden rounded-2xl bg-[#ebe8e2]">
                                                <Picture
                                                    lg={seatingOpt.image.lg}
                                                    sm={seatingOpt.image.sm}
                                                    imgClassName="mx-auto max-h-[320px] w-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <hr className="border-0 border-t border-[#e8e6e1]" />

                        {/* Price breakdown */}
                        <section className="py-8">
                            <div className="max-w-xl">
                                <h2 className="font-fragment m-0 text-[22px] leading-8 font-400 tracking-[0.25px] text-ink-text sm:text-[24px]">
                                    Price breakdown
                                </h2>
                                <div className="mt-5 flex flex-col gap-3">
                                    {[
                                        { label: 'Base fare', value: vehicle.base },
                                        { label: 'Lead time surcharge', value: vehicle.leadTime },
                                        { label: 'Estimated tax', value: vehicle.tax },
                                    ].map((row) => (
                                        <div key={row.label} className="flex items-baseline gap-3">
                                            <span className="font-geist shrink-0 text-[14px] text-ink-text">
                                                {row.label}
                                            </span>
                                            <span className="min-h-px flex-1 border-b border-dotted border-[#cfcbc3]" />
                                            <span className="font-geist shrink-0 text-[14px] text-ink-text">
                                                {formatMoney(row.value, vehicle.currency)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <hr className="my-5 border-0 border-t border-[#e8e6e1]" />

                                <p className="font-geist m-0 text-[14px] font-500 text-ink-text">Please note:</p>
                                <ul className="mt-3 m-0 flex list-none flex-col gap-3 p-0">
                                    {[
                                        'Guest/luggage capacities must be abided by for safety reasons. If you are unsure, select a larger class as chauffeurs may turn down service when they are exceeded.',
                                        'The vehicle images above are examples. You may get a different vehicle of similar quality.',
                                        'Need extra assistance? Add details in “Pickup notes” in the next step. Include dimensions for assistive devices (especially folding wheelchairs) so we can confirm fit. Rigid-frame wheelchairs generally cannot be accommodated. For more space, choose Business Van.',
                                    ].map((note) => (
                                        <li key={note.slice(0, 24)} className="flex gap-2">
                                            <IconInfo />
                                            <span className="font-geist text-[14px] leading-5 text-muted">{note}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                </div>
            </div>
        </SiteLayout>
    );
}
