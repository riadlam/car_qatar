import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { formatMoney } from '../../data/journeys';
import { VEHICLE_CATALOG } from '../../data/bookingVehicles';
import { IconPassengers, IconLuggage } from '../booking/icons';

function ContactSheet({ open, onClose, chauffeur, bookingNumber }) {
    if (!open || !chauffeur) return null;
    return createPortal(
        <div
            className="fixed inset-0 z-[220] flex items-end bg-ink/45 sm:items-center sm:justify-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-chauffeur-title"
        >
            <button type="button" className="absolute inset-0 border-0" aria-label="Close" onClick={onClose} />
            <div className="relative z-[1] w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
                <h2 id="contact-chauffeur-title" className="font-fragment m-0 text-[22px] text-ink-text">
                    Contact chauffeur
                </h2>
                <p className="font-geist mt-1 m-0 text-[14px] text-muted">Booking {bookingNumber}</p>

                <div className="mt-5 flex items-center gap-3 rounded-xl bg-page px-3 py-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine-700 text-[15px] font-600 text-white">
                        {chauffeur.name
                            .split(' ')
                            .map((p) => p[0])
                            .join('')
                            .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                        <p className="font-geist m-0 text-[16px] font-500 text-ink-text">{chauffeur.name}</p>
                        <p className="font-geist m-0 text-[13px] text-muted">
                            ★ {chauffeur.rating} · {chauffeur.vehicle_plate}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    <a
                        href={`tel:${chauffeur.phone || ''}`}
                        className="font-geist flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-wine-700 text-[15px] font-500 text-white hover:bg-wine-600"
                    >
                        Call {chauffeur.phone || 'chauffeur'}
                    </a>
                    <a
                        href={`sms:${chauffeur.phone || ''}`}
                        className="font-geist flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] text-[15px] font-500 text-ink-text hover:border-wine-700"
                    >
                        Send SMS
                    </a>
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist mt-1 min-h-11 cursor-pointer rounded-full text-[14px] font-500 text-muted"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

/**
 * Right rail — vehicle summary + chauffeur + actions (map lives on the left).
 */
export default function JourneyRideSidebar({
    journey: j,
    mode = 'details',
    showCar = false,
    onContact,
    trackingProgress = 0.35,
}) {
    const navigate = useNavigate();
    const vehicle = VEHICLE_CATALOG.find((v) => v.id === j.vehicle_id) || null;
    const isTrack = mode === 'track';
    const canTrack =
        j.status === 'upcoming' &&
        Boolean(j.chauffeur) &&
        (j.phase === 'upcoming_soon' || j.phase === 'chauffeur_assigned' || j.actions?.includes('track'));
    const etaMins = Math.max(2, Math.round((1 - trackingProgress) * 22));

    return (
        <aside className="booking-sidebar flex flex-col bg-page lg:sticky lg:top-[80px] lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto lg:border-0">
            <div className="relative h-[200px] w-full overflow-hidden bg-[#ebe8e2] lg:h-[240px]">
                {j.vehicle_image || vehicle?.main?.lg || vehicle?.main?.sm ? (
                    <img
                        src={j.vehicle_image || vehicle?.main?.lg || vehicle?.main?.sm}
                        alt={j.vehicle}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(165deg,#fbf8f2_0%,#f0e8ea_100%)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col px-4 pb-6 pt-4 sm:px-5">
                {(isTrack || showCar) && (
                    <div className="mb-4 rounded-xl border border-wine-700/20 bg-wine-50 px-3 py-3">
                        <p className="font-geist m-0 text-[12px] font-600 tracking-wide text-wine-700 uppercase">
                            {j.mode === 'airport' ? 'En route to airport' : 'Chauffeur on the way'}
                        </p>
                        <p className="font-geist mt-1 m-0 text-[14px] font-500 text-ink-text">
                            {j.chauffeur ? `${j.chauffeur.name} · ~${etaMins} min` : `Arriving in ~${etaMins} min`}
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                            <div
                                className="h-full rounded-full bg-wine-700 transition-[width] duration-700"
                                style={{ width: `${Math.round(trackingProgress * 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-start justify-between gap-3 border-b border-[#e8e6e1] pb-4">
                    <div className="min-w-0">
                        <div className="font-geist text-[18px] leading-6 font-500 text-ink-text">{j.vehicle}</div>
                        <div className="font-geist mt-0.5 text-[14px] leading-5 text-muted">
                            {j.vehicle_similar || 'Premium chauffeur'}
                        </div>
                        {vehicle ? (
                            <div className="mt-2 flex items-center gap-3 text-ink-text">
                                <span className="inline-flex items-center gap-1">
                                    <IconPassengers className="h-5 w-5" />
                                    <span className="font-geist text-[14px]">{vehicle.passengers}</span>
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <IconLuggage className="h-5 w-5" />
                                    <span className="font-geist text-[14px]">{vehicle.luggage}</span>
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <div className="font-geist shrink-0 text-[18px] leading-6 font-500 text-ink-text">
                        {formatMoney(j.price, j.currency)}
                    </div>
                </div>

                {j.chauffeur ? (
                    <div className="mt-4 rounded-xl border border-[#e0ddd6] bg-white px-3 py-3">
                        <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                            Your chauffeur
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-700 text-[14px] font-600 text-white">
                                {j.chauffeur.name
                                    .split(' ')
                                    .map((p) => p[0])
                                    .join('')
                                    .slice(0, 2)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-geist m-0 text-[15px] font-500 text-ink-text">{j.chauffeur.name}</p>
                                <p className="font-geist m-0 text-[13px] text-muted">
                                    ★ {j.chauffeur.rating} · {j.chauffeur.vehicle_plate}
                                </p>
                            </div>
                        </div>
                        {j.chauffeur_eta ? (
                            <p className="font-geist mt-2 m-0 text-[13px] text-wine-700">{j.chauffeur_eta}</p>
                        ) : null}
                    </div>
                ) : null}

                <div className="mt-auto flex flex-col gap-2 pt-5">
                    {isTrack || showCar ? (
                        <>
                            <button
                                type="button"
                                onClick={onContact}
                                disabled={!j.chauffeur}
                                className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:cursor-not-allowed disabled:bg-[#aeaeae]"
                            >
                                Contact chauffeur
                            </button>
                            <Link
                                to={isTrack ? `/journeys/ride/${j.id}` : `/journeys/ride/${j.id}/track`}
                                className="font-geist flex min-h-11 w-full items-center justify-center rounded-full border border-[#d8d8dc] text-[15px] font-500 text-ink-text"
                            >
                                {isTrack ? 'View trip details' : 'Open live tracking'}
                            </Link>
                        </>
                    ) : (
                        <>
                            {canTrack ? (
                                <button
                                    type="button"
                                    onClick={() => navigate(`/journeys/ride/${j.id}/track`)}
                                    className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                                >
                                    Live tracking
                                </button>
                            ) : null}
                            {j.chauffeur && j.status === 'upcoming' ? (
                                <button
                                    type="button"
                                    onClick={onContact}
                                    className="font-geist flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full border border-wine-700 px-4 py-3 text-[16px] font-500 text-wine-700 transition hover:bg-wine-50"
                                >
                                    Contact chauffeur
                                </button>
                            ) : null}
                            <Link
                                to="/journeys"
                                className="font-geist flex min-h-11 w-full items-center justify-center rounded-full border border-[#d8d8dc] text-[15px] font-500 text-ink-text"
                            >
                                Back to journeys
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}

export { ContactSheet };
