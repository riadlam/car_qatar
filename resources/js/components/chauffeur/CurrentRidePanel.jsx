import { useMemo, useState } from 'react';
import TripLiveMap from '../journeys/TripLiveMap';
import { formatPayout } from '../../data/chauffeurPortal';

function PhoneIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M8.5 3.5h2.2l1.1 3.3-1.7 1.2a12.5 12.5 0 0 0 5.4 5.4l1.2-1.7 3.3 1.1v2.2c0 .9-.7 1.7-1.6 1.9-1.7.4-5.1.3-8.5-3.1S5.1 8.3 5.5 6.6c.2-.9 1-1.6 1.9-1.6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function NavIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 3.5 20 19.5l-8-3.2-8 3.2L12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/**
 * Active ride demo — live map + passenger / destination panel.
 * Car animates along the OSRM route toward drop-off.
 */
export default function CurrentRidePanel({ ride, onComplete, onRestartDemo }) {
    const [progress, setProgress] = useState(0.28);
    const [toast, setToast] = useState('');

    const onCarProgress = useMemo(
        () => (p) => {
            setProgress(p);
        },
        [],
    );

    if (!ride) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e8e6e1] bg-white px-6 py-20 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                    <NavIcon />
                </div>
                <p className="font-fragment mt-5 m-0 text-[22px] text-ink-text">No ride in progress</p>
                <p className="font-geist mt-2 m-0 max-w-md text-[15px] text-muted">
                    When you start a trip, live navigation and passenger details will appear here.
                </p>
                {onRestartDemo ? (
                    <button
                        type="button"
                        onClick={onRestartDemo}
                        className="font-geist mt-6 cursor-pointer rounded-full bg-wine-700 px-5 py-2.5 text-[14px] font-500 text-white transition hover:bg-wine-600"
                    >
                        Restart demo ride
                    </button>
                ) : null}
            </div>
        );
    }

    const etaMins = Math.max(1, Math.round((1 - progress) * (ride.eta_minutes || 28)));
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${ride.lat},${ride.lng}&destination=${ride.drop_lat},${ride.drop_lng}&travelmode=driving`;

    const flash = (msg) => {
        setToast(msg);
        window.setTimeout(() => setToast(''), 2200);
    };

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:gap-6">
            <div className="relative min-w-0 overflow-hidden rounded-2xl border border-[#e5e3df] bg-[#e8e6e1]">
                <div className="relative aspect-[16/12] w-full sm:aspect-[21/12] lg:aspect-auto lg:min-h-[480px] lg:h-full">
                    <TripLiveMap
                        pickupLabel={ride.pickup}
                        dropoffLabel={ride.dropoff}
                        lat={ride.lat}
                        lng={ride.lng}
                        dropLat={ride.drop_lat}
                        dropLng={ride.drop_lng}
                        showCar
                        onCarProgress={onCarProgress}
                        carLoopMs={ride.car_loop_ms || 52000}
                        className="absolute inset-0 h-full w-full"
                    />
                </div>

                <div className="absolute inset-x-3 top-3 z-[5] flex max-w-lg items-center justify-between gap-3 rounded-xl border border-white/70 bg-white/95 px-3 py-2.5 shadow-md backdrop-blur sm:inset-x-4">
                    <div className="min-w-0">
                        <p className="font-geist m-0 text-[11px] font-600 tracking-wide text-wine-700 uppercase">
                            On the way · demo
                        </p>
                        <p className="font-geist m-0 mt-0.5 truncate text-[14px] font-500 text-ink-text">
                            En route to drop-off · {etaMins} min
                        </p>
                    </div>
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine-700 opacity-55" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-wine-700" />
                    </span>
                </div>

                <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[5] sm:inset-x-4">
                    <div className="overflow-hidden rounded-full bg-white/90 shadow-sm backdrop-blur">
                        <div
                            className="h-1.5 rounded-full bg-wine-700 transition-[width] duration-300 ease-out"
                            style={{ width: `${Math.min(100, Math.max(4, progress * 100))}%` }}
                        />
                    </div>
                </div>
            </div>

            <aside className="flex flex-col gap-4">
                <section className="rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                Current ride
                            </p>
                            <h2 className="font-fragment mt-1 m-0 text-[24px] font-400 text-ink-text">
                                {ride.mode_label}
                            </h2>
                            <p className="font-geist mt-1 m-0 text-[14px] text-muted">{ride.booking_number}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-geist m-0 text-[12px] text-muted uppercase">Payout</p>
                            <p className="font-geist m-0 text-[22px] font-600 tabular-nums text-ink-text">
                                {formatPayout(ride.payout, ride.currency)}
                            </p>
                        </div>
                    </div>

                    <ol className="mt-6 m-0 list-none space-y-0 p-0">
                        <li className="flex gap-3">
                            <div className="flex flex-col items-center pt-0.5">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-wine-700 text-[11px] font-700 text-wine-700">
                                    A
                                </span>
                                <span className="my-1 w-px min-h-[28px] flex-1 bg-wine-700/25" />
                            </div>
                            <div className="min-w-0 pb-4">
                                <p className="font-geist m-0 text-[12px] text-muted">Pickup · done</p>
                                <p className="font-geist mt-0.5 m-0 text-[15px] font-500 text-ink-text">{ride.pickup}</p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wine-700 text-[11px] font-700 text-white">
                                B
                            </span>
                            <div className="min-w-0">
                                <p className="font-geist m-0 text-[12px] text-wine-700 font-500">
                                    Drop-off · {etaMins} min
                                </p>
                                <p className="font-geist mt-0.5 m-0 text-[15px] font-500 text-ink-text">{ride.dropoff}</p>
                                {ride.flight ? (
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">Flight {ride.flight}</p>
                                ) : null}
                            </div>
                        </li>
                    </ol>
                </section>

                <section className="rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                    <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">Passenger</p>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-page text-[15px] font-600 text-ink-text">
                            {(ride.passenger_name || '?')
                                .split(' ')
                                .map((p) => p[0])
                                .join('')
                                .replace(/[^A-Za-z]/g, '')
                                .slice(0, 2)
                                .toUpperCase() || 'P'}
                        </div>
                        <div className="min-w-0">
                            <p className="font-geist m-0 text-[16px] font-500 text-ink-text">{ride.passenger_name}</p>
                            <p className="font-geist mt-0.5 m-0 text-[13px] text-muted">
                                {ride.passenger_phone || 'In-app contact'}
                                {ride.notes ? ` · ${ride.notes}` : ''}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-wine-700 px-4 text-[14px] font-500 text-white transition hover:bg-wine-600"
                        >
                            <NavIcon />
                            Navigate
                        </a>
                        <a
                            href={ride.passenger_phone ? `tel:${ride.passenger_phone.replace(/\s/g, '')}` : '#'}
                            onClick={(e) => {
                                if (!ride.passenger_phone) {
                                    e.preventDefault();
                                    flash('Demo · passenger notified');
                                }
                            }}
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#d8d8dc] bg-white px-4 text-[14px] font-500 text-ink-text transition hover:border-wine-700"
                        >
                            <PhoneIcon />
                            Call passenger
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            flash('Ride completed');
                            window.setTimeout(() => onComplete?.(), 600);
                        }}
                        className="font-geist mt-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full border border-wine-700/30 bg-wine-50 px-4 text-[14px] font-500 text-wine-700 transition hover:bg-wine-100"
                    >
                        Complete ride
                    </button>
                </section>

                <section className="rounded-2xl border border-[#e8e6e1] bg-page px-5 py-4">
                    <p className="font-geist m-0 text-[13px] leading-5 text-muted">
                        <span className="font-500 text-ink-text">Vehicle</span>
                        {' · '}
                        {ride.vehicle_label}
                        {ride.plate ? ` · ${ride.plate}` : ''}
                    </p>
                </section>
            </aside>

            {toast ? (
                <div className="fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4 lg:pointer-events-none">
                    <p className="font-geist m-0 rounded-full bg-ink px-4 py-2.5 text-[14px] font-500 text-white shadow-lg">
                        {toast}
                    </p>
                </div>
            ) : null}
        </div>
    );
}
