import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import AddCardModal from '../components/account/AddCardModal';
import CheckoutSidebar from '../components/booking/CheckoutSidebar';
import CheckoutMobile from '../components/booking/CheckoutMobile';
import { IconChevronDown } from '../components/booking/icons';
import { VEHICLES, formatMoney } from '../data/bookingVehicles';
import { findGuestById } from '../data/bookingGuests';
import { addJourney } from '../data/journeys';
import { guestDisplayName } from '../components/booking/AddGuestModal';
import { useAuth } from '../context/AuthContext';

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

const COUNTRIES = [
    'Algeria',
    'France',
    'Germany',
    'United Kingdom',
    'United States',
    'United Arab Emirates',
    'Qatar',
    'Saudi Arabia',
    'Morocco',
    'Tunisia',
    'Canada',
    'Spain',
    'Italy',
];

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

function LockIcon() {
    return (
        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-muted">
            <path d="M22 9V7C22 5.89543 21.1046 5 20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H14M22 9H6M22 9V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21.1667 18.5H21.4C21.7314 18.5 22 18.7686 22 19.1V21.4C22 21.7314 21.7314 22 21.4 22H17.6C17.2686 22 17 21.7314 17 21.4V19.1C17 18.7686 17.2686 18.5 17.6 18.5H17.8333M21.1667 18.5V16.75C21.1667 16.1667 20.8333 15 19.5 15C18.1667 15 17.8333 16.1667 17.8333 16.75V18.5M21.1667 18.5H17.8333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-muted">
            <path d="M12 11.5V16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7.51L12.01 7.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Checkout() {
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, loading, user, updateUser, setReturnTo } = useAuth();

    const vehicleId = params.get('vehicle') || 'business';
    const vehicle = useMemo(
        () => VEHICLES.find((v) => v.id === vehicleId) || VEHICLES[0],
        [vehicleId],
    );

    const trip = useMemo(
        () => ({
            pickup: params.get('pickup') || 'Embassy Of Algeria',
            dropoff: params.get('dropoff') || '',
            duration: params.get('duration') || '2',
            date: params.get('date') || new Date().toISOString().slice(0, 10),
            time: params.get('time') || '22:15',
            mode: params.get('mode') || 'hourly',
            lat: Number(params.get('lat')) || 28.564641,
            lng: Number(params.get('lng')) || 77.159464,
        }),
        [params],
    );

    const { time: pickupTime, period: pickupPeriod } = formatTimeParts(trip.time);

    const cards = user?.payment_methods || [];
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [addCardOpen, setAddCardOpen] = useState(false);
    const [billingOpen, setBillingOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [booking, setBooking] = useState(false);
    const [done, setDone] = useState(false);
    const [notes, setNotes] = useState('');
    const [reference, setReference] = useState('');
    const [appliedOffer, setAppliedOffer] = useState('');
    const [billing, setBilling] = useState({
        company: '',
        street: '',
        zip: '',
        city: '',
        country: '',
    });

    const selectedCard = cards.find((c) => c.id === selectedCardId) || null;
    const guestId = params.get('guest') || '';
    const selectedGuest = useMemo(() => findGuestById(guestId), [guestId]);
    const passengerLabel = selectedGuest ? guestDisplayName(selectedGuest) : 'For myself';

    const onPassengerChange = (nextGuestId) => {
        const q = new URLSearchParams(params);
        if (nextGuestId) q.set('guest', nextGuestId);
        else q.delete('guest');
        setParams(q, { replace: true });
    };

    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) {
            const from = `/booking/checkout${window.location.search}`;
            setReturnTo(from);
            navigate(`/login?from=${encodeURIComponent(from)}`, { replace: true });
        }
    }, [loading, isAuthenticated, navigate, setReturnTo]);

    useEffect(() => {
        if (cards.length && !selectedCardId) {
            setSelectedCardId(cards[0].id);
        }
    }, [cards, selectedCardId]);

    const backToBooking = () => {
        const q = new URLSearchParams(params);
        q.delete('vehicle');
        q.delete('guest');
        navigate(`/booking?${q.toString()}`);
    };

    const onSaveCard = (card) => {
        const next = [...cards, card];
        updateUser({ payment_methods: next });
        setSelectedCardId(card.id);
    };

    const onUpdateTrip = (next) => {
        const q = new URLSearchParams(params);
        if (next.pickup) q.set('pickup', next.pickup);
        else q.delete('pickup');
        if (next.mode === 'transfer') {
            q.set('mode', 'transfer');
            if (next.dropoff) q.set('dropoff', next.dropoff);
            q.delete('duration');
        } else {
            q.set('mode', 'hourly');
            q.set('duration', next.duration || '2');
            q.delete('dropoff');
        }
        if (next.date) q.set('date', next.date);
        if (next.time) q.set('time', next.time);
        setParams(q, { replace: true });
    };

    const onBook = () => {
        if (!selectedCardId) return;
        setBooking(true);
        window.setTimeout(() => {
            const bookingNumber = `AM-${Date.now().toString().slice(-8)}`;
            const dateObj = trip.date ? new Date(`${trip.date}T12:00:00`) : new Date();
            const dateLabel = Number.isNaN(dateObj.getTime())
                ? trip.date
                : dateObj.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                  });
            const entry = {
                id: `j_${Date.now()}`,
                booking_number: bookingNumber,
                status: 'upcoming',
                phase: 'confirmed',
                status_label: 'Confirmed',
                mode: trip.mode === 'hourly' ? 'hourly' : 'transfer',
                mode_label: trip.mode === 'hourly' ? 'Hourly hire' : 'City transfer',
                pickup: trip.pickup,
                dropoff: trip.mode === 'hourly' ? `Hourly · ${trip.duration}h` : trip.dropoff,
                date: trip.date,
                time: trip.time,
                date_label: dateLabel,
                time_label: `${pickupTime} ${pickupPeriod}`,
                arrive_label: trip.mode === 'hourly' ? `Until end of hire` : undefined,
                duration_label: trip.mode === 'hourly' ? `${trip.duration} hours` : undefined,
                vehicle_id: vehicle.id,
                vehicle: vehicle.name,
                vehicle_similar: vehicle.similar,
                vehicle_image: vehicle.main?.sm || vehicle.main?.lg,
                price: vehicle.total,
                currency: vehicle.currency,
                payment_label: selectedCard
                    ? `${selectedCard.brand} •••• ${selectedCard.last4}`
                    : 'Card on file',
                passenger_name: selectedGuest
                    ? guestDisplayName(selectedGuest)
                    : 'For myself',
                for_guest: Boolean(selectedGuest),
                actions: ['details', 'edit', 'cancel'],
                created_at: new Date().toISOString(),
            };
            addJourney(entry);
            setBooking(false);
            setDone(true);
        }, 900);
    };

    if (loading || !isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page text-ink-text">Loading…</div>
        );
    }

    const successModal =
        done &&
        createPortal(
            <div
                className="fixed inset-0 z-[220] flex items-end justify-center bg-ink/50 p-4 sm:items-center"
                role="dialog"
                aria-modal="true"
                aria-labelledby="booked-title"
            >
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <h2 id="booked-title" className="font-fragment m-0 text-[24px] font-400 text-ink-text">
                        Reservation confirmed
                    </h2>
                    <p className="font-geist mt-3 text-[15px] leading-6 text-muted">
                        Your {vehicle.name} ride for {formatMoney(vehicle.total, vehicle.currency)} is booked. A hold
                        has been placed on your card; you&apos;ll be charged after the journey.
                    </p>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => navigate('/journeys')}
                            className="font-geist flex-1 cursor-pointer rounded-full border border-[#d8d8dc] py-3 text-[15px] font-500"
                        >
                            View journeys
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/account')}
                            className="font-geist flex-1 cursor-pointer rounded-full bg-wine-700 py-3 text-[15px] font-500 text-white hover:bg-wine-600"
                        >
                            View account
                        </button>
                    </div>
                </div>
            </div>,
            document.body,
        );

    return (
        <>
            {/* Mobile layout */}
            <CheckoutMobile
                vehicle={vehicle}
                trip={trip}
                passengerLabel={passengerLabel}
                guestId={guestId}
                onPassengerChange={onPassengerChange}
                selectedCard={selectedCard}
                cards={cards}
                notes={notes}
                setNotes={setNotes}
                canBook={Boolean(selectedCardId)}
                booking={booking}
                onBook={onBook}
                onBack={backToBooking}
                onUpdateTrip={onUpdateTrip}
                onAddCard={() => setAddCardOpen(true)}
                onSelectCard={setSelectedCardId}
                onApplyOffer={setAppliedOffer}
                appliedOffer={appliedOffer}
            />

            {/* Desktop layout */}
            <div className="hidden lg:block">
                <SiteLayout className="relative min-w-0 overflow-x-clip bg-page" showFooter={false}>
                    <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
                        <div className="min-w-0 px-4 pb-10 pt-[96px] sm:px-6 lg:px-10 lg:pb-16 xl:px-14">
                            <div className="mb-6 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={backToBooking}
                                    aria-label="Go back to previous page"
                                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#d8d4cc] bg-white text-ink-text transition hover:bg-page"
                                >
                                    <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" aria-hidden="true">
                                        <path d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <h1 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                                    Confirm your reservation
                                </h1>
                            </div>

                            <section className="rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                                <h2 className="font-fragment m-0 text-[22px] leading-8 font-400 text-ink-text">
                                    Payment preferences
                                </h2>

                                <div className="mt-5">
                                    {cards.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-[#d8d4cc] bg-page px-4 py-8 text-center">
                                            <p className="font-geist m-0 text-[15px] text-muted">
                                                You haven&apos;t added any payment methods yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div role="radiogroup" aria-label="Payment cards" className="flex flex-col gap-2">
                                            {cards.map((card) => {
                                                const on = card.id === selectedCardId;
                                                return (
                                                    <label
                                                        key={card.id}
                                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                                                            on
                                                                ? 'border-wine-700 bg-wine-50'
                                                                : 'border-[#e0ddd6] hover:border-[#c9c5bc]'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="checkout-card"
                                                            className="accent-[#5b0520]"
                                                            checked={on}
                                                            onChange={() => setSelectedCardId(card.id)}
                                                        />
                                                        <span className="min-w-0">
                                                            <span className="font-geist block text-[15px] font-500 text-ink-text">
                                                                {card.brand} •••• {card.last4}
                                                            </span>
                                                            <span className="font-geist block text-[13px] text-muted">
                                                                {card.name} · Exp {card.expiry}
                                                            </span>
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setAddCardOpen(true)}
                                        className="font-geist mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] bg-white px-4 py-2.5 text-[16px] font-500 text-ink-text transition hover:bg-page sm:w-auto sm:min-w-[160px]"
                                    >
                                        Add card
                                    </button>
                                </div>

                                <hr className="my-6 border-0 border-t border-[#e8e6e1]" />

                                <div>
                                    <label className="flex cursor-pointer items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={billingOpen}
                                            onChange={(e) => setBillingOpen(e.target.checked)}
                                            className="mt-1 h-4 w-4 accent-[#5b0520]"
                                        />
                                        <span className="font-geist text-[15px] leading-6 text-ink-text">
                                            Add/Edit billing information
                                        </span>
                                    </label>

                                    {billingOpen && (
                                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <label className="font-geist mb-1.5 block text-[14px] text-muted" htmlFor="co-company">
                                                    Company name (optional)
                                                </label>
                                                <input
                                                    id="co-company"
                                                    maxLength={50}
                                                    value={billing.company}
                                                    onChange={(e) => setBilling({ ...billing, company: e.target.value })}
                                                    className={fieldClass}
                                                    placeholder="e.g. AL MAJD Transport"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="font-geist mb-1.5 block text-[14px] text-muted" htmlFor="co-street">
                                                    Street address
                                                </label>
                                                <input
                                                    id="co-street"
                                                    maxLength={50}
                                                    value={billing.street}
                                                    onChange={(e) => setBilling({ ...billing, street: e.target.value })}
                                                    className={fieldClass}
                                                    placeholder="e.g. 123 Main Street, Apt 4B"
                                                />
                                            </div>
                                            <div>
                                                <label className="font-geist mb-1.5 block text-[14px] text-muted" htmlFor="co-zip">
                                                    Zip
                                                </label>
                                                <input
                                                    id="co-zip"
                                                    maxLength={10}
                                                    value={billing.zip}
                                                    onChange={(e) => setBilling({ ...billing, zip: e.target.value })}
                                                    className={fieldClass}
                                                    placeholder="e.g. 90210"
                                                />
                                            </div>
                                            <div>
                                                <label className="font-geist mb-1.5 block text-[14px] text-muted" htmlFor="co-city">
                                                    City
                                                </label>
                                                <input
                                                    id="co-city"
                                                    maxLength={20}
                                                    value={billing.city}
                                                    onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                                                    className={fieldClass}
                                                    placeholder="e.g. Berlin"
                                                />
                                            </div>
                                            <div className="relative sm:col-span-2 sm:max-w-xs">
                                                <label className="font-geist mb-1.5 block text-[14px] text-muted" htmlFor="co-country">
                                                    Country
                                                </label>
                                                <button
                                                    id="co-country"
                                                    type="button"
                                                    role="combobox"
                                                    aria-expanded={countryOpen}
                                                    onClick={() => setCountryOpen((v) => !v)}
                                                    className={`${fieldClass} flex cursor-pointer items-center justify-between text-left`}
                                                >
                                                    <span className={billing.country ? 'text-ink-text' : 'text-muted'}>
                                                        {billing.country || 'Select country'}
                                                    </span>
                                                    <span className={`transition ${countryOpen ? 'rotate-180' : ''}`}>
                                                        <IconChevronDown />
                                                    </span>
                                                </button>
                                                {countryOpen && (
                                                    <ul
                                                        role="listbox"
                                                        className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-[#e0ddd6] bg-white py-1 shadow-lg"
                                                    >
                                                        {COUNTRIES.map((c) => (
                                                            <li key={c}>
                                                                <button
                                                                    type="button"
                                                                    className={`font-geist w-full cursor-pointer px-4 py-2.5 text-left text-[15px] hover:bg-wine-50 ${
                                                                        billing.country === c
                                                                            ? 'bg-wine-50 text-wine-800'
                                                                            : 'text-ink-text'
                                                                    }`}
                                                                    onClick={() => {
                                                                        setBilling({ ...billing, country: c });
                                                                        setCountryOpen(false);
                                                                    }}
                                                                >
                                                                    {c}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <hr className="my-6 border-0 border-t border-[#e8e6e1]" />

                                <div>
                                    <label className="font-geist mb-1.5 block text-[14px] text-muted" htmlFor="co-ref">
                                        Reference code/cost center
                                    </label>
                                    <input
                                        id="co-ref"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        className={fieldClass}
                                        placeholder="e.g. AB123456"
                                        aria-describedby="co-ref-help"
                                    />
                                    <p id="co-ref-help" className="font-geist mt-2 m-0 text-[13px] text-muted">
                                        This reference will appear on your invoice
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex gap-2.5">
                                        <LockIcon />
                                        <span className="font-geist text-[14px] leading-5 text-muted">
                                            Our servers are encrypted with TLS/SSL to ensure security and privacy.
                                        </span>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <InfoIcon />
                                        <span className="font-geist text-[14px] leading-5 text-muted">
                                            The amount will be held on your selected payment method after booking. You
                                            will only be charged once your journey is complete.
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-6 rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                                <h2 className="font-fragment m-0 text-[22px] leading-8 font-400 text-ink-text">
                                    Pickup preferences
                                </h2>
                                <div className="mt-5">
                                    <label className="font-geist mb-1.5 block text-[14px] text-muted" htmlFor="co-notes">
                                        Additional details (optional)
                                    </label>
                                    <textarea
                                        id="co-notes"
                                        name="additional-details"
                                        rows={3}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className={`${fieldClass} min-h-[88px] resize-y`}
                                        placeholder="Special instructions for your journey"
                                        aria-describedby="co-notes-help"
                                    />
                                    <p id="co-notes-help" className="font-geist mt-2 m-0 text-[13px] text-muted">
                                        Additional wait time or distance requests may incur additional charges.
                                    </p>
                                </div>
                            </section>
                        </div>

                        <div className="w-full border-t border-[#e8e6e1] lg:border-t-0 lg:border-l lg:border-[#e8e6e1] lg:pt-[80px]">
                            <CheckoutSidebar
                                vehicle={vehicle}
                                pickupLabel={trip.pickup}
                                pickupTime={pickupTime}
                                pickupPeriod={pickupPeriod}
                                mapLat={trip.lat}
                                mapLng={trip.lng}
                                canBook={Boolean(selectedCardId)}
                                onBook={onBook}
                                booking={booking}
                            />
                        </div>
                    </div>
                </SiteLayout>
            </div>

            <AddCardModal open={addCardOpen} onClose={() => setAddCardOpen(false)} onSave={onSaveCard} />
            {successModal}
        </>
    );
}
