import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatMoney } from '../../data/bookingVehicles';
import { EXAMPLE_GUESTS, loadSavedGuests, saveGuests } from '../../data/bookingGuests';
import AddGuestModal, { guestDisplayName } from './AddGuestModal';
import BookingMap from './BookingMap';
import { IconChevronDown, IconOffer, IconPassengers, IconPerson } from './icons';

export default function BookingSidebar({
    vehicle,
    pickupLabel,
    pickupTime,
    pickupPeriod,
    mapLat,
    mapLng,
}) {
    const { isAuthenticated, setReturnTo } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [forGuest, setForGuest] = useState(false);
    const [guestOpen, setGuestOpen] = useState(false);
    const [savedGuests, setSavedGuests] = useState([]);
    const [selectedGuestId, setSelectedGuestId] = useState(null);
    const [addGuestOpen, setAddGuestOpen] = useState(false);
    const [offerOpen, setOfferOpen] = useState(false);
    const [offerCode, setOfferCode] = useState('');
    const [appliedOffer, setAppliedOffer] = useState('');

    useEffect(() => {
        setSavedGuests(loadSavedGuests());
    }, []);

    const guests = useMemo(() => [...EXAMPLE_GUESTS, ...savedGuests], [savedGuests]);

    const selectedGuest = useMemo(
        () => guests.find((g) => g.id === selectedGuestId) || null,
        [guests, selectedGuestId],
    );

    const selectVehicle = () => {
        const q = new URLSearchParams(params);
        q.set('vehicle', vehicle.id);
        if (forGuest && selectedGuest) {
            q.set('guest', selectedGuest.id);
        } else {
            q.delete('guest');
        }
        const checkoutPath = `/booking/checkout?${q.toString()}`;
        if (!isAuthenticated) {
            setReturnTo(checkoutPath);
            navigate(`/login?from=${encodeURIComponent(checkoutPath)}`);
            return;
        }
        if (forGuest && !selectedGuest) {
            setGuestOpen(true);
            return;
        }
        navigate(checkoutPath);
    };

    const applyOffer = (e) => {
        e.preventDefault();
        const code = offerCode.trim();
        if (!code) return;
        setAppliedOffer(code.toUpperCase());
        setOfferOpen(false);
    };

    const onAddGuest = (guest) => {
        const next = [...savedGuests, guest];
        setSavedGuests(next);
        saveGuests(next);
        setSelectedGuestId(guest.id);
        setForGuest(true);
        setGuestOpen(true);
    };

    return (
        <aside className="booking-sidebar flex flex-col bg-page lg:sticky lg:top-[80px] lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto lg:border-0">
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
                    <div className="font-geist shrink-0 text-[18px] leading-6 font-500 text-ink-text">
                        {formatMoney(vehicle.total, vehicle.currency)}
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    <button
                        type="button"
                        aria-pressed={!forGuest}
                        onClick={() => {
                            setForGuest(false);
                            setGuestOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                            !forGuest
                                ? 'border-wine-700 bg-wine-50'
                                : 'border-[#e0ddd6] bg-white hover:border-[#c9c5bc]'
                        }`}
                    >
                        <span className="mt-0.5 text-ink-text">
                            <IconPerson />
                        </span>
                        <span className="min-w-0">
                            <span className="font-geist block text-[16px] leading-6 font-500 text-ink-text">
                                Book for myself
                            </span>
                            <span className="font-geist mt-0.5 block text-[14px] leading-5 text-muted">
                                Book with your account information
                            </span>
                        </span>
                    </button>

                    <div>
                        <button
                            type="button"
                            aria-pressed={forGuest}
                            aria-expanded={guestOpen}
                            onClick={() => {
                                setForGuest(true);
                                setGuestOpen((v) => !v || !forGuest);
                            }}
                            className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                                forGuest
                                    ? 'border-wine-700 bg-wine-50'
                                    : 'border-[#e0ddd6] bg-white hover:border-[#c9c5bc]'
                            }`}
                        >
                            <span className="mt-0.5 text-ink-text">
                                <IconPassengers />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="font-geist block text-[16px] leading-6 font-500 text-ink-text">
                                    Book for a guest
                                </span>
                                <span className="font-geist mt-0.5 block text-[14px] leading-5 text-muted">
                                    {selectedGuest
                                        ? guestDisplayName(selectedGuest)
                                        : 'Select or add a guest'}
                                </span>
                            </span>
                            <span className={`mt-1 text-ink-text transition ${guestOpen ? 'rotate-180' : ''}`}>
                                <IconChevronDown />
                            </span>
                        </button>

                        {forGuest && guestOpen && (
                            <div className="mt-2 overflow-hidden rounded-xl border border-[#e0ddd6] bg-white">
                                <div
                                    role="listbox"
                                    aria-label="Saved guests"
                                    className="max-h-[220px] overflow-y-auto"
                                >
                                    {guests.map((guest) => {
                                        const selected = guest.id === selectedGuestId;
                                        return (
                                            <button
                                                key={guest.id}
                                                type="button"
                                                role="option"
                                                aria-selected={selected}
                                                onClick={() => setSelectedGuestId(guest.id)}
                                                className={`flex w-full cursor-pointer items-start gap-3 border-b border-[#f0eee9] px-3 py-3 text-left transition last:border-b-0 ${
                                                    selected ? 'bg-wine-50' : 'hover:bg-page'
                                                }`}
                                            >
                                                <span
                                                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                                        selected
                                                            ? 'border-wine-700 bg-wine-700'
                                                            : 'border-[#c9c5bc] bg-white'
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    {selected ? (
                                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                    ) : null}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="font-geist block text-[15px] font-500 text-ink-text">
                                                        {guestDisplayName(guest)}
                                                    </span>
                                                    <span className="font-geist mt-0.5 block truncate text-[13px] text-muted">
                                                        {guest.email}
                                                    </span>
                                                    <span className="font-geist mt-0.5 block text-[13px] text-muted">
                                                        {guest.phone}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-[#e8e6e1] p-2">
                                    <button
                                        type="button"
                                        onClick={() => setAddGuestOpen(true)}
                                        className="font-geist flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[15px] font-500 text-wine-700 transition hover:bg-wine-50"
                                    >
                                        <span className="text-[18px] leading-none" aria-hidden="true">
                                            +
                                        </span>
                                        Add new guest
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                        <p className="font-geist m-0 text-[14px] text-muted">All fees included</p>
                    </div>
                    <button
                        type="button"
                        name="reserve-vehicle"
                        data-cy="reserve-vehicle"
                        onClick={selectVehicle}
                        className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                    >
                        Select {vehicle.name}
                    </button>
                </div>
            </div>

            <AddGuestModal
                open={addGuestOpen}
                onClose={() => setAddGuestOpen(false)}
                onSave={onAddGuest}
            />

            {offerOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/50 p-4 sm:items-center"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="offer-title"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setOfferOpen(false);
                        }}
                    >
                        <form
                            onSubmit={applyOffer}
                            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        >
                            <h2 id="offer-title" className="font-fragment m-0 text-[22px] font-400 text-ink-text">
                                Apply offer
                            </h2>
                            <p className="font-geist mt-2 text-[14px] text-muted">
                                Enter a promotional code to update your fare.
                            </p>
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
