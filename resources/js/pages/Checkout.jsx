import { useEffect, useId, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import AddCardModal from '../components/account/AddCardModal';
import BillingModal, { billingSummary } from '../components/checkout/BillingModal';
import CheckoutSidebar from '../components/booking/CheckoutSidebar';
import CheckoutMobile from '../components/booking/CheckoutMobile';
import { guestDisplayName } from '../components/booking/AddGuestModal';
import { useAuth } from '../context/AuthContext';
import { PREFERRED_LANGUAGES } from '../data/languages';
import { createQuotes, getQuote } from '../api/quotes';
import { createBooking, listBookings } from '../api/bookings';
import Skeleton from '../components/ui/Skeleton';
import { getBillingProfile, getPaymentMethods } from '../api/checkout';
import { tripParamsToQuotePayload } from '../utils/bookingMappers';
import {
    fallbackVehicles,
    mapVehicleClassToCard,
} from '../utils/catalogMappers';
import { useSavedGuests } from '../hooks/useSavedGuests';
import { findGuestById } from '../data/bookingGuests';

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

function quoteIsStale(quote) {
    if (!quote) return true;
    if (quote.status && quote.status !== 'priced') return true;
    if (!quote.expires_at) return false;
    const expires = new Date(quote.expires_at);
    return Number.isNaN(expires.getTime()) || expires.getTime() <= Date.now();
}

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

const OPEN_BOOKING_MESSAGE = 'Finish or cancel your current booking before booking another.';

function OpenBookingDialog({ open, message, onClose }) {
    const titleId = useId();
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/40 p-4 sm:items-center" role="presentation">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6"
            >
                <h2 id={titleId} className="font-fragment m-0 text-[24px] font-400 text-ink-text">
                    One trip at a time
                </h2>
                <p className="font-geist mt-2 m-0 text-[15px] leading-6 text-muted">
                    {message || OPEN_BOOKING_MESSAGE}
                </p>
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2 text-[14px] font-500 text-ink-text"
                    >
                        Close
                    </button>
                    <Link
                        to="/journeys"
                        className="font-geist rounded-full bg-wine-700 px-4 py-2 text-[14px] font-500 text-white no-underline"
                    >
                        View journeys
                    </Link>
                </div>
            </div>
        </div>
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
    const { isAuthenticated, loading, user, setReturnTo } = useAuth();
    const { guests, findById } = useSavedGuests();

    const vehicleId = params.get('vehicle') || 'van';
    const quoteIdParam = params.get('quote_id');
    const [quote, setQuote] = useState(null);
    const [quoteLoading, setQuoteLoading] = useState(Boolean(quoteIdParam));

    const vehicle = useMemo(() => {
        const fallback =
            fallbackVehicles().find((v) => v.id === vehicleId) || fallbackVehicles()[0];
        const fromQuote = quote?.vehicle_class
            ? mapVehicleClassToCard(quote.vehicle_class)
            : null;
        const base = fromQuote || fallback;
        if (!quote) return base;
        const currency = quote.currency === 'USD' ? 'US$' : quote.currency || base.currency;
        return {
            ...base,
            total: Number(quote.total ?? base.total),
            base: Number(quote.subtotal ?? base.base),
            tax: Number(quote.tax_amount ?? base.tax),
            currency,
            quote_id: quote.id,
        };
    }, [vehicleId, quote]);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setQuoteLoading(true);
            try {
                if (quoteIdParam) {
                    const existing = await getQuote(quoteIdParam);
                    if (!quoteIsStale(existing)) {
                        if (!cancelled) setQuote(existing);
                        return;
                    }
                }
                const payload = tripParamsToQuotePayload(params, {
                    vehicle_class: vehicleId,
                    seat_addon: params.get('seat') || undefined,
                });
                const data = await createQuotes(payload);
                const q =
                    data.quote ||
                    (data.quotes || []).find((row) => row.vehicle_class?.slug === vehicleId) ||
                    data.quotes?.[0];
                if (!cancelled && q) {
                    setQuote(q);
                    if (q.id) {
                        const next = new URLSearchParams(params);
                        next.set('quote_id', String(q.id));
                        setParams(next, { replace: true });
                    }
                }
            } catch {
                if (!cancelled) setQuote(null);
            } finally {
                if (!cancelled) setQuoteLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
        // Re-load when trip params that affect price change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        quoteIdParam,
        vehicleId,
        params.get('pickup'),
        params.get('dropoff'),
        params.get('date'),
        params.get('time'),
        params.get('service'),
        params.get('mode'),
        params.get('duration'),
        params.get('seat'),
        params.get('lat'),
        params.get('lng'),
        params.get('drop_lat'),
        params.get('drop_lng'),
        params.get('gulf'),
        params.get('legs'),
        params.get('passengers'),
        params.get('students'),
        params.get('term'),
    ]);

    const trip = useMemo(
        () => ({
            pickup: params.get('pickup') || 'Pickup',
            dropoff: params.get('dropoff') || '',
            duration: params.get('duration') || '2',
            date: params.get('date') || new Date().toISOString().slice(0, 10),
            time: params.get('time') || '17:15',
            mode: params.get('mode') || 'transfer',
            lat: Number(params.get('lat')) || 25.2854,
            lng: Number(params.get('lng')) || 51.531,
            dropLat: params.get('drop_lat') != null && params.get('drop_lat') !== '' ? Number(params.get('drop_lat')) : undefined,
            dropLng: params.get('drop_lng') != null && params.get('drop_lng') !== '' ? Number(params.get('drop_lng')) : undefined,
        }),
        [params],
    );

    const { time: pickupTime, period: pickupPeriod } = formatTimeParts(trip.time);

    const [cards, setCards] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [addCardOpen, setAddCardOpen] = useState(false);
    const [billingModalOpen, setBillingModalOpen] = useState(false);
    const [booking, setBooking] = useState(false);
    const [notes, setNotes] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState('');
    const [appliedOffer, setAppliedOffer] = useState('');
    const [bookError, setBookError] = useState('');
    const [bookingBlocked, setBookingBlocked] = useState(false);
    const [tripDialogOpen, setTripDialogOpen] = useState(false);
    const [billing, setBilling] = useState(null);
    const [languageTouched, setLanguageTouched] = useState(false);

    useEffect(() => {
        if (languageTouched || !user) return;
        const saved = user.preferred_language;
        if (saved == null || saved === '') {
            setPreferredLanguage('');
            return;
        }
        const known = PREFERRED_LANGUAGES.some((l) => l.id === saved);
        setPreferredLanguage(known ? saved : '');
    }, [user, languageTouched]);

    const selectedCard = cards.find((c) => c.id === selectedCardId) || null;
    const guestId = params.get('guest') || '';
    const selectedGuest = useMemo(
        () => findById(guestId) || findGuestById(guestId, guests),
        [findById, guestId, guests],
    );
    const passengerLabel = selectedGuest ? guestDisplayName(selectedGuest) : 'For myself';

    const onPassengerChange = (nextGuestId) => {
        const q = new URLSearchParams(params);
        if (nextGuestId) q.set('guest', nextGuestId);
        else q.delete('guest');
        setParams(q, { replace: true });
    };

    const onPreferredLanguageChange = (value) => {
        setLanguageTouched(true);
        setPreferredLanguage(value);
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
        if (!isAuthenticated) return;
        let cancelled = false;
        Promise.all([getPaymentMethods(), getBillingProfile()])
            .then(([methods, profile]) => {
                if (cancelled) return;
                setCards(methods);
                setBilling(profile);
                const preferred = methods.find((card) => card.is_default) || methods[0];
                if (preferred) setSelectedCardId(preferred.id);
            })
            .catch(() => {
                if (!cancelled) {
                    setCards([]);
                    setBilling(null);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    const backToBooking = () => {
        const q = new URLSearchParams(params);
        q.delete('vehicle');
        q.delete('guest');
        navigate(`/booking?${q.toString()}`);
    };

    const onSaveCard = (card) => {
        setCards((current) => [...current, card]);
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
        q.delete('quote_id');
        setParams(q, { replace: true });
    };

    const canBook = Boolean(billing);
    const billingLine = billingSummary(billing);

    useEffect(() => {
        if (!isAuthenticated) return undefined;
        let cancelled = false;
        listBookings()
            .then((res) => {
                if (cancelled || !res?.blocked) return;
                setBookingBlocked(true);
                setTripDialogOpen(true);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    const onBook = async () => {
        if (!billing) return;
        if (bookingBlocked) {
            setTripDialogOpen(true);
            return;
        }
        setBooking(true);
        setBookError('');
        try {
            let current = quote;
            if (quoteIsStale(current)) {
                const payload = tripParamsToQuotePayload(params, {
                    vehicle_class: vehicleId,
                    seat_addon: params.get('seat') || undefined,
                });
                const data = await createQuotes(payload);
                current =
                    data.quote ||
                    (data.quotes || []).find((row) => row.vehicle_class?.slug === vehicleId) ||
                    data.quotes?.[0];
                if (current) setQuote(current);
            }
            const quoteId = current?.id;
            if (!quoteId) {
                throw new Error('Unable to create a price quote for this trip.');
            }

            const guestPayload = selectedGuest
                ? {
                      title: selectedGuest.title,
                      first_name: selectedGuest.first_name,
                      last_name: selectedGuest.last_name,
                      email: selectedGuest.email,
                      phone: selectedGuest.phone,
                  }
                : undefined;

            const booked = await createBooking({
                quote_id: Number(quoteId),
                for_myself: !selectedGuest,
                guest: guestPayload,
                customer_notes: notes || undefined,
                preferred_language: preferredLanguage || undefined,
            });
            navigate(`/journeys/ride/${booked.id}`);
        } catch (err) {
            if (err?.response?.status === 409) {
                setBookingBlocked(true);
                setTripDialogOpen(true);
                setBookError('');
                return;
            }
            const msg =
                err?.response?.data?.message ||
                Object.values(err?.response?.data?.errors || {}).flat()[0] ||
                err?.message ||
                'Booking failed. Please try again.';
            setBookError(msg);
        } finally {
            setBooking(false);
        }
    };

    if (loading || !isAuthenticated || quoteLoading) {
        return <Skeleton variant="page" />;
    }

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
                preferredLanguage={preferredLanguage}
                setPreferredLanguage={onPreferredLanguageChange}
                preferredLanguages={PREFERRED_LANGUAGES}
                canBook={canBook}
                booking={booking}
                onBook={onBook}
                onBack={backToBooking}
                onUpdateTrip={onUpdateTrip}
                onAddCard={() => setAddCardOpen(true)}
                onSelectCard={setSelectedCardId}
                onApplyOffer={setAppliedOffer}
                appliedOffer={appliedOffer}
                billingLine={billingLine}
                onEditBilling={() => setBillingModalOpen(true)}
                bookError={bookError}
            />

            {/* Desktop layout */}
            <div className="hidden lg:block">
                <SiteLayout className="relative min-w-0 overflow-x-clip bg-page" showFooter={false}>
                    <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
                        <div className="min-w-0 px-4 pb-10 pt-[96px] sm:px-6 lg:px-10 lg:pt-[calc(var(--booking-bar-h,80px)+16px)] lg:pb-16 xl:px-14">
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
                                <p className="font-geist mt-2 m-0 text-[14px] leading-6 text-muted">
                                    You can save a card now. Nothing is charged when you book.
                                </p>

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
                                    <h3 className="font-geist m-0 text-[15px] font-500 text-ink-text">
                                        Billing information
                                    </h3>
                                    {billing ? (
                                        <p className="font-geist mt-2 m-0 text-[14px] leading-6 text-muted">
                                            {billingLine}
                                        </p>
                                    ) : (
                                        <p className="font-geist mt-2 m-0 text-[14px] leading-6 text-muted">
                                            Add a billing address before you book.
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setBillingModalOpen(true)}
                                        className="font-geist mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] bg-white px-4 py-2.5 text-[16px] font-500 text-ink-text transition hover:bg-page"
                                    >
                                        {billing ? 'Edit billing information' : 'Add billing information'}
                                    </button>
                                </div>

                                <hr className="my-6 border-0 border-t border-[#e8e6e1]" />

                                <div>
                                    <label className="font-geist mb-1.5 block text-[14px] text-muted" htmlFor="co-ref">
                                        Reference code
                                    </label>
                                    <input
                                        id="co-ref"
                                        value="Assigned when you book"
                                        readOnly
                                        className={`${fieldClass} cursor-default bg-page text-muted`}
                                        aria-describedby="co-ref-help"
                                    />
                                    <p id="co-ref-help" className="font-geist mt-2 m-0 text-[13px] text-muted">
                                        A unique reference is created on the server and appears on your journey.
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
                                            Online payment is not available yet. Nothing is charged when you book.
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-6 rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                                <h2 className="font-fragment m-0 text-[22px] leading-8 font-400 text-ink-text">
                                    Pickup preferences
                                </h2>

                                <div className="mt-5">
                                    <p className="font-geist m-0 text-[14px] text-muted">
                                        Preferred language{' '}
                                        <span className="text-muted/80">(optional)</span>
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] leading-5 text-muted">
                                        Language you&apos;d like your chauffeur to speak with you.
                                    </p>
                                    <div
                                        role="radiogroup"
                                        aria-label="Preferred chauffeur language"
                                        className="mt-3 flex flex-wrap gap-2"
                                    >
                                        <label
                                            className={`font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 py-2 text-[13px] transition sm:text-[14px] ${
                                                preferredLanguage === ''
                                                    ? 'border-wine-700 bg-wine-50 text-wine-800 shadow-[0_0_0_1px_#5b0520]'
                                                    : 'border-[#e0ddd6] bg-white text-ink-text hover:border-[#c9c5bc]'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="preferred-language"
                                                className="sr-only"
                                                value=""
                                                checked={preferredLanguage === ''}
                                                onChange={() => onPreferredLanguageChange('')}
                                            />
                                            <span
                                                className={`mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                                    preferredLanguage === ''
                                                        ? 'border-wine-700'
                                                        : 'border-[#c9c5bc]'
                                                }`}
                                                aria-hidden="true"
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        preferredLanguage === ''
                                                            ? 'bg-wine-700'
                                                            : 'bg-transparent'
                                                    }`}
                                                />
                                            </span>
                                            No preference
                                        </label>
                                        {PREFERRED_LANGUAGES.map((lang) => {
                                            const on = preferredLanguage === lang.id;
                                            return (
                                                <label
                                                    key={lang.id}
                                                    title={lang.name}
                                                    className={`font-geist inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 py-2 text-[13px] transition sm:text-[14px] ${
                                                        on
                                                            ? 'border-wine-700 bg-wine-50 text-wine-800 shadow-[0_0_0_1px_#5b0520]'
                                                            : 'border-[#e0ddd6] bg-white text-ink-text hover:border-[#c9c5bc]'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="preferred-language"
                                                        className="sr-only"
                                                        value={lang.id}
                                                        checked={on}
                                                        onChange={() => onPreferredLanguageChange(lang.id)}
                                                    />
                                                    <span
                                                        className={`mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                                            on ? 'border-wine-700' : 'border-[#c9c5bc]'
                                                        }`}
                                                        aria-hidden="true"
                                                    >
                                                        <span
                                                            className={`h-2 w-2 rounded-full ${
                                                                on ? 'bg-wine-700' : 'bg-transparent'
                                                            }`}
                                                        />
                                                    </span>
                                                    <span aria-label={lang.name}>{lang.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-6">
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
                                        maxLength={2000}
                                        placeholder="Special instructions for your journey"
                                        aria-describedby="co-notes-help"
                                    />
                                    <p id="co-notes-help" className="font-geist mt-2 m-0 text-[13px] text-muted">
                                        Additional wait time or distance requests may incur additional charges.
                                    </p>
                                </div>
                            </section>
                        </div>

                        <div className="w-full border-t border-[#e8e6e1] lg:border-t-0 lg:border-l lg:border-[#e8e6e1] lg:pt-[var(--booking-bar-h,80px)]">
                            {bookError ? (
                                <p className="font-geist mx-4 mt-4 m-0 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[14px] text-rose-700 lg:mx-6">
                                    {bookError}
                                </p>
                            ) : null}
                            <CheckoutSidebar
                                vehicle={vehicle}
                                pickupLabel={trip.pickup}
                                pickupTime={pickupTime}
                                pickupPeriod={pickupPeriod}
                                mapLat={trip.lat}
                                mapLng={trip.lng}
                                canBook={canBook}
                                onBook={onBook}
                                booking={booking}
                            />
                        </div>
                    </div>
                </SiteLayout>
            </div>

            <OpenBookingDialog
                open={tripDialogOpen}
                message={OPEN_BOOKING_MESSAGE}
                onClose={() => setTripDialogOpen(false)}
            />
            <AddCardModal open={addCardOpen} onClose={() => setAddCardOpen(false)} onSave={onSaveCard} />
            <BillingModal
                open={billingModalOpen}
                countries={COUNTRIES}
                profile={billing}
                onClose={() => setBillingModalOpen(false)}
                onSaved={setBilling}
            />
        </>
    );
}
