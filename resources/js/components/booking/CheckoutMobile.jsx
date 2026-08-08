import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { EXAMPLE_GUESTS, loadSavedGuests, saveGuests } from '../../data/bookingGuests';
import RouteMap from './RouteMap';
import EditTripModal from './EditTripModal';
import AddGuestModal, { guestDisplayName } from './AddGuestModal';
import { IconChevronDown, IconPassengers, IconPerson } from './icons';

const DURATION_LABELS = {
    '2': '2 hours',
    '3': '3 hours',
    '4': '4 hours',
    '6': '6 hours',
    '8': '8 hours',
    '12': '12 hours',
};

function formatLongDate(dateStr) {
    const d = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
    if (Number.isNaN(d.getTime())) return 'Select date';
    return d.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

function formatClock(timeStr) {
    if (!timeStr) return '—';
    const [hRaw, m = '00'] = timeStr.split(':');
    let h = Number(hRaw);
    const period = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return `${h}:${m} ${period}`;
}

function addMinutes(timeStr, mins) {
    const [h, m] = (timeStr || '10:00').split(':').map(Number);
    const total = h * 60 + m + mins;
    const nh = Math.floor((((total % (24 * 60)) + 24 * 60) % (24 * 60)) / 60);
    const nm = ((total % (24 * 60)) + 24 * 60) % 60;
    return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

function CalendarChangeIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3.5 9.5H20.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 3.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 3.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path
                d="M15.5 16.5a2.75 2.75 0 1 0-2.6-3.65"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path d="M12.2 14.2l.7-1.6 1.55.55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CarIcon() {
    return (
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden="true">
            <path
                d="M4 11.5h20c.8 0 1.5-.7 1.5-1.5V8.2c0-.5-.2-1-.6-1.3L21.2 4.2A2 2 0 0 0 19.7 3.5H8.3c-.5 0-1 .2-1.3.6L3.1 6.9c-.4.4-.6.9-.6 1.4V10c0 .8.7 1.5 1.5 1.5Z"
                stroke="#5b0520"
                strokeWidth="1.4"
            />
            <circle cx="8" cy="12.5" r="1.6" fill="#5b0520" />
            <circle cx="20" cy="12.5" r="1.6" fill="#5b0520" />
        </svg>
    );
}

function NotesIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 4H16C17.1046 4 18 4.89543 18 6V20L15 18L12 20L9 18L6 20V6C6 4.89543 6.89543 4 8 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 8H15M9 11.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/**
 * Mobile checkout — map + floating trip card + class/payment + Book now / change date.
 */
export default function CheckoutMobile({
    vehicle,
    trip,
    passengerLabel = 'For myself',
    guestId = '',
    onPassengerChange,
    selectedCard,
    cards,
    notes,
    setNotes,
    preferredLanguage = '',
    setPreferredLanguage,
    preferredLanguages = [],
    canBook,
    booking,
    onBook,
    onBack,
    onUpdateTrip,
    onAddCard,
    onSelectCard,
    onApplyOffer,
    appliedOffer,
}) {
    const [editOpen, setEditOpen] = useState(false);
    const [notesOpen, setNotesOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [cardsOpen, setCardsOpen] = useState(false);
    const [offerOpen, setOfferOpen] = useState(false);
    const [offerCode, setOfferCode] = useState('');
    const [passengerOpen, setPassengerOpen] = useState(false);
    const [guestListOpen, setGuestListOpen] = useState(Boolean(guestId));
    const [addGuestOpen, setAddGuestOpen] = useState(false);
    const [savedGuests, setSavedGuests] = useState([]);

    useEffect(() => {
        setSavedGuests(loadSavedGuests());
    }, []);

    useEffect(() => {
        if (guestId) setGuestListOpen(true);
    }, [guestId]);

    const guests = useMemo(() => [...EXAMPLE_GUESTS, ...savedGuests], [savedGuests]);
    const forGuest = Boolean(guestId);
    const selectedGuest = useMemo(
        () => guests.find((g) => g.id === guestId) || null,
        [guests, guestId],
    );

    const isHourly = trip.mode === 'hourly';
    const dropLabel = isHourly
        ? DURATION_LABELS[trip.duration] || 'By the hour'
        : trip.dropoff || 'Drop-off';

    const etaMins = isHourly ? Number(trip.duration || 2) * 60 : 50;
    const arriveTime = addMinutes(trip.time, isHourly ? 0 : etaMins);
    const etaLabel = isHourly ? DURATION_LABELS[trip.duration] || `${trip.duration}h` : `${etaMins} min`;

    const dateLabel = useMemo(() => formatLongDate(trip.date), [trip.date]);

    const selectMyself = () => {
        onPassengerChange?.(null);
        setGuestListOpen(false);
        setPassengerOpen(false);
    };

    const selectGuest = (id) => {
        onPassengerChange?.(id);
        setGuestListOpen(true);
    };

    const onAddGuest = (guest) => {
        const next = [...savedGuests, guest];
        setSavedGuests(next);
        saveGuests(next);
        onPassengerChange?.(guest.id);
        setGuestListOpen(true);
        setAddGuestOpen(false);
    };

    return (
        <div className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-white lg:hidden">
            {/* Header */}
            <header className="relative z-40 flex shrink-0 items-center gap-2 border-b border-[#eeebe4] bg-white/95 px-3 py-3 backdrop-blur">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Go back"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink-text hover:bg-page"
                >
                    <svg width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="font-geist m-0 flex-1 pr-10 text-center text-[17px] font-600 text-ink-text">
                    Confirm reservation
                </h1>
            </header>

            {/* Map grows to fill leftover viewport space — kept under UI via z-0 */}
            <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
                <RouteMap
                    pickupLabel={trip.pickup}
                    dropoffLabel={dropLabel}
                    lat={trip.lat}
                    lng={trip.lng}
                    className="pointer-events-auto absolute inset-0 z-0 h-full w-full"
                />

                <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-30 rounded-2xl border border-white/60 bg-white/95 p-3.5 shadow-[0_12px_40px_rgba(15,19,25,0.18)] backdrop-blur-md">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="font-geist m-0 text-[14px] font-500 text-ink-text">{dateLabel}</p>
                        <button
                            type="button"
                            onClick={() => setPassengerOpen(true)}
                            aria-haspopup="dialog"
                            aria-expanded={passengerOpen}
                            className="inline-flex max-w-[55%] cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-ink-text"
                        >
                            <IconPerson className="h-4 w-4 shrink-0" />
                            <span className="font-geist truncate text-[13px] font-500">
                                {passengerLabel}
                            </span>
                            <IconChevronDown />
                        </button>
                    </div>
                    <hr className="mb-3 border-0 border-t border-[#e8e6e1]" />
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <div className="min-w-0">
                            <p className="font-geist m-0 truncate text-[13px] font-500 text-ink-text" title={trip.pickup}>
                                {trip.pickup || 'Pickup'}
                            </p>
                            <p className="font-geist m-0 mt-0.5 text-[12px] text-muted">{formatClock(trip.time)}</p>
                        </div>
                        <div className="flex flex-col items-center px-1">
                            <span className="font-geist mb-1 text-[11px] font-500 text-wine-700">{etaLabel}</span>
                            <div className="flex items-center gap-1">
                                <span className="h-px w-4 border-t border-dashed border-wine-400" />
                                <CarIcon />
                                <span className="h-px w-4 border-t border-dashed border-wine-400" />
                            </div>
                        </div>
                        <div className="min-w-0 text-right">
                            <p className="font-geist m-0 truncate text-[13px] font-500 text-ink-text" title={dropLabel}>
                                {dropLabel}
                            </p>
                            <p className="font-geist m-0 mt-0.5 text-[12px] text-muted">
                                {isHourly ? 'Hourly' : formatClock(arriveTime)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Class / payment / extras — above map */}
            <div className="relative z-40 shrink-0 border-t border-[#eeebe4] bg-white px-4 pb-[calc(4.75rem+env(safe-area-inset-bottom))] pt-4">
                <h2 className="font-geist m-0 text-[24px] font-600 tracking-[-0.02em] text-ink-text">
                    {vehicle.name}
                </h2>
                <p className="font-geist mt-1 m-0 text-[13px] text-muted">{vehicle.similar}</p>

                <button
                    type="button"
                    onClick={() => (cards.length ? setCardsOpen(true) : onAddCard())}
                    className="mt-5 flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#e8e6e1] bg-page/60 px-3 py-3 text-left"
                >
                    {selectedCard ? (
                        <>
                            <span className="font-geist rounded bg-[#1a1f71] px-1.5 py-0.5 text-[10px] font-700 tracking-wide text-white">
                                {selectedCard.brand?.slice(0, 4).toUpperCase() || 'CARD'}
                            </span>
                            <span className="font-geist flex-1 text-[15px] text-ink-text">
                                •••• {selectedCard.last4}
                            </span>
                        </>
                    ) : (
                        <span className="font-geist flex-1 text-[15px] text-muted">Add payment method</span>
                    )}
                    <IconChevronDown />
                </button>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => setNotesOpen((v) => !v)}
                        className="font-geist inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-500 text-ink-text"
                    >
                        <NotesIcon />
                        Pickup notes
                        <span className={`transition ${notesOpen ? 'rotate-180' : ''}`}>
                            <IconChevronDown />
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setLangOpen((v) => !v)}
                        className="font-geist inline-flex cursor-pointer items-center gap-1 text-[14px] font-500 text-ink-text"
                    >
                        Language
                        {preferredLanguage ? (
                            <span className="rounded-full bg-wine-50 px-2 py-0.5 text-[12px] text-wine-800">
                                {preferredLanguages.find((l) => l.id === preferredLanguage)?.label ||
                                    preferredLanguage}
                            </span>
                        ) : null}
                        <span className={`transition ${langOpen ? 'rotate-180' : ''}`}>
                            <IconChevronDown />
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setOfferOpen(true)}
                        className="font-geist inline-flex cursor-pointer items-center gap-1 text-[14px] font-500 text-ink-text"
                    >
                        <span className="text-wine-700">+</span>
                        {appliedOffer ? appliedOffer : 'Apply promotion'}
                    </button>
                </div>

                {langOpen && setPreferredLanguage && (
                    <div
                        role="radiogroup"
                        aria-label="Preferred chauffeur language"
                        className="mt-3 flex flex-wrap gap-2"
                    >
                        <label
                            className={`font-geist inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3 py-1.5 text-[13px] ${
                                preferredLanguage === ''
                                    ? 'border-wine-700 bg-wine-50 text-wine-800'
                                    : 'border-[#e0ddd6] bg-white text-ink-text'
                            }`}
                        >
                            <input
                                type="radio"
                                name="preferred-language-mobile"
                                className="sr-only"
                                checked={preferredLanguage === ''}
                                onChange={() => setPreferredLanguage('')}
                            />
                            No preference
                        </label>
                        {preferredLanguages.map((lang) => {
                            const on = preferredLanguage === lang.id;
                            return (
                                <label
                                    key={lang.id}
                                    title={lang.name}
                                    className={`font-geist inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3 py-1.5 text-[13px] ${
                                        on
                                            ? 'border-wine-700 bg-wine-50 text-wine-800'
                                            : 'border-[#e0ddd6] bg-white text-ink-text'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="preferred-language-mobile"
                                        className="sr-only"
                                        checked={on}
                                        onChange={() => setPreferredLanguage(lang.id)}
                                    />
                                    {lang.label}
                                </label>
                            );
                        })}
                    </div>
                )}

                {notesOpen && (
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className="font-geist mt-3 w-full rounded-xl border border-[#d8d8dc] px-3 py-2.5 text-[14px] outline-none focus:border-wine-700"
                        placeholder="Special instructions for your journey"
                    />
                )}
            </div>

            {/* Sticky footer */}
            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eeebe4] bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        disabled={!canBook || booking}
                        onClick={onBook}
                        className={`font-geist flex h-12 flex-1 items-center justify-center rounded-full text-[16px] font-500 text-white transition ${
                            canBook && !booking
                                ? 'cursor-pointer bg-wine-700 hover:bg-wine-600'
                                : 'cursor-not-allowed bg-[#aeaeae]'
                        }`}
                    >
                        {booking ? 'Booking…' : 'Book now'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditOpen(true)}
                        aria-label="Change date and trip details"
                        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#d8d4cc] bg-white text-ink-text shadow-sm transition hover:bg-page"
                    >
                        <CalendarChangeIcon />
                    </button>
                </div>
            </div>

            <EditTripModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                initial={trip}
                onSave={onUpdateTrip}
            />

            <AddGuestModal
                open={addGuestOpen}
                onClose={() => setAddGuestOpen(false)}
                onSave={onAddGuest}
            />

            {passengerOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[200] flex items-end bg-ink/45 sm:items-center sm:justify-center sm:p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="passenger-sheet-title"
                    >
                        <button
                            type="button"
                            className="absolute inset-0 border-0"
                            aria-label="Close"
                            onClick={() => setPassengerOpen(false)}
                        />
                        <div className="relative z-[1] max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
                            <h3
                                id="passenger-sheet-title"
                                className="font-fragment m-0 text-[20px] text-ink-text"
                            >
                                Who is travelling?
                            </h3>
                            <p className="font-geist mt-1 m-0 text-[14px] text-muted">
                                Book for yourself or choose a guest
                            </p>

                            <div className="mt-4 flex flex-col gap-2">
                                <button
                                    type="button"
                                    aria-pressed={!forGuest}
                                    onClick={selectMyself}
                                    className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                                        !forGuest
                                            ? 'border-wine-700 bg-wine-50'
                                            : 'border-[#e0ddd6] bg-white'
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
                                        aria-expanded={guestListOpen}
                                        onClick={() => {
                                            setGuestListOpen((v) => !v || !forGuest);
                                            if (!forGuest && guests[0]) {
                                                onPassengerChange?.(guests[0].id);
                                            }
                                        }}
                                        className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-left transition ${
                                            forGuest
                                                ? 'border-wine-700 bg-wine-50'
                                                : 'border-[#e0ddd6] bg-white'
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
                                        <span
                                            className={`mt-1 text-ink-text transition ${guestListOpen ? 'rotate-180' : ''}`}
                                        >
                                            <IconChevronDown />
                                        </span>
                                    </button>

                                    {guestListOpen && (
                                        <div className="mt-2 overflow-hidden rounded-xl border border-[#e0ddd6] bg-white">
                                            <div
                                                role="listbox"
                                                aria-label="Saved guests"
                                                className="max-h-[220px] overflow-y-auto"
                                            >
                                                {guests.map((guest) => {
                                                    const selected = guest.id === guestId;
                                                    return (
                                                        <button
                                                            key={guest.id}
                                                            type="button"
                                                            role="option"
                                                            aria-selected={selected}
                                                            onClick={() => {
                                                                selectGuest(guest.id);
                                                                setPassengerOpen(false);
                                                            }}
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

                            <button
                                type="button"
                                onClick={() => setPassengerOpen(false)}
                                className="font-geist mt-5 w-full cursor-pointer rounded-full border border-[#d8d8dc] py-3 text-[15px] font-500"
                            >
                                Done
                            </button>
                        </div>
                    </div>,
                    document.body,
                )}

            {cardsOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[200] flex items-end bg-ink/45 sm:items-center sm:justify-center sm:p-4">
                        <button type="button" className="absolute inset-0 border-0" aria-label="Close" onClick={() => setCardsOpen(false)} />
                        <div className="relative z-[1] w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
                            <h3 className="font-fragment m-0 text-[20px] text-ink-text">Payment method</h3>
                            <div className="mt-4 flex flex-col gap-2">
                                {cards.map((card) => (
                                    <button
                                        key={card.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectCard(card.id);
                                            setCardsOpen(false);
                                        }}
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left ${
                                            selectedCard?.id === card.id
                                                ? 'border-wine-700 bg-wine-50'
                                                : 'border-[#e0ddd6]'
                                        }`}
                                    >
                                        <span className="font-geist text-[15px]">
                                            {card.brand} •••• {card.last4}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setCardsOpen(false);
                                    onAddCard();
                                }}
                                className="font-geist mt-4 w-full cursor-pointer rounded-full border border-[#d8d8dc] py-3 text-[15px] font-500"
                            >
                                Add card
                            </button>
                        </div>
                    </div>,
                    document.body,
                )}

            {offerOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[200] flex items-end bg-ink/45 p-0 sm:items-center sm:justify-center sm:p-4">
                        <button type="button" className="absolute inset-0 border-0" aria-label="Close" onClick={() => setOfferOpen(false)} />
                        <form
                            className="relative z-[1] w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (offerCode.trim()) onApplyOffer(offerCode.trim().toUpperCase());
                                setOfferOpen(false);
                            }}
                        >
                            <h3 className="font-fragment m-0 text-[20px] text-ink-text">Apply promotion</h3>
                            <input
                                value={offerCode}
                                onChange={(e) => setOfferCode(e.target.value)}
                                className="font-geist mt-4 w-full rounded-lg border border-[#d8d8dc] px-4 py-3 text-[16px] outline-none focus:border-wine-700"
                                placeholder="Offer code"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="font-geist mt-4 w-full cursor-pointer rounded-full bg-wine-700 py-3 text-[15px] font-500 text-white"
                            >
                                Apply
                            </button>
                        </form>
                    </div>,
                    document.body,
                )}
        </div>
    );
}
