import { useState } from 'react';
import { createPortal } from 'react-dom';
import BookingMap from './BookingMap';
import { IconOffer } from './icons';

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
    const [offerOpen, setOfferOpen] = useState(false);
    const [offerCode, setOfferCode] = useState('');
    const [appliedOffer, setAppliedOffer] = useState('');

    const applyOffer = (e) => {
        e.preventDefault();
        const code = offerCode.trim();
        if (!code) return;
        setAppliedOffer(code.toUpperCase());
        setOfferOpen(false);
    };

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
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-geist text-[14px] text-muted">Estimated tax</span>
                        <span className="font-geist text-[14px] text-ink-text">
                            {currency}
                            {Number(vehicle.tax).toFixed(2)}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3 border-t border-[#e8e6e1] pt-3">
                        <span className="font-geist text-[16px] font-500 text-ink-text">Total price</span>
                        <span className="font-geist text-[18px] font-500 text-ink-text">
                            {currency}
                            {Number(vehicle.total).toFixed(2)}
                        </span>
                    </div>
                    {appliedOffer ? (
                        <p className="font-geist m-0 text-[13px] text-wine-700">Offer applied: {appliedOffer}</p>
                    ) : null}
                </div>

                <div className="mt-auto pt-5">
                    <hr className="mb-4 border-0 border-t border-[#e8e6e1]" />
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => setOfferOpen(true)}
                            className="font-geist inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2.5 text-[14px] font-500 text-ink-text shadow-sm backdrop-blur transition hover:bg-white"
                        >
                            <IconOffer />
                            {appliedOffer ? `Offer: ${appliedOffer}` : 'Apply offer'}
                        </button>
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

            {offerOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/50 p-4 sm:items-center"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setOfferOpen(false);
                        }}
                    >
                        <form onSubmit={applyOffer} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h2 className="font-fragment m-0 text-[22px] font-400 text-ink-text">Apply offer</h2>
                            <input
                                value={offerCode}
                                onChange={(e) => setOfferCode(e.target.value)}
                                className="font-geist mt-4 w-full rounded-lg border border-[#d8d8dc] px-4 py-3 text-[16px] outline-none focus:border-wine-700"
                                placeholder="Offer code"
                                autoFocus
                            />
                            <div className="mt-5 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOfferOpen(false)}
                                    className="font-geist flex-1 cursor-pointer rounded-full border border-[#d8d8dc] py-3 text-[15px] font-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="font-geist flex-1 cursor-pointer rounded-full bg-wine-700 py-3 text-[15px] font-500 text-white hover:bg-wine-600"
                                >
                                    Apply
                                </button>
                            </div>
                        </form>
                    </div>,
                    document.body,
                )}
        </aside>
    );
}
