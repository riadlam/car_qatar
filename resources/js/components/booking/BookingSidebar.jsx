import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatMoney } from '../../data/bookingVehicles';
import { useSavedGuests } from '../../hooks/useSavedGuests';
import Skeleton from '../ui/Skeleton';
import AddGuestModal, { guestDisplayName } from './AddGuestModal';
import BookingMap from './BookingMap';
import RouteMap from './RouteMap';
import { IconChevronDown, IconPassengers, IconPerson } from './icons';

export default function BookingSidebar({
    vehicle,
    pickupLabel,
    pickupTime,
    pickupPeriod,
    dropoffLabel = '',
    mapLat,
    mapLng,
    routePoints = [],
    seatAddon = 'none',
    quoteId = null,
    priceFailed = false,
}) {
    const { isAuthenticated, setReturnTo } = useAuth();
    const { guests, loading: guestsLoading, addGuest } = useSavedGuests();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [forGuest, setForGuest] = useState(false);
    const [guestOpen, setGuestOpen] = useState(false);
    const [selectedGuestId, setSelectedGuestId] = useState(null);
    const [addGuestOpen, setAddGuestOpen] = useState(false);

    useEffect(() => {
        if (!selectedGuestId) return;
        if (!guests.some((g) => g.id === selectedGuestId)) {
            setSelectedGuestId(null);
        }
    }, [guests, selectedGuestId]);

    const selectedGuest = useMemo(
        () => guests.find((g) => g.id === selectedGuestId) || null,
        [guests, selectedGuestId],
    );

    const selectVehicle = () => {
        const q = new URLSearchParams(params);
        q.set('vehicle', vehicle.id);
        if (quoteId) q.set('quote_id', String(quoteId));
        else q.delete('quote_id');
        if (seatAddon && seatAddon !== 'none') {
            q.set('seat', seatAddon);
        } else {
            q.delete('seat');
        }
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

    const onAddGuest = async (payload) => {
        if (!isAuthenticated) {
            const q = new URLSearchParams(params);
            q.set('vehicle', vehicle.id);
            if (quoteId) q.set('quote_id', String(quoteId));
            const returnPath = `/booking?${q.toString()}`;
            setReturnTo(returnPath);
            navigate(`/login?from=${encodeURIComponent(returnPath)}`);
            throw new Error('Sign in to save guests.');
        }
        const guest = await addGuest(payload);
        setSelectedGuestId(guest.id);
        setForGuest(true);
        setGuestOpen(true);
        return guest;
    };

    return (
        <aside className="booking-sidebar flex flex-col bg-page lg:sticky lg:top-[var(--booking-bar-h,80px)] lg:max-h-[calc(100vh-var(--booking-bar-h,80px))] lg:overflow-y-auto lg:border-0">
            {routePoints.length >= 2 ? (
                <RouteMap
                    pickupLabel={routePoints[0].label || pickupLabel}
                    dropoffLabel={routePoints[routePoints.length - 1].label || dropoffLabel}
                    lat={routePoints[0].lat}
                    lng={routePoints[0].lng}
                    dropLat={routePoints[routePoints.length - 1].lat}
                    dropLng={routePoints[routePoints.length - 1].lng}
                    waypoints={routePoints.slice(1, -1)}
                    className="h-[220px] w-full lg:h-[280px]"
                />
            ) : (
                <BookingMap
                    pickupLabel={pickupLabel}
                    pickupTime={pickupTime}
                    pickupPeriod={pickupPeriod}
                    lat={mapLat}
                    lng={mapLng}
                />
            )}

            <div className="flex flex-1 flex-col px-4 pb-28 pt-4 sm:px-5 lg:pb-6">
                <div className="flex items-start justify-between gap-3 border-b border-[#e8e6e1] pb-4">
                    <div className="min-w-0">
                        <div className="font-geist text-[18px] leading-6 font-500 text-ink-text">{vehicle.name}</div>
                        <div className="font-geist mt-0.5 text-[14px] leading-5 text-muted">{vehicle.similar}</div>
                    </div>
                    <div className="font-geist shrink-0 text-[18px] leading-6 font-500 text-ink-text">
                        {vehicle.total == null ? '…' : formatMoney(vehicle.total, vehicle.currency)}
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
                                    {guestsLoading ? (
                                        <div className="px-3 py-3">
                                            <Skeleton variant="inline" />
                                        </div>
                                    ) : guests.length === 0 ? (
                                        <p className="font-geist m-0 px-3 py-4 text-[14px] text-muted">
                                            {isAuthenticated
                                                ? 'No saved guests yet. Add one below.'
                                                : 'Sign in to load and save guests.'}
                                        </p>
                                    ) : (
                                        guests.map((guest) => {
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
                                        })
                                    )}
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
                        <p className="font-geist m-0 text-[14px] text-muted">All fees included</p>
                    </div>
                    <button
                        type="button"
                        name="reserve-vehicle"
                        data-cy="reserve-vehicle"
                        onClick={selectVehicle}
                        disabled={!quoteId}
                        className="font-geist hidden min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
                    >
                        {quoteId ? 'Continue to checkout' : priceFailed ? 'Price unavailable' : 'Loading price…'}
                    </button>
                </div>
            </div>

            {typeof document !== 'undefined' &&
                createPortal(
                    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-4 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
                        <motion.button
                            type="button"
                            onClick={selectVehicle}
                            disabled={!quoteId}
                            animate={quoteId ? { y: [0, -7, 0] } : { y: 0 }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            className="font-geist pointer-events-auto flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-full bg-wine-700 px-5 py-3 text-[16px] font-500 text-white shadow-[0_12px_32px_rgba(91,5,32,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span>{quoteId ? 'Continue to checkout' : priceFailed ? 'Price unavailable' : 'Loading price…'}</span>
                            {quoteId && vehicle.total != null ? (
                                <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[14px]">
                                    {formatMoney(vehicle.total, vehicle.currency)}
                                </span>
                            ) : null}
                        </motion.button>
                    </div>,
                    document.body,
                )}

            <AddGuestModal
                open={addGuestOpen}
                onClose={() => setAddGuestOpen(false)}
                onSave={onAddGuest}
            />
        </aside>
    );
}
