import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import BookingSidebar from '../components/booking/BookingSidebar';
import TripOverview from '../components/booking/TripOverview';
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
import { formatMoney } from '../data/bookingVehicles';
import { createQuotes } from '../api/quotes';
import { fetchSeatAddons, fetchVehicleClasses } from '../api/catalog';
import Skeleton from '../components/ui/Skeleton';
import { tripParamsToQuotePayload, tripRoutePoints, tripSearchIsComplete } from '../utils/bookingMappers';

function seatAmount(addons, id) {
    if (!id || id === 'none') return 0;
    const found = addons.find((opt) => opt.id === id);
    return found ? Number(found.price) || 0 : 0;
}

function money(value) {
    return Math.round(Number(value) * 100) / 100;
}

function adjustQuotesForSeat(quotes, fromId, toId, addons) {
    const from = seatAmount(addons, fromId);
    const to = seatAmount(addons, toId);
    if (from === to) return quotes;
    const next = {};
    Object.entries(quotes).forEach(([slug, quote]) => {
        const subtotal = Number(quote.subtotal);
        const tax = Number(quote.tax_amount);
        const rate = subtotal > 0 ? tax / subtotal : 0;
        const nextSubtotal = money(subtotal - from + to);
        const nextTax = money(nextSubtotal * rate);
        const fees = Number(quote.fees) || 0;
        const discount = Number(quote.discount) || 0;
        next[slug] = {
            ...quote,
            subtotal: nextSubtotal,
            tax_amount: nextTax,
            total: money(nextSubtotal + nextTax + fees - discount),
        };
    });
    return next;
}
import { durationLabel, SCHOOL_TERMS, serviceLabel } from '../data/bookingServices';
import {
    fallbackIncluded,
    fallbackSeatAddons,
    fallbackVehicles,
    mapSeatAddon,
    mapVehicleClassToCard,
} from '../utils/catalogMappers';

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
    const initialVehicle = params.get('vehicle') || 'van';
    const [catalogVehicles, setCatalogVehicles] = useState(() => fallbackVehicles());
    const [seatAddons, setSeatAddons] = useState(() => fallbackSeatAddons());
    const [selectedId, setSelectedId] = useState(
        () =>
            fallbackVehicles().find((v) => v.id === initialVehicle)?.id ||
            fallbackVehicles()[0]?.id ||
            'van',
    );
    const [vehicleIndex, setVehicleIndex] = useState(0);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [capacityTab, setCapacityTab] = useState('luggage');
    const [luggageId, setLuggageId] = useState('cabin_asset');
    const [seatingId, setSeatingId] = useState('maximum_asset');
    const [seatAddon, setSeatAddon] = useState(
        () => params.get('seat') || 'none',
    );
    const [quoteBySlug, setQuoteBySlug] = useState({});
    const [pricingError, setPricingError] = useState('');
    const [pricingLoading, setPricingLoading] = useState(true);
    const seatAddonsRef = useRef(seatAddons);
    seatAddonsRef.current = seatAddons;
    const pricingCtx = useRef({ seat: seatAddon, trip: params.toString(), ready: false });
    const detailsRef = useRef(null);
    const vehicleTrackRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        Promise.all([fetchVehicleClasses(), fetchSeatAddons()])
            .then(([classes, addons]) => {
                if (cancelled) return;
                const mapped = (Array.isArray(classes) ? classes : [])
                    .map(mapVehicleClassToCard)
                    .filter(Boolean);
                if (mapped.length) {
                    setCatalogVehicles(mapped);
                    const preferred =
                        mapped.find((v) => v.id === initialVehicle)?.id || mapped[0].id;
                    setSelectedId(preferred);
                }
                const seats = (Array.isArray(addons) ? addons : []).map(mapSeatAddon);
                if (seats.length) setSeatAddons(seats);
            })
            .catch(() => {
                if (cancelled) return;
                setCatalogVehicles(fallbackVehicles());
                setSeatAddons(fallbackSeatAddons());
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- initialVehicle from first paint
    }, []);

    const vehicles = useMemo(() => {
        const quoted = Object.keys(quoteBySlug);
        const source = quoted.length
            ? catalogVehicles.filter((v) => quoteBySlug[v.id])
            : catalogVehicles;
        return source.map((v) => {
            const quote = quoteBySlug[v.id];
            if (!quote) {
                return { ...v, total: null, quote_id: null };
            }
            const currency = quote.currency === 'USD' ? 'US$' : quote.currency || v.currency;
            return {
                ...v,
                total: Number(quote.total),
                base: Number(quote.subtotal),
                tax: Number(quote.tax_amount),
                currency,
                quote_id: quote.id,
                distance_km: quote.distance_km,
                route_duration_minutes: quote.route_duration_minutes,
                route_status: quote.route_status,
            };
        });
    }, [catalogVehicles, quoteBySlug]);

    const vehicle = useMemo(
        () => vehicles.find((v) => v.id === selectedId) || vehicles[0],
        [selectedId, vehicles],
    );

    const included = useMemo(
        () => (vehicle?.included?.length ? vehicle.included : fallbackIncluded()),
        [vehicle],
    );

    const serviceId = params.get('service') || 'one_way';
    const pickupLabel = params.get('pickup') || '';
    const dropoffLabel = params.get('dropoff') || '';
    const tripDate = params.get('date') || '';
    const tripTimeRaw = params.get('time') || '';
    const { time: pickupTime, period: pickupPeriod } = formatTimeParts(tripTimeRaw || '12:00');
    const mapLat = Number(params.get('lat'));
    const mapLng = Number(params.get('lng'));
    const routePoints = useMemo(() => tripRoutePoints(params), [params]);
    const termLabel = SCHOOL_TERMS.find((t) => t.value === params.get('term'))?.label;
    const isHourly = serviceId === 'by_hour' || serviceId === 'city_tour' || params.get('mode') === 'hourly';
    const durationText = params.get('duration') ? durationLabel(params.get('duration')) : '';
    const tripSecondary = isHourly && !dropoffLabel ? durationText : '';
    const tripMeta = [
        isHourly && dropoffLabel && durationText ? durationText : null,
        serviceId === 'school_chauffeured' ? termLabel : null,
        params.get('passengers') ? `${params.get('passengers')} passengers` : null,
        params.get('students') ? `${params.get('students')} students` : null,
    ].filter(Boolean);

    useEffect(() => {
        let cancelled = false;
        const tripKey = params.toString();
        const ctx = pricingCtx.current;
        const seatOnly = ctx.ready && ctx.trip === tripKey && ctx.seat !== seatAddon;
        const fromSeat = ctx.seat;
        ctx.seat = seatAddon;
        ctx.trip = tripKey;

        if (seatOnly) {
            setQuoteBySlug((current) => adjustQuotesForSeat(current, fromSeat, seatAddon, seatAddonsRef.current));
        } else if (!ctx.ready) {
            setPricingLoading(true);
        }
        setPricingError('');
        const payload = tripParamsToQuotePayload(params, { seat_addon: seatAddon !== 'none' ? seatAddon : undefined });
        createQuotes(payload)
            .then((data) => {
                if (cancelled) return;
                const list = data.quotes || data.options || (data.quote ? [data.quote] : []);
                const map = {};
                list.forEach((q) => {
                    if (q.vehicle_class?.slug) map[q.vehicle_class.slug] = q;
                });
                setQuoteBySlug(map);
                pricingCtx.current.ready = true;
            })
            .catch((err) => {
                if (cancelled) return;
                setPricingError(
                    err?.response?.data?.message ||
                        Object.values(err?.response?.data?.errors || {}).flat()[0] ||
                        'Unable to load live prices. Showing catalog estimates.',
                );
            })
            .finally(() => {
                if (!cancelled) setPricingLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [params, seatAddon]);

    useEffect(() => {
        if (!vehicle) return;
        setHighlightIndex(0);
        setLuggageId(vehicle.luggageOptions?.[0]?.id || 'cabin_asset');
        setSeatingId(vehicle.seatingOptions?.[0]?.id || 'maximum_asset');
        setCapacityTab('luggage');
    }, [vehicle]);

    const visibleSeatAddons = useMemo(
        () => seatAddons.filter((opt) => opt.id === 'none' || Number(opt.price) > 0),
        [seatAddons],
    );
    const paidSeatAddons = useMemo(
        () => visibleSeatAddons.filter((opt) => opt.id !== 'none'),
        [visibleSeatAddons],
    );

    useEffect(() => {
        if (seatAddon === 'none') return;
        if (paidSeatAddons.some((opt) => opt.id === seatAddon)) return;
        setSeatAddon('none');
    }, [paidSeatAddons, seatAddon]);

    const selectSeatAddon = (id) => {
        setSeatAddon(id);
        if (id === 'child_seat') {
            setSeatingId('child_seat_asset');
            setCapacityTab('seating');
        } else if (id === 'baby_seat') {
            setSeatingId('baby_seat_asset');
            setCapacityTab('seating');
        } else if (seatingId === 'child_seat_asset' || seatingId === 'baby_seat_asset') {
            setSeatingId(vehicle?.seatingOptions?.[0]?.id || 'maximum_asset');
        }
    };

    useEffect(() => {
        const idx = vehicles.findIndex((v) => v.id === selectedId);
        if (idx >= 0) setVehicleIndex(idx);
    }, [selectedId, vehicles]);

    const scrollVehicles = (dir) => {
        const next = Math.min(Math.max(vehicleIndex + dir, 0), vehicles.length - 1);
        setVehicleIndex(next);
        setSelectedId(vehicles[next].id);
        const el = vehicleTrackRef.current;
        if (el) {
            const card = el.children[next];
            card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    };

    const luggageOpt =
        vehicle?.luggageOptions?.find((o) => o.id === luggageId) || vehicle?.luggageOptions?.[0];
    const seatingOpt =
        vehicle?.seatingOptions?.find((o) => o.id === seatingId) || vehicle?.seatingOptions?.[0];
    const highlight = vehicle?.highlights?.[highlightIndex] || vehicle?.highlights?.[0];

    if (!tripSearchIsComplete(params)) {
        return (
            <SiteLayout className="relative min-w-0 overflow-x-clip bg-page" mainClassName="booking-page" showFooter={false}>
                <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 pt-28 text-center">
                    <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 text-ink-text">
                        Choose your trip first
                    </h1>
                    <p className="font-geist mt-3 text-[15px] leading-6 text-muted">
                        Pick a location from the suggestions, then view options. Prices and the map follow that trip.
                    </p>
                    <Link
                        to="/#book"
                        className="font-geist mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-wine-700 px-5 text-[15px] font-500 text-white transition hover:bg-wine-600"
                    >
                        Back to search
                    </Link>
                </div>
            </SiteLayout>
        );
    }

    if (!vehicle) {
        return <Skeleton variant="page" />;
    }

    return (
        <SiteLayout
            className="relative min-w-0 overflow-x-clip bg-page"
            mainClassName="booking-page"
            showFooter={false}
        >
            <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
                {/* Vehicles */}
                <div
                    className="col-start-1 row-start-1 min-w-0 px-4 sm:px-6 lg:px-10 xl:px-14"
                    style={{ paddingTop: 'calc(var(--booking-bar-h, 88px) + 24px)' }}
                >
                    <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                        Choose your experience
                    </h1>
                    {pricingLoading ? <Skeleton variant="inline" className="mt-2" /> : null}
                    {pricingError ? (
                        <p className="font-geist mt-2 m-0 text-[14px] text-amber-800">{pricingError}</p>
                    ) : null}
                    <TripOverview
                        serviceLabel={serviceLabel(serviceId)}
                        pickup={pickupLabel}
                        dropoff={!isHourly ? dropoffLabel : ''}
                        secondaryLabel={tripSecondary}
                        secondaryHeading="Duration"
                        date={tripDate}
                        time={tripTimeRaw}
                        distanceKm={vehicle?.distance_km}
                        durationMinutes={vehicle?.route_duration_minutes}
                        meta={tripMeta}
                    />
                    {vehicle?.route_status === 'unavailable' ? (
                        <p className="font-geist mt-1 m-0 text-[13px] text-amber-800">
                            Route distance is unavailable, so this fare uses the minimum from your pricing rules.
                        </p>
                    ) : null}
                    {vehicle?.route_status === 'estimated' ? (
                        <p className="font-geist mt-1 m-0 text-[13px] text-amber-800">
                            No driving route was found, so this fare uses the straight-line distance between the map pins.
                        </p>
                    ) : null}

                    <div className="relative mt-6" data-cy="vehicle-results">
                        <div
                            role="region"
                            aria-roledescription="carousel"
                            aria-label="Vehicle class options"
                        >
                            <div role="radiogroup" aria-label="Select vehicle class">
                                <div
                                    ref={vehicleTrackRef}
                                    className={`booking-vehicle-track flex gap-3 pb-2 scroll-smooth ${
                                        vehicles.length > 1
                                            ? 'overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                                            : 'overflow-visible'
                                    }`}
                                >
                                    {vehicles.map((v) => {
                                        const checked = v.id === selectedId;
                                        return (
                                            <label
                                                key={v.id}
                                                data-cy="vehicle-card"
                                                className={`booking-vehicle-card relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border bg-white transition ${
                                                    vehicles.length === 1
                                                        ? 'w-full max-w-xl snap-none'
                                                        : 'w-[min(280px,78vw)] snap-start sm:w-[300px]'
                                                } ${
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
                                                        {v.total == null ? '…' : formatMoney(v.total, v.currency)}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {vehicles.length > 1 && (
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
                                disabled={vehicleIndex >= vehicles.length - 1}
                                onClick={() => scrollVehicles(1)}
                                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#d8d4cc] bg-white text-ink-text transition enabled:hover:bg-page disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                <IconChevronRight />
                            </button>
                        </div>
                        )}

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
                <div className="col-start-1 row-start-2 mt-6 w-full border-t border-[#e8e6e1] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:border-t-0 lg:border-l lg:border-[#e8e6e1] lg:pt-[var(--booking-bar-h,80px)]">
                    <BookingSidebar
                        vehicle={vehicle}
                        pickupLabel={pickupLabel}
                        dropoffLabel={dropoffLabel}
                        pickupTime={tripTimeRaw ? pickupTime : ''}
                        pickupPeriod={tripTimeRaw ? pickupPeriod : ''}
                        mapLat={Number.isFinite(mapLat) ? mapLat : routePoints[0]?.lat}
                        mapLng={Number.isFinite(mapLng) ? mapLng : routePoints[0]?.lng}
                        routePoints={routePoints}
                        seatAddon={seatAddon}
                        quoteId={vehicle.quote_id}
                        priceFailed={Boolean(pricingError) && !pricingLoading}
                    />
                </div>

                {/* Details */}
                <div
                    ref={detailsRef}
                    className="col-start-1 row-start-3 min-w-0 scroll-mt-24 px-4 pb-28 sm:px-6 lg:row-start-2 lg:px-10 lg:pb-16 xl:px-14"
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
                                {included.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3">
                                        <IncludedIcon type={item.icon} />
                                        <p className="font-geist m-0 pt-1.5 text-[14px] leading-5 text-ink-text">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {paidSeatAddons.length > 0 ? (
                            <div className="mt-8 rounded-2xl border border-[#e8e6e1] bg-white p-4 sm:p-5">
                                <p className="font-geist m-0 text-[15px] leading-6 font-500 text-ink-text">
                                    Need a child or baby seat?
                                </p>
                                <p className="font-geist mt-1 m-0 text-[14px] leading-5 text-muted">
                                    Select one if you need it for this trip. Paid seats are added to
                                    your quote.
                                </p>
                                <div
                                    role="radiogroup"
                                    aria-label="Child or baby seat"
                                    className="mt-4 flex flex-wrap gap-2"
                                >
                                    {visibleSeatAddons.map((opt) => {
                                        const on = opt.id === seatAddon;
                                        const priceLabel =
                                            opt.id !== 'none' && Number(opt.price) > 0
                                                ? ` · ${formatMoney(opt.price, opt.currency || 'US$')}`
                                                : '';
                                        return (
                                            <label
                                                key={opt.id}
                                                className={`font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border px-4 py-2 text-[14px] transition ${
                                                    on
                                                        ? 'border-wine-700 bg-wine-50 text-wine-800 shadow-[0_0_0_1px_#5b0520]'
                                                        : 'border-[#e0ddd6] bg-white text-ink-text hover:border-[#c9c5bc]'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="seat-addon"
                                                    className="sr-only"
                                                    value={opt.id}
                                                    checked={on}
                                                    onChange={() => selectSeatAddon(opt.id)}
                                                />
                                                <span
                                                    className={`mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                                        on
                                                            ? 'border-wine-700'
                                                            : 'border-[#c9c5bc]'
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    <span
                                                        className={`h-2 w-2 rounded-full transition ${
                                                            on ? 'bg-wine-700' : 'bg-transparent'
                                                        }`}
                                                    />
                                                </span>
                                                {opt.label}
                                                {priceLabel}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                            ) : null}
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
                                                                onChange={() => {
                                                                    setSeatingId(opt.id);
                                                                    const nextSeat =
                                                                        opt.id === 'child_seat_asset'
                                                                            ? 'child_seat'
                                                                            : opt.id === 'baby_seat_asset'
                                                                              ? 'baby_seat'
                                                                              : 'none';
                                                                    if (
                                                                        nextSeat === 'none' ||
                                                                        paidSeatAddons.some((seat) => seat.id === nextSeat)
                                                                    ) {
                                                                        setSeatAddon(nextSeat);
                                                                    }
                                                                }}
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
                                        { label: 'Base fare', value: vehicle.quote_id ? vehicle.base : null },
                                        vehicle.leadTime ? { label: 'Lead time surcharge', value: vehicle.leadTime } : null,
                                        {
                                            label: 'Estimated tax',
                                            value: vehicle.quote_id && Number(vehicle.tax) > 0 ? vehicle.tax : null,
                                        },
                                    ]
                                        .filter((row) => row && row.value != null)
                                        .map((row) => (
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
