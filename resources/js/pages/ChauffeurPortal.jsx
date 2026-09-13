import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import { ChauffeurOfferCard, ChauffeurRideCard, RideHistorySection } from '../components/chauffeur/ChauffeurCards';
import ChauffeurBottomNav from '../components/chauffeur/ChauffeurBottomNav';
import CurrentRidePanel from '../components/chauffeur/CurrentRidePanel';
import MobileOfferCard from '../components/chauffeur/MobileOfferCard';
import OffersFilterBar, { DEFAULT_FILTERS, PAYOUT_CEILING, payoutQuery } from '../components/chauffeur/OffersFilterBar';
import { formatPayout } from '../data/chauffeurPortal';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import {
    acceptChauffeurOffer,
    listChauffeurOffers,
    listChauffeurRides,
    getChauffeurProfile,
    rejectChauffeurOffer,
} from '../api/bookings';
import { subscribePrivate } from '../echo';
import useChauffeurLocation from '../hooks/useChauffeurLocation';

const TABS = [
    {
        id: 'offers',
        label: 'Offers',
        path: '/chauffeur',
        emptyTitle: 'No offers right now',
        emptyBody: 'New ride offers will appear here when passengers book nearby.',
    },
    {
        id: 'current',
        label: 'Current ride',
        path: '/chauffeur/current',
        emptyTitle: '',
        emptyBody: '',
    },
    {
        id: 'rides',
        label: 'Rides',
        path: '/chauffeur/rides',
        emptyTitle: 'No rides yet',
        emptyBody: 'Accepted and completed rides will show up in this list.',
    },
    {
        id: 'profile',
        label: 'Profile',
        path: '/chauffeur/profile',
        emptyTitle: '',
        emptyBody: '',
    },
];

function SearchIcon() {
    return (
        <svg width="20" height="1.5em" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" aria-hidden="true">
            <path d="M17 17L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function FilterIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4 7h16M7 12h10M10 17h4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function AssignedTripDialog({ open, message, onClose }) {
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
                    {message || 'Finish or cancel your current trip before taking another.'}
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
                        to="/chauffeur/current"
                        className="font-geist rounded-full bg-wine-700 px-4 py-2 text-[14px] font-500 text-white no-underline"
                    >
                        View current trip
                    </Link>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ title, body }) {
    return (
        <div className="flex w-full flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                <SearchIcon />
            </div>
            <p className="font-fragment mt-5 m-0 text-[20px] leading-7 tracking-[0.25px] text-ink-text sm:text-[22px]">
                {title}
            </p>
            <p className="font-geist mt-2 m-0 max-w-md text-[15px] leading-6 text-muted sm:text-[16px]">{body}</p>
        </div>
    );
}

function ProfilePanel({ profile, error, rides }) {
    if (error && !profile) {
        return <p className="font-geist m-0 text-[15px] text-muted">{error}</p>;
    }
    if (!profile) {
        return <Skeleton variant="profile" />;
    }

    const initials =
        (profile.name || '?')
            .split(' ')
            .map((part) => part[0])
            .join('')
            .replace(/[^A-Za-z]/g, '')
            .slice(0, 2)
            .toUpperCase() || 'C';
    const vehicleBits = [profile.vehicle?.class, profile.vehicle?.color, profile.vehicle?.year].filter(Boolean);

    return (
        <div className="flex flex-col gap-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <section className="rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-wine-700 text-[20px] font-600 text-white">
                                {initials}
                            </div>
                            <div>
                                <h2 className="font-fragment m-0 text-[26px] font-400 text-ink-text">{profile.name}</h2>
                                <p className="font-geist mt-1 m-0 text-[14px] text-muted">
                                    ★ {Number(profile.rating || 0).toFixed(2)} · {profile.trips || 0} trips
                                    {profile.member_since ? ` · Partner since ${profile.member_since}` : ''}
                                </p>
                            </div>
                        </div>
                        <span className="font-geist inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-[13px] font-500 text-white">
                            <span className="h-2 w-2 rounded-full bg-white" />
                            {profile.status_label || 'Active'}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">Email</p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.email || '—'}</p>
                        </div>
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">Phone</p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.phone || '—'}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">Address</p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.address || '—'}</p>
                        </div>
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                This week
                            </p>
                            <p className="font-geist mt-1 m-0 text-[15px] font-500 text-ink-text">
                                {formatPayout(profile.earnings_week, profile.currency)}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                    <h3 className="font-fragment m-0 text-[22px] font-400 text-ink-text">Vehicle</h3>
                    {profile.vehicle ? (
                        <>
                            <p className="font-geist mt-3 m-0 text-[18px] font-500 text-ink-text">{profile.vehicle.model}</p>
                            {vehicleBits.length ? (
                                <p className="font-geist mt-1 m-0 text-[14px] text-muted">{vehicleBits.join(' · ')}</p>
                            ) : null}
                            {profile.vehicle.plate ? (
                                <p className="font-geist mt-4 m-0 inline-flex rounded-lg bg-page px-3 py-2 text-[14px] font-500 text-ink-text">
                                    {profile.vehicle.plate}
                                </p>
                            ) : null}
                        </>
                    ) : (
                        <p className="font-geist mt-3 m-0 text-[15px] text-muted">No vehicle assigned yet.</p>
                    )}

                    <h3 className="font-fragment mt-8 m-0 text-[22px] font-400 text-ink-text">Documents</h3>
                    {(profile.documents || []).length === 0 ? (
                        <p className="font-geist mt-3 m-0 text-[15px] text-muted">No documents on file.</p>
                    ) : (
                        <ul className="mt-3 m-0 list-none space-y-2 p-0">
                            {profile.documents.map((doc) => (
                                <li
                                    key={doc.id}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-[#f0eee9] px-3 py-3"
                                >
                                    <span className="font-geist text-[14px] text-ink-text">
                                        {doc.label}
                                        {doc.number ? ` · ${doc.number}` : ''}
                                    </span>
                                    <span className="font-geist rounded-full bg-page px-2.5 py-1 text-[12px] font-500 text-ink-text">
                                        {doc.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <RideHistorySection rides={rides} currency={profile.currency} />
        </div>
    );
}
function assignmentToRide(row) {
    if (!row) return null;

    const numberOrNull = (value) => (value == null || value === '' || Number.isNaN(Number(value)) ? null : Number(value));

    return {
        ...row,
        id: row.id || row.assignment_id,
        lat: numberOrNull(row.lat),
        lng: numberOrNull(row.lng),
        drop_lat: numberOrNull(row.drop_lat),
        drop_lng: numberOrNull(row.drop_lng),
        car_lat: numberOrNull(row.car_lat),
        car_lng: numberOrNull(row.car_lng),
        progress: numberOrNull(row.progress),
        eta_minutes: numberOrNull(row.eta_minutes),
    };
}

/**
 * Chauffeur partner portal — Offers / Current / Rides / Profile.
 * Mobile: bottom nav + slide-to-accept offer cards. Desktop: top tabs.
 */
export default function ChauffeurPortal() {
    const { tab: tabParam } = useParams();
    const { user } = useAuth();
    const baseId = useId();
    const [query, setQuery] = useState('');
    const [offers, setOffers] = useState([]);
    const [offersReady, setOffersReady] = useState(false);
    const [offersError, setOffersError] = useState('');
    const [offersBlocked, setOffersBlocked] = useState('');
    const [tripDialogDismissed, setTripDialogDismissed] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profileReady, setProfileReady] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [currentRide, setCurrentRide] = useState(null);
    const [ridesReady, setRidesReady] = useState(false);
    useChauffeurLocation(currentRide?.booking_id || null);
    const [toast, setToast] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const activeTab = useMemo(() => {
        if (tabParam === 'current') return TABS[1];
        if (tabParam === 'rides') return TABS[2];
        if (tabParam === 'profile') return TABS[3];
        return TABS[0];
    }, [tabParam]);

    const q = query.trim().toLowerCase();
    const rides = profile?.rides || [];

    const filteredOffers = useMemo(() => {
        return offers.filter((o) => {
            if (!q) return true;
            return [o.booking_id, o.booking_number, o.pickup, o.dropoff, o.mode_label, o.passenger_name, o.vehicle_class, o.flight]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q);
        });
    }, [offers, q]);

    const filteredRides = useMemo(() => {
        if (!q) return rides;
        return rides.filter((r) =>
            [r.booking_id, r.booking_number, r.pickup, r.dropoff, r.passenger_name, r.mode_label]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q),
        );
    }, [rides, q]);

    const tabCounts = {
        offers: filteredOffers.length,
        current: currentRide ? 1 : 0,
        rides: filteredRides.length,
        profile: null,
    };

    const assignedTrip = Boolean(currentRide) || Boolean(offersBlocked);
    const tripDialogOpen = activeTab.id === 'offers' && assignedTrip && !tripDialogDismissed;

    useEffect(() => {
        if (!assignedTrip) setTripDialogDismissed(false);
    }, [assignedTrip]);

    if (tabParam && !['rides', 'profile', 'offers', 'current'].includes(tabParam)) {
        return <Navigate to="/chauffeur" replace />;
    }

    const acceptOffer = async (offer) => {
        try {
            await acceptChauffeurOffer(offer.id);
            setOffers((list) => list.filter((item) => item.id !== offer.id));
            const ridesRes = await listChauffeurRides();
            const next = (ridesRes.data || [])[0];
            setCurrentRide(next ? assignmentToRide(next) : null);
            const nextProfile = await getChauffeurProfile().catch(() => null);
            if (nextProfile) setProfile(nextProfile);
            setToast(`Offer accepted · ${offer.mode_label || 'ride'}`);
        } catch (error) {
            const message = error.response?.data?.message || 'Could not accept this offer.';
            if (error.response?.status === 409) {
                setOffers([]);
                setOffersBlocked(message);
                setOffersReady(true);
                setTripDialogDismissed(false);
            }
            setToast(message);
            const fresh = await listChauffeurOffers(payoutQuery(filters)).catch(() => null);
            if (fresh) {
                setOffers(fresh.data || []);
                setOffersBlocked(fresh.blocked ? (fresh.message || message) : '');
            }
            throw error;
        }
        window.setTimeout(() => setToast(''), 2400);
    };

    const declineOffer = async (offer) => {
        setOffers((list) => list.filter((item) => item.id !== offer.id));
        try {
            await rejectChauffeurOffer(offer.id);
            setToast('Offer declined');
        } catch {
            const fresh = await listChauffeurOffers(payoutQuery(filters)).catch(() => null);
            if (fresh) setOffers(fresh.data || []);
            setToast('Could not decline this offer.');
        }
        window.setTimeout(() => setToast(''), 2000);
    };

    const filtersRef = useRef(filters);
    const currentRideRef = useRef(null);
    filtersRef.current = filters;
    currentRideRef.current = currentRide;

    useEffect(() => {
        let cancelled = false;
        const timer = window.setTimeout(() => {
            listChauffeurOffers(payoutQuery(filters))
                .then((res) => {
                    if (!cancelled) {
                        setOffers(res.data || []);
                        setOffersBlocked(res.blocked ? (res.message || 'Finish or cancel your current trip before taking another.') : '');
                        setOffersError('');
                    }
                })
                .catch((err) => {
                    if (!cancelled) {
                        setOffers([]);
                        setOffersError(err?.response?.data?.message || 'Could not load offers.');
                    }
                })
                .finally(() => {
                    if (!cancelled) setOffersReady(true);
                });
        }, 200);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [filters]);

    useEffect(() => {
        let cancelled = false;

        const loadOffers = () => {
            listChauffeurOffers(payoutQuery(filtersRef.current))
                .then((res) => {
                    if (!cancelled) {
                        setOffers(res.data || []);
                        setOffersBlocked(res.blocked ? (res.message || 'Finish or cancel your current trip before taking another.') : '');
                        setOffersError('');
                    }
                })
                .catch((err) => {
                    if (!cancelled) {
                        setOffers([]);
                        setOffersError(err?.response?.data?.message || 'Could not load offers.');
                    }
                })
                .finally(() => {
                    if (!cancelled) setOffersReady(true);
                });
        };

        const loadProfile = () => {
            getChauffeurProfile()
                .then((next) => {
                    if (cancelled) return;
                    setProfile(next);
                    setProfileError('');
                })
                .catch((err) => {
                    if (cancelled) return;
                    setProfileError(err?.response?.data?.message || 'Could not load profile.');
                })
                .finally(() => {
                    if (!cancelled) setProfileReady(true);
                });
        };

        const loadRides = () => {
            listChauffeurRides()
                .then((res) => {
                    if (cancelled) return;
                    const next = (res.data || [])[0];
                    setCurrentRide(next ? assignmentToRide(next) : null);
                })
                .catch(() => {
                    if (!cancelled) setCurrentRide(null);
                })
                .finally(() => {
                    if (!cancelled) setRidesReady(true);
                });
        };

        loadOffers();
        loadRides();
        loadProfile();

        if (!user?.chauffeur_id) {
            return () => {
                cancelled = true;
            };
        }

        const leave = subscribePrivate(
            `chauffeur.${user.chauffeur_id}`,
            {
                OfferAvailable: (payload) => {
                    if (currentRideRef.current) return;
                    const offer = payload?.offer;
                    if (!offer?.id) return;
                    const current = filtersRef.current;
                    const amount = Number(offer.payout);
                    if (Number.isFinite(amount)) {
                        if (amount < current.minPayout) return;
                        if (current.maxPayout < PAYOUT_CEILING && amount > current.maxPayout) return;
                    }
                    setOffers((list) => (list.some((item) => item.id === offer.id) ? list : [offer, ...list]));
                },
                OfferWithdrawn: (payload) => {
                    const offerId = payload?.offer_id;
                    if (!offerId) return;
                    setOffers((list) => list.filter((item) => item.id !== offerId));
                },
                RideUpdated: (payload) => {
                    const ride = payload?.ride;
                    if (!ride?.id) return;
                    const active = ['assigned', 'en_route', 'arrived', 'in_progress'].includes(ride.status);
                    setCurrentRide((current) => {
                        if (active) return assignmentToRide(ride);
                        return current?.id === ride.id ? null : current;
                    });
                    loadProfile();
                    if (!active) loadOffers();
                },
            },
            () => {
                loadOffers();
                loadRides();
                loadProfile();
            },
        );

        return () => {
            cancelled = true;
            leave();
        };
    }, [user?.chauffeur_id]);

    const listCount =
        activeTab.id === 'offers' ? filteredOffers.length : activeTab.id === 'rides' ? filteredRides.length : null;

    const mobileTitle =
        activeTab.id === 'offers'
            ? `Offers (${filteredOffers.length})`
            : activeTab.id === 'current'
              ? 'Current ride'
              : activeTab.id === 'rides'
                ? `Rides (${filteredRides.length})`
                : 'Profile';

    return (
        <SiteLayout showFooter={false}>
            <div className="min-h-[100dvh] bg-page pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:min-h-[calc(100dvh-80px)] lg:pt-[104px] lg:pb-16">
                <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-14">
                    {/* Mobile app header */}
                    <div className="relative flex items-center justify-center pt-[max(1rem,env(safe-area-inset-top))] pb-2 lg:hidden">
                        <h1 className="font-fragment m-0 text-center text-[28px] leading-9 font-400 tracking-[0.2px] text-ink-text">
                            {mobileTitle}
                        </h1>
                        {activeTab.id === 'offers' ? (
                            <button
                                type="button"
                                onClick={() => setFilterOpen(true)}
                                aria-expanded={filterOpen}
                                aria-label="Filter offers"
                                className="absolute right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-ink-text shadow-sm ring-1 ring-black/5 transition"
                            >
                                <FilterIcon />
                            </button>
                        ) : null}
                    </div>

                    <OffersFilterBar
                        open={activeTab.id === 'offers' && filterOpen}
                        onClose={() => setFilterOpen(false)}
                        filters={filters}
                        onChange={setFilters}
                        onReset={() => setFilters(DEFAULT_FILTERS)}
                        resultCount={filteredOffers.length}
                        currency={offers[0]?.currency || ''}
                    />

                    {/* Desktop header */}
                    <div className="hidden flex-col gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-[0.08em] text-wine-700 uppercase">
                                Partner portal
                            </p>
                            <h1 className="font-fragment m-0 mt-1 text-[40px] leading-[48px] font-400 tracking-[0.25px] text-ink-text">
                                Chauffeur
                            </h1>
                            <p className="font-geist mt-1 m-0 text-[15px] text-muted">
                                Review offers, manage rides, and keep your profile ready.
                            </p>
                        </div>

                        {activeTab.id === 'profile' ? (
                            <div className="rounded-2xl border border-[#e8e6e1] bg-white px-4 py-3 text-right">
                                <p className="font-geist m-0 text-[12px] text-muted">This week</p>
                                <p className="font-geist m-0 text-[20px] font-600 text-ink-text">
                                    {formatPayout(profile?.earnings_week ?? 0, profile?.currency || '')}
                                </p>
                            </div>
                        ) : activeTab.id === 'current' ? (
                            ridesReady ? (
                            <div className="inline-flex items-center gap-2 rounded-full border border-wine-700/20 bg-wine-50 px-4 py-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine-700 opacity-50" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-wine-700" />
                                </span>
                                <span className="font-geist text-[13px] font-500 text-wine-700">
                                    {currentRide ? currentRide.status_label || 'Active ride' : 'No active ride'}
                                </span>
                            </div>
                            ) : null
                        ) : (
                            <form
                                className="w-full max-w-[480px] flex-1"
                                onSubmit={(e) => e.preventDefault()}
                                role="search"
                            >
                                <div className="flex w-full items-center gap-1 rounded-lg border border-[#d8d8dc] bg-white px-2 py-1.5 transition focus-within:border-wine-700">
                                    <button
                                        type="submit"
                                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-text hover:bg-page"
                                        aria-label="Search"
                                    >
                                        <SearchIcon />
                                    </button>
                                    <input
                                        id={`${baseId}-search`}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value.slice(0, 150))}
                                        maxLength={150}
                                        aria-label="Search offers or rides"
                                        placeholder="Search by location, passenger, or booking"
                                        className="font-geist min-w-0 flex-1 border-0 bg-transparent py-2 pr-3 text-[16px] leading-6 text-ink-text outline-none placeholder:text-muted"
                                    />
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="mt-4 lg:mt-10">
                        {/* Desktop top tabs */}
                        <div
                            role="tablist"
                            aria-label="Chauffeur portal"
                            className="hidden w-full gap-0 overflow-x-auto border-b border-[#e0ddd6] lg:flex"
                        >
                            {TABS.map((tab) => {
                                const selected = tab.id === activeTab.id;
                                const n = tabCounts[tab.id];
                                return (
                                    <Link
                                        key={tab.id}
                                        id={`${baseId}-tab-${tab.id}`}
                                        role="tab"
                                        aria-selected={selected}
                                        aria-controls={`${baseId}-panel-${tab.id}`}
                                        tabIndex={selected ? 0 : -1}
                                        to={tab.path}
                                        className={`font-geist relative -mb-px inline-flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-5 py-3 text-[16px] font-500 transition ${
                                            selected
                                                ? 'border-wine-700 text-ink-text'
                                                : 'border-transparent text-muted hover:text-ink-text'
                                        }`}
                                    >
                                        {tab.label}
                                        {n != null ? (
                                            <span
                                                className={`rounded-full px-1.5 py-0.5 text-[11px] font-600 tabular-nums ${
                                                    selected
                                                        ? 'bg-wine-50 text-wine-700'
                                                        : 'bg-[#f0eee9] text-muted'
                                                }`}
                                            >
                                                {n}
                                            </span>
                                        ) : null}
                                    </Link>
                                );
                            })}
                        </div>

                        <div
                            id={`${baseId}-panel-${activeTab.id}`}
                            role="tabpanel"
                            aria-labelledby={`${baseId}-tab-${activeTab.id}`}
                            className="w-full pt-3 lg:pt-6"
                        >
                            {activeTab.id === 'profile' ? (
                                <ProfilePanel profile={profile} error={profileError} rides={rides} />
                            ) : activeTab.id === 'current' ? (
                                !ridesReady ? (
                                    <Skeleton variant="live" />
                                ) : (
                                <CurrentRidePanel
                                    ride={currentRide}
                                    onUpdated={(ride) => {
                                        const active = ride && ['assigned', 'en_route', 'arrived', 'in_progress'].includes(ride.status);
                                        setCurrentRide(active ? assignmentToRide(ride) : null);
                                        getChauffeurProfile()
                                            .then((next) => {
                                                setProfile(next);
                                                setProfileError('');
                                            })
                                            .catch(() => {});
                                        if (!active) {
                                            listChauffeurOffers(payoutQuery(filters))
                                                .then((res) => {
                                                    setOffers(res.data || []);
                                                    setOffersBlocked(res.blocked ? (res.message || 'Finish or cancel your current trip before taking another.') : '');
                                                    setOffersError('');
                                                })
                                                .catch(() => {});
                                        }
                                    }}
                                />
                                )
                            ) : activeTab.id === 'offers' ? (
                                !offersReady && !assignedTrip ? (
                                    <Skeleton variant="list" />
                                ) : assignedTrip ? (
                                    <EmptyState
                                        title="One trip at a time"
                                        body={offersBlocked || 'Finish or cancel your current trip before taking another.'}
                                    />
                                ) : filteredOffers.length === 0 ? (
                                    <EmptyState
                                        title={offersError ? 'Could not load offers' : offersBlocked ? 'One trip at a time' : activeTab.emptyTitle}
                                        body={offersError || offersBlocked || activeTab.emptyBody}
                                    />
                                ) : (
                                    <>
                                        <ul className="m-0 flex list-none flex-col gap-4 p-0 lg:hidden">
                                            {filteredOffers.map((offer) => (
                                                <li key={offer.id}>
                                                    <MobileOfferCard offer={offer} onAccept={acceptOffer} />
                                                </li>
                                            ))}
                                        </ul>
                                        <ul className="m-0 hidden list-none flex-col gap-5 p-0 lg:flex">
                                            {filteredOffers.map((offer) => (
                                                <li key={offer.id}>
                                                    <ChauffeurOfferCard
                                                        offer={offer}
                                                        onAccept={acceptOffer}
                                                        onDecline={declineOffer}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )
                            ) : !profileReady ? (
                                <Skeleton variant="list" />
                            ) : profileError && !profile ? (
                                <EmptyState title="Could not load rides" body={profileError} />
                            ) : filteredRides.length === 0 ? (
                                <EmptyState title={activeTab.emptyTitle} body={activeTab.emptyBody} />
                            ) : (
                                <ul className="m-0 flex list-none flex-col gap-4 p-0 sm:gap-5">
                                    {filteredRides.map((ride) => (
                                        <li key={ride.id}>
                                            <ChauffeurRideCard ride={ride} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {listCount != null ? (
                            <p className="font-geist mt-5 m-0 hidden text-[15px] text-muted lg:block">
                                {listCount} {listCount === 1 ? activeTab.label.slice(0, -1) : activeTab.label}
                                {q ? ` matching "${query.trim()}"` : ''}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>

            <ChauffeurBottomNav tabs={TABS} activeId={activeTab.id} counts={tabCounts} />

            <AssignedTripDialog
                open={tripDialogOpen}
                message={offersBlocked}
                onClose={() => setTripDialogDismissed(true)}
            />

            {toast ? (
                <div className="fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[120] flex justify-center px-4 lg:bottom-6">
                    <p className="font-geist m-0 rounded-full bg-ink px-4 py-2.5 text-[14px] font-500 text-white shadow-lg">
                        {toast}
                    </p>
                </div>
            ) : null}
        </SiteLayout>
    );
}
