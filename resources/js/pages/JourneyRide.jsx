import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import TripLiveMap from '../components/journeys/TripLiveMap';
import { IncludedIcon } from '../components/booking/icons';
import JourneyRideSidebar, { ContactSheet } from '../components/journeys/JourneyRideSidebar';
import { useAuth } from '../context/AuthContext';
import { cancelBooking, getBooking } from '../api/bookings';
import CancelReasonModal from '../components/journeys/CancelReasonModal';
import { findJourney, formatMoney } from '../data/journeys';
import { INCLUDED } from '../data/bookingVehicles';
import { applyTrackToJourney, bookingToJourney } from '../utils/bookingMappers';
import { subscribePrivate } from '../echo';
import Skeleton from '../components/ui/Skeleton';

const TIMELINE = [
    { id: 'waiting', label: 'Route' },
    { id: 'to_pickup', label: 'To pickup' },
    { id: 'to_dropoff', label: 'To drop-off' },
    { id: 'completed', label: 'Completed' },
];

const CANCEL_TIMELINE = [
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Canceled' },
];

function mapStep(journey) {
    if (!journey) return 'waiting';
    if (journey.status === 'past' || journey.phase === 'completed') return 'completed';
    if (journey.trip_step === 'to_pickup' || journey.trip_step === 'to_dropoff') return journey.trip_step;
    const status = journey.assignment_status;
    if (status === 'arrived' || status === 'in_progress') return 'to_dropoff';
    if (status === 'assigned' || status === 'en_route' || journey.phase === 'chauffeur_assigned') return 'to_pickup';
    return 'waiting';
}

function phaseIndex(journey) {
    if (journey?.status === 'cancelled' || journey?.status === 'canceled') return 1;
    const step = mapStep(journey);
    if (step === 'completed') return 3;
    if (step === 'to_dropoff') return 2;
    if (step === 'to_pickup') return 1;
    return 0;
}

function isDemoId(id) {
    return String(id || '').startsWith('demo_');
}

/**
 * Journey ride detail / live tracking — booking-style 2-column layout.
 * Left: live map (car icon when on the way) · Right: trip / chauffeur actions.
 */
export default function JourneyRide({ mode = 'details' }) {
    const { id } = useParams();
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const { loading, isAuthenticated, setReturnTo } = useAuth();
    const [trackingProgress, setTrackingProgress] = useState(0.22);
    const [contactOpen, setContactOpen] = useState(false);
    const [journey, setJourney] = useState(() => findJourney(id) || null);
    const [journeyLoading, setJourneyLoading] = useState(() => !isDemoId(id) && !findJourney(id));
    const [journeyError, setJourneyError] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelBusy, setCancelBusy] = useState(false);

    const step = mapStep(journey);
    const showCar = step === 'to_pickup' || step === 'to_dropoff';
    const hasLiveGps =
        journey?.chauffeur?.latitude != null &&
        journey?.chauffeur?.longitude != null &&
        Number.isFinite(Number(journey.chauffeur.latitude)) &&
        Number.isFinite(Number(journey.chauffeur.longitude));

    const onCarProgress = useCallback((p) => {
        setTrackingProgress(p);
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            const from = `/journeys/ride/${id}`;
            setReturnTo(from);
            navigate(`/login?from=${encodeURIComponent(from)}`, { replace: true });
        }
    }, [loading, isAuthenticated, navigate, setReturnTo, id]);

    useEffect(() => {
        let cancelled = false;
        const demo = findJourney(id);
        if (demo?.demo || isDemoId(id)) {
            setJourney(demo || null);
            setJourneyLoading(false);
            setJourneyError(!demo);
            return undefined;
        }

        if (!isAuthenticated) return undefined;

        setJourneyLoading(true);
        setJourneyError(false);
        getBooking(id)
            .then((booking) => {
                if (!cancelled) setJourney(bookingToJourney(booking));
            })
            .catch(() => {
                if (cancelled) return;
                if (demo) {
                    setJourney(demo);
                } else {
                    setJourney(null);
                    setJourneyError(true);
                }
            })
            .finally(() => {
                if (!cancelled) setJourneyLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id, isAuthenticated]);

    useEffect(() => {
        if (!journey?.api || !isAuthenticated) return undefined;

        let cancelled = false;

        const pull = () => {
            getBooking(journey.id)
                .then((booking) => {
                    if (!cancelled && booking) setJourney(bookingToJourney(booking));
                })
                .catch(() => {});
        };

        const leave = subscribePrivate(
            `booking.${journey.id}`,
            {
                BookingUpdated: (payload) => {
                    if (payload?.booking) {
                        setJourney(bookingToJourney(payload.booking));
                    }
                    if (payload?.track) {
                        setJourney((prev) => applyTrackToJourney(prev, payload.track));
                        if (payload.track.progress != null) setTrackingProgress(Number(payload.track.progress));
                    }
                },
            },
            pull,
        );

        pull();
        const timer = window.setInterval(pull, 4000);

        return () => {
            cancelled = true;
            if (timer) window.clearInterval(timer);
            leave();
        };
    }, [journey?.id, journey?.api, isAuthenticated]);

    useEffect(() => {
        if (params.get('contact') === '1' && journey?.chauffeur) {
            setContactOpen(true);
            const next = new URLSearchParams(params);
            next.delete('contact');
            setParams(next, { replace: true });
        }
    }, [params, setParams, journey]);

    if (loading || !isAuthenticated || journeyLoading) {
        return <Skeleton variant="live" className="min-h-screen bg-page p-4 pt-24 sm:p-6 lg:p-10" />;
    }

    if (!journey || journeyError) {
        return <Navigate to="/journeys" replace />;
    }

    const isCanceled = journey.status === 'cancelled' || journey.status === 'canceled';
    const steps = isCanceled ? CANCEL_TIMELINE : TIMELINE;
    const activeStep = phaseIndex(journey);
    const stepLabel = step === 'to_pickup' ? 'Chauffeur to pickup' : step === 'to_dropoff' ? 'To drop-off' : 'Route';
    const mapTargetLat = step === 'to_pickup' ? journey.lat : step === 'to_dropoff' ? (journey.drop_lat ?? journey.lat) : null;
    const mapTargetLng = step === 'to_pickup' ? journey.lng : step === 'to_dropoff' ? (journey.drop_lng ?? journey.lng) : null;
    const etaMins =
        journey.eta_minutes != null && Number.isFinite(Number(journey.eta_minutes))
            ? Math.max(1, Math.round(Number(journey.eta_minutes)))
            : Math.max(2, Math.round((1 - trackingProgress) * 22));
    const backTab =
        journey.status === 'past'
            ? '/journeys/past'
            : isCanceled
              ? '/journeys/cancelled'
              : '/journeys';

    return (
        <SiteLayout
            className="relative min-w-0 overflow-x-clip bg-page"
            mainClassName="booking-page"
            showFooter={false}
        >
            <div className="mx-auto grid w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
                {/* Left — map instead of vehicle image */}
                <div className="col-start-1 row-start-1 min-w-0 px-4 pt-[104px] sm:px-6 sm:pt-[96px] lg:px-10 xl:px-14">
                    <Link
                        to={backTab}
                        className="font-geist inline-flex items-center gap-1 text-[14px] font-500 text-muted transition hover:text-ink-text"
                    >
                        ← Journeys
                    </Link>

                    <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="font-geist m-0 text-[13px] font-500 tracking-[0.06em] text-muted uppercase">
                                {journey.booking_number}
                            </p>
                            {journey.customer_reference ? (
                                <p className="font-geist m-0 mt-1 text-[14px] text-ink-text">
                                    Ref {journey.customer_reference}
                                </p>
                            ) : null}
                            <h1 className="font-fragment m-0 mt-1 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10">
                                Trip details
                            </h1>
                            <p className="font-geist mt-1 m-0 text-[15px] text-muted">
                                {journey.mode_label}
                                <span className="mx-1.5">·</span>
                                {journey.status_label}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-geist m-0 text-[22px] font-600 text-ink-text">
                                {formatMoney(journey.price, journey.currency)}
                            </p>
                            <p className="font-geist m-0 text-[13px] text-muted">{journey.payment_label}</p>
                        </div>
                    </div>

                    <ol className="mt-6 flex flex-wrap gap-2 sm:gap-0 sm:justify-between">
                        {steps.map((step, i) => {
                            const done = activeStep >= i;
                            const current = activeStep === i;
                            const isCancelStep = step.id === 'cancelled';
                            return (
                                <li key={step.id} className="flex min-w-[40%] flex-1 items-center gap-2 sm:min-w-0">
                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-600 ${
                                            isCancelStep && current
                                                ? 'bg-[#6b6b6b] text-white ring-2 ring-[#6b6b6b]/25'
                                                : done
                                                  ? 'bg-wine-700 text-white'
                                                  : 'border border-[#d8d8dc] bg-white text-muted'
                                        } ${current && !isCancelStep ? 'ring-2 ring-wine-700/25' : ''}`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span
                                        className={`font-geist text-[12px] sm:text-[13px] ${
                                            isCancelStep && current
                                                ? 'font-600 text-ink-text'
                                                : done
                                                  ? 'font-500 text-ink-text'
                                                  : 'text-muted'
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                    {i < steps.length - 1 ? (
                                        <span
                                            className={`mx-1 hidden h-px flex-1 sm:block ${
                                                activeStep > i
                                                    ? isCanceled
                                                        ? 'bg-[#6b6b6b]'
                                                        : 'bg-wine-700'
                                                    : 'bg-[#e0ddd6]'
                                            }`}
                                        />
                                    ) : null}
                                </li>
                            );
                        })}
                    </ol>

                    {isCanceled ? (
                        <div className="mt-4 rounded-xl border border-[#e0ddd6] bg-[#f5f4f1] px-4 py-3">
                            <p className="font-geist m-0 text-[14px] font-500 text-ink-text">
                                {journey.status_label}
                            </p>
                            <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                {journey.cancelled_by === 'chauffeur' ? 'Canceled by chauffeur' : 'Canceled by you'}
                                {journey.cancel_date_label ? ` · ${journey.cancel_date_label}` : ''}
                                {journey.cancel_reason ? ` — ${journey.cancel_reason}` : ''}
                            </p>
                        </div>
                    ) : null}

                    {/* Main map — car icon when chauffeur is on the way */}
                    <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#e5e3df] bg-[#e8e6e1]">
                        <div className="relative aspect-[16/11] w-full sm:aspect-[21/11] lg:aspect-[16/10] lg:min-h-[360px]">
                            <TripLiveMap
                                pickupLabel={journey.pickup}
                                dropoffLabel={journey.dropoff}
                                lat={journey.lat}
                                lng={journey.lng}
                                dropLat={journey.drop_lat}
                                dropLng={journey.drop_lng}
                                showCar={showCar}
                                onCarProgress={onCarProgress}
                                carLat={hasLiveGps ? journey.chauffeur.latitude : null}
                                carLng={hasLiveGps ? journey.chauffeur.longitude : null}
                                liveProgress={
                                    hasLiveGps && journey.track_progress != null
                                        ? journey.track_progress
                                        : null
                                }
                                targetLat={mapTargetLat}
                                targetLng={mapTargetLng}
                                className="absolute inset-0 h-full w-full"
                            />
                        </div>

                        {showCar ? (
                            <div className="absolute inset-x-3 top-3 z-[5] flex max-w-md items-center justify-between gap-3 rounded-xl border border-white/70 bg-white/95 px-3 py-2.5 shadow-md backdrop-blur sm:inset-x-4">
                                <div className="min-w-0">
                                    <p className="font-geist m-0 text-[11px] font-600 tracking-wide text-wine-700 uppercase">
                                        {stepLabel}
                                    </p>
                                    <p className="font-geist m-0 mt-0.5 truncate text-[14px] font-500 text-ink-text">
                                        {journey.chauffeur
                                            ? `${journey.chauffeur.name} · ${etaMins} min`
                                            : `Chauffeur · ${etaMins} min`}
                                    </p>
                                </div>
                                <span className="relative flex h-2.5 w-2.5 shrink-0">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine-700 opacity-55" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-wine-700" />
                                </span>
                            </div>
                        ) : (
                            <div className="absolute left-1/2 top-3 z-[5] flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-stretch overflow-hidden rounded-lg bg-white shadow-[0_2px_12px_rgba(15,19,25,0.12)]">
                                <div className="min-w-0 px-3 py-2">
                                    <div className="font-geist text-[12px] leading-4 text-muted">Route</div>
                                    <div className="font-geist truncate text-[14px] leading-5 font-500 text-ink-text">
                                        {journey.pickup}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right — vehicle + chauffeur + actions */}
                <div className="col-start-1 row-start-2 mt-6 w-full border-t border-[#e8e6e1] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:border-t-0 lg:border-l lg:border-[#e8e6e1] lg:pt-[80px]">
                    <JourneyRideSidebar
                        journey={journey}
                        showCar={showCar}
                        stepLabel={stepLabel}
                        trackingProgress={trackingProgress}
                        onContact={() => setContactOpen(true)}
                        onCancel={() => setCancelOpen(true)}
                    />
                </div>

                {/* Below — itinerary + extras */}
                <div className="col-start-1 row-start-3 min-w-0 px-4 pb-10 sm:px-6 lg:row-start-2 lg:px-10 lg:pb-16 xl:px-14">
                    <hr className="mt-8 border-0 border-t border-[#e8e6e1]" />

                    <h2 className="font-fragment mt-8 m-0 text-[24px] font-400 tracking-[0.25px] text-ink-text">
                        Itinerary
                    </h2>

                    <div className="mt-5 rounded-2xl border border-[#e8e6e1] bg-white p-4 sm:p-5">
                        <p className="font-geist m-0 text-[15px] font-500 text-ink-text">
                            {journey.date_label}
                            <span className="mx-1.5 text-muted">·</span>
                            <span className="text-wine-700">{journey.time_label}</span>
                        </p>

                        <div className="mt-4 grid gap-0">
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center pt-0.5">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-wine-700 text-[10px] font-700 text-wine-700">
                                        A
                                    </span>
                                    <span className="my-1 w-px min-h-[20px] flex-1 bg-wine-700/30" />
                                </div>
                                <div className="min-w-0 pb-4">
                                    <p className="font-geist m-0 text-[12px] text-muted">{journey.time_label}</p>
                                    <p className="font-geist mt-0.5 m-0 text-[16px] font-500 text-ink-text">
                                        {journey.pickup}
                                    </p>
                                    {journey.flight ? (
                                        <p className="font-geist mt-1 m-0 text-[13px] text-wine-700">
                                            {journey.flight}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-wine-700 text-[10px] font-700 text-white">
                                    B
                                </span>
                                <div className="min-w-0">
                                    <p className="font-geist m-0 text-[12px] text-muted">
                                        {journey.arrive_label}
                                        {journey.duration_label ? ` · ${journey.duration_label}` : ''}
                                    </p>
                                    <p className="font-geist mt-0.5 m-0 text-[16px] font-500 text-ink-text">
                                        {journey.dropoff}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-4 sm:p-5">
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                Passenger
                            </p>
                            <p className="font-geist mt-2 m-0 text-[16px] font-500 text-ink-text">
                                {journey.passenger_name}
                                {journey.for_guest ? (
                                    <span className="ml-2 rounded bg-wine-50 px-1.5 py-0.5 text-[11px] font-500 text-wine-700">
                                        Guest
                                    </span>
                                ) : null}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-4 sm:p-5">
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                Payment
                            </p>
                            <p className="font-geist mt-2 m-0 text-[16px] font-500 text-ink-text">
                                {formatMoney(journey.price, journey.currency)}
                            </p>
                            <p className="font-geist mt-1 m-0 text-[13px] text-muted">{journey.payment_label}</p>
                        </div>
                    </div>

                    {journey.notes ? (
                        <div className="mt-4 rounded-2xl border border-[#e8e6e1] bg-white p-4 sm:p-5">
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                Pickup notes
                            </p>
                            <p className="font-geist mt-2 m-0 text-[15px] text-ink-text">{journey.notes}</p>
                        </div>
                    ) : null}

                    <h2 className="font-fragment mt-10 m-0 text-[24px] font-400 tracking-[0.25px] text-ink-text">
                        What’s included
                    </h2>
                    <ul className="mt-4 m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
                        {INCLUDED.slice(0, 6).map((item) => (
                            <li key={item.label} className="flex items-start gap-3">
                                <IncludedIcon />
                                <div>
                                    <p className="font-geist m-0 text-[15px] font-500 text-ink-text">{item.label}</p>
                                    <p className="font-geist mt-0.5 m-0 text-[13px] text-muted">{item.body}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {journey.status === 'upcoming' ? (
                        <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
                            {journey.chauffeur ? (
                                <button
                                    type="button"
                                    onClick={() => setContactOpen(true)}
                                    className="font-geist cursor-pointer rounded-full bg-wine-700 px-4 py-2.5 text-[14px] font-500 text-white"
                                >
                                    Contact chauffeur
                                </button>
                            ) : null}
                            {(journey.actions || []).includes('cancel') ? (
                                <button
                                    type="button"
                                    onClick={() => setCancelOpen(true)}
                                    className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2.5 text-[14px] font-500 text-ink-text"
                                >
                                    Cancel
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>

            <ContactSheet
                open={contactOpen}
                onClose={() => setContactOpen(false)}
                chauffeur={journey.chauffeur}
                bookingNumber={journey.booking_number}
            />
            <CancelReasonModal
                open={cancelOpen}
                title="Cancel this trip"
                busy={cancelBusy}
                onClose={() => {
                    if (!cancelBusy) setCancelOpen(false);
                }}
                onConfirm={async (payload) => {
                    setCancelBusy(true);
                    try {
                        const booked = await cancelBooking(journey.id, payload);
                        setJourney(bookingToJourney(booked));
                        setCancelOpen(false);
                    } finally {
                        setCancelBusy(false);
                    }
                }}
            />
        </SiteLayout>
    );
}
