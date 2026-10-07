import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
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
import useChauffeurOfferPresence from '../hooks/useChauffeurOfferPresence';
import WalletHistory from '../components/wallet/WalletHistory';

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
    const { t } = useTranslation('chauffeur');
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
                    {t('blocked.title')}
                </h2>
                <p className="font-geist mt-2 m-0 text-[15px] leading-6 text-muted">
                    {message || t('blocked.message')}
                </p>
                <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2 text-[14px] font-500 text-ink-text"
                    >
                        {t('actions.close')}
                    </button>
                    <Link
                        to="/chauffeur/current"
                        className="font-geist rounded-full bg-wine-700 px-4 py-2 text-[14px] font-500 text-white no-underline"
                    >
                        {t('actions.viewCurrentTrip')}
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

function ProfilePanel({ profile, error, rides, onLogout, loggingOut }) {
    const { t } = useTranslation('chauffeur');

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
                                    {t('profile.tripsMeta', {
                                        rating: Number(profile.rating || 0).toFixed(2),
                                        count: profile.trips || 0,
                                    })}
                                    {profile.member_since
                                        ? ` · ${t('profile.partnerSince', { year: profile.member_since })}`
                                        : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-geist inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-[13px] font-500 text-white">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                {profile.status_label || t('current.statusActive')}
                            </span>
                            {onLogout ? (
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    disabled={loggingOut}
                                    className="font-geist inline-flex cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] bg-white px-4 py-2 text-[13px] font-500 text-ink-text transition hover:bg-page disabled:opacity-60"
                                >
                                    {loggingOut ? t('actions.signingOut') : t('actions.logOut')}
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                {t('profile.email')}
                            </p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.email || '—'}</p>
                        </div>
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                {t('profile.phone')}
                            </p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.phone || '—'}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                {t('profile.address')}
                            </p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.address || '—'}</p>
                        </div>
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">
                                {t('profile.thisWeek')}
                            </p>
                            <p className="font-geist mt-1 m-0 text-[15px] font-500 text-ink-text">
                                {formatPayout(profile.earnings_week, profile.currency)}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                    <h3 className="font-fragment m-0 text-[22px] font-400 text-ink-text">{t('profile.vehicle')}</h3>
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
                        <p className="font-geist mt-3 m-0 text-[15px] text-muted">{t('profile.noVehicle')}</p>
                    )}

                    <h3 className="font-fragment mt-8 m-0 text-[22px] font-400 text-ink-text">{t('profile.documents')}</h3>
                    {(profile.documents || []).length === 0 ? (
                        <p className="font-geist mt-3 m-0 text-[15px] text-muted">{t('profile.noDocuments')}</p>
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

            <section className="rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                <h3 className="font-fragment m-0 text-[22px] font-400 text-ink-text">{t('profile.wallet')}</h3>
                <p className="font-geist mt-1 m-0 text-[14px] text-muted">{t('profile.walletBalanceHint')}</p>
                <div className="mt-4">
                    <WalletHistory showBalance helperText={t('profile.walletHelper')} />
                </div>
            </section>

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
    const { t } = useTranslation('chauffeur');
    const { tab: tabParam } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const baseId = useId();
    const [loggingOut, setLoggingOut] = useState(false);

    const TABS = useMemo(
        () => [
            {
                id: 'offers',
                label: t('tabs.offers'),
                path: '/chauffeur',
                emptyTitle: t('empty.offersTitle'),
                emptyBody: t('empty.offersBody'),
            },
            {
                id: 'current',
                label: t('tabs.current'),
                path: '/chauffeur/current',
                emptyTitle: '',
                emptyBody: '',
            },
            {
                id: 'rides',
                label: t('tabs.rides'),
                path: '/chauffeur/rides',
                emptyTitle: t('empty.ridesTitle'),
                emptyBody: t('empty.ridesBody'),
            },
            {
                id: 'profile',
                label: t('tabs.profile'),
                path: '/chauffeur/profile',
                emptyTitle: '',
                emptyBody: '',
            },
        ],
        [t],
    );

    const blockedMessage = t('blocked.message');

    const onLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch {
            navigate('/login', { replace: true });
        } finally {
            setLoggingOut(false);
        }
    };
    const [query, setQuery] = useState('');
    const [offers, setOffers] = useState([]);
    const [offersMeta, setOffersMeta] = useState(null);
    const [offersReady, setOffersReady] = useState(false);
    const [offersError, setOffersError] = useState('');
    const [offersBlocked, setOffersBlocked] = useState('');
    const [tripDialogDismissed, setTripDialogDismissed] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profileReady, setProfileReady] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [currentRide, setCurrentRide] = useState(null);
    const [ridesReady, setRidesReady] = useState(false);
    const [deviceFix, setDeviceFix] = useState(null);
    const locationTrip = useMemo(() => {
        if (!currentRide?.booking_id) return null;
        return {
            bookingId: currentRide.booking_id,
            pickup: { lat: currentRide.lat, lng: currentRide.lng },
            dropoff: { lat: currentRide.drop_lat, lng: currentRide.drop_lng },
            onFix: setDeviceFix,
        };
    }, [currentRide?.booking_id, currentRide?.lat, currentRide?.lng, currentRide?.drop_lat, currentRide?.drop_lng]);
    useChauffeurLocation(locationTrip);
    useEffect(() => {
        setDeviceFix(null);
    }, [currentRide?.booking_id]);
    const [toast, setToast] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const activeTab = useMemo(() => {
        if (tabParam === 'current') return TABS[1];
        if (tabParam === 'rides') return TABS[2];
        if (tabParam === 'profile') return TABS[3];
        return TABS[0];
    }, [tabParam, TABS]);

    // Presence GPS while idle so offers are filtered to nearest pickups.
    useChauffeurOfferPresence(!currentRide);

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
            setToast(
                t('toasts.accepted', { label: offer.mode_label || t('toasts.acceptedFallback') }),
            );
        } catch (error) {
            const message = error.response?.data?.message || t('toasts.acceptError');
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
                setOffersMeta(fresh.meta || null);
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
            setToast(t('toasts.declined'));
        } catch {
            const fresh = await listChauffeurOffers(payoutQuery(filters)).catch(() => null);
            if (fresh) setOffers(fresh.data || []);
            if (fresh) setOffersMeta(fresh.meta || null);
            setToast(t('toasts.declineError'));
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
                        setOffersMeta(res.meta || null);
                        setOffersBlocked(res.blocked ? (res.message || blockedMessage) : '');
                        setOffersError('');
                    }
                })
                .catch((err) => {
                    if (!cancelled) {
                        setOffers([]);
                        setOffersMeta(null);
                        setOffersError(err?.response?.data?.message || t('errors.loadOffers'));
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
    }, [filters, blockedMessage, t]);

    useEffect(() => {
        let cancelled = false;

        const loadOffers = () => {
            listChauffeurOffers(payoutQuery(filtersRef.current))
                .then((res) => {
                    if (!cancelled) {
                        setOffers(res.data || []);
                        setOffersMeta(res.meta || null);
                        setOffersBlocked(res.blocked ? (res.message || blockedMessage) : '');
                        setOffersError('');
                    }
                })
                .catch((err) => {
                    if (!cancelled) {
                        setOffers([]);
                        setOffersMeta(null);
                        setOffersError(err?.response?.data?.message || t('errors.loadOffers'));
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
                    setProfileError(err?.response?.data?.message || t('errors.loadProfile'));
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
    }, [user?.chauffeur_id, blockedMessage, t]);

    const listCount =
        activeTab.id === 'offers' ? filteredOffers.length : activeTab.id === 'rides' ? filteredRides.length : null;

    const mobileTitle =
        activeTab.id === 'offers'
            ? t('title.offersWithCount', { count: filteredOffers.length })
            : activeTab.id === 'current'
              ? t('title.current')
              : activeTab.id === 'rides'
                ? t('title.ridesWithCount', { count: filteredRides.length })
                : t('title.profile');

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
                                aria-label={t('actions.filterOffers')}
                                className="absolute right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-ink-text shadow-sm ring-1 ring-black/5 transition"
                            >
                                <FilterIcon />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onLogout}
                                disabled={loggingOut}
                                className="font-geist absolute right-0 cursor-pointer rounded-full border border-[#d8d8dc] bg-white px-3 py-2 text-[13px] font-500 text-ink-text shadow-sm disabled:opacity-60"
                            >
                                {loggingOut ? '…' : t('actions.logOut')}
                            </button>
                        )}
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
                                {t('header.eyebrow')}
                            </p>
                            <h1 className="font-fragment m-0 mt-1 text-[40px] leading-[48px] font-400 tracking-[0.25px] text-ink-text">
                                {t('header.title')}
                            </h1>
                            <p className="font-geist mt-1 m-0 text-[15px] text-muted">
                                {t('header.subtitle')}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onLogout}
                            disabled={loggingOut}
                            className="font-geist inline-flex cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] bg-white px-4 py-2 text-[14px] font-500 text-ink-text transition hover:bg-page disabled:opacity-60"
                        >
                            {loggingOut ? t('actions.signingOut') : t('actions.logOut')}
                        </button>
                        {activeTab.id === 'profile' ? (
                            <div className="rounded-2xl border border-[#e8e6e1] bg-white px-4 py-3 text-right">
                                <p className="font-geist m-0 text-[12px] text-muted">{t('profile.thisWeek')}</p>
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
                                    {currentRide
                                        ? currentRide.status_label || t('current.active')
                                        : t('current.none')}
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
                                        aria-label={t('actions.search')}
                                    >
                                        <SearchIcon />
                                    </button>
                                    <input
                                        id={`${baseId}-search`}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value.slice(0, 150))}
                                        maxLength={150}
                                        aria-label={t('actions.searchAria')}
                                        placeholder={t('actions.searchPlaceholder')}
                                        className="font-geist min-w-0 flex-1 border-0 bg-transparent py-2 pr-3 text-[16px] leading-6 text-ink-text outline-none placeholder:text-muted"
                                    />
                                </div>
                            </form>
                        )}
                        </div>
                    </div>

                    <div className="mt-4 lg:mt-10">
                        {/* Desktop top tabs */}
                        <div
                            role="tablist"
                            aria-label={t('tabs.aria')}
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
                                <ProfilePanel
                                    profile={profile}
                                    error={profileError}
                                    rides={rides}
                                    onLogout={onLogout}
                                    loggingOut={loggingOut}
                                />
                            ) : activeTab.id === 'current' ? (
                                !ridesReady ? (
                                    <Skeleton variant="live" />
                                ) : (
                                <CurrentRidePanel
                                    ride={
                                        currentRide && deviceFix
                                            ? { ...currentRide, car_lat: deviceFix.lat, car_lng: deviceFix.lng }
                                            : currentRide
                                    }
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
                                                    setOffersMeta(res.meta || null);
                                                    setOffersBlocked(res.blocked ? (res.message || blockedMessage) : '');
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
                                        title={t('empty.oneTripTitle')}
                                        body={offersBlocked || blockedMessage}
                                    />
                                ) : filteredOffers.length === 0 ? (
                                    <EmptyState
                                        title={
                                            offersError
                                                ? t('empty.loadOffers')
                                                : offersBlocked
                                                  ? t('empty.oneTripTitle')
                                                  : offersMeta?.location_required && !offersMeta?.location_fresh
                                                    ? t('empty.locationNeeded')
                                                    : activeTab.emptyTitle
                                        }
                                        body={
                                            offersError ||
                                            offersBlocked ||
                                            offersMeta?.message ||
                                            activeTab.emptyBody
                                        }
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
                                <EmptyState title={t('empty.loadRides')} body={profileError} />
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
                                {activeTab.id === 'offers'
                                    ? t('list.offers', { count: listCount })
                                    : t('list.rides', { count: listCount })}
                                {q ? ` ${t('list.matching', { query: query.trim() })}` : ''}
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
