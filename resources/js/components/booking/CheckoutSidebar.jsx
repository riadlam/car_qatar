import BookingMap from './BookingMap';

/**
 * Checkout right rail — map, class summary, price rows, offer, Book now.
 */
export default function CheckoutSidebar({
    vehicle,
    pickupLabel,
    pickupTime,
    pickupPeriod,
    mapLat,
    mapLng,
    canBook,
    onBook,
    booking,
}) {
    const currency = vehicle.currency === 'US$' ? '$' : vehicle.currency;

    return (
        <aside className="flex flex-col bg-page lg:sticky lg:top-[80px] lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto">
            <BookingMap
                pickupLabel={pickupLabel}
                pickupTime={pickupTime}
                pickupPeriod={pickupPeriod}
                lat={mapLat}
                lng={mapLng}
            />

            <div className="flex flex-1 flex-col px-4 pb-6 pt-4 sm:px-5">
                <div className="flex items-start justify-between gap-3 border-b border-[#e8e6e1] pb-4">
                    <div className="min-w-0">
                        <div className="font-geist text-[18px] leading-6 font-500 text-ink-text">{vehicle.name}</div>
                        <div className="font-geist mt-0.5 text-[14px] leading-5 text-muted">{vehicle.similar}</div>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-geist text-[14px] text-muted">Price excluding tax</span>
                        <span className="font-geist text-[14px] text-ink-text">
                            {currency}
                            {Number(vehicle.base).toFixed(2)}
                        </span>
                    </div>
                    {Number(vehicle.tax) > 0 ? (
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-geist text-[14px] text-muted">Estimated tax</span>
                            <span className="font-geist text-[14px] text-ink-text">
                                {currency}
                                {Number(vehicle.tax).toFixed(2)}
                            </span>
                        </div>
                    ) : null}
                    <div className="mt-1 flex items-center justify-between gap-3 border-t border-[#e8e6e1] pt-3">
                        <span className="font-geist text-[16px] font-500 text-ink-text">Total price</span>
                        <span className="font-geist text-[18px] font-500 text-ink-text">
                            {currency}
                            {Number(vehicle.total).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-5">
                    <hr className="mb-4 border-0 border-t border-[#e8e6e1]" />
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="font-geist m-0 inline-flex items-center gap-2 text-[14px] font-500 text-ink-text">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-wine-700">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span>
                                {pickupTime ? `${pickupTime} ${pickupPeriod}` : 'Pickup time'}
                                {vehicle.route_duration_minutes ? ` · ${vehicle.route_duration_minutes} min` : ''}
                            </span>
                        </p>
                        <p className="font-geist m-0 text-[13px] text-muted">Terms &amp; conditions apply</p>
                    </div>
                    <button
                        type="button"
                        id="checkout-book-now"
                        disabled={!canBook || booking}
                        onClick={onBook}
                        className={`font-geist flex min-h-10 w-full items-center justify-center rounded-full px-4 py-3 text-[16px] font-500 tracking-[0.15px] transition ${
                            canBook && !booking
                                ? 'cursor-pointer bg-wine-700 text-white hover:bg-wine-600'
                                : 'cursor-not-allowed bg-[#aeaeae] text-white'
                        }`}
                    >
                        {booking ? 'Booking…' : 'Book now'}
                    </button>
                </div>
            </div>
        </aside>
    );
}
