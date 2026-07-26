import { useId, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import { ChauffeurOfferCard, ChauffeurRideCard, RideHistorySection } from '../components/chauffeur/ChauffeurCards';
import ChauffeurBottomNav from '../components/chauffeur/ChauffeurBottomNav';
import CurrentRidePanel from '../components/chauffeur/CurrentRidePanel';
import MobileOfferCard from '../components/chauffeur/MobileOfferCard';
import OffersFilterBar, { DEFAULT_FILTERS } from '../components/chauffeur/OffersFilterBar';
import {
    CHAUFFEUR_CURRENT_RIDE,
    CHAUFFEUR_OFFERS,
    CHAUFFEUR_PROFILE,
    CHAUFFEUR_RIDES,
    formatPayout,
} from '../data/chauffeurPortal';

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

function ProfilePanel({ profile, online, setOnline, rides }) {
    return (
        <div className="flex flex-col gap-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <section className="rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-wine-700 text-[20px] font-600 text-white">
                                {profile.name
                                    .split(' ')
                                    .map((p) => p[0])
                                    .join('')
                                    .slice(0, 2)}
                            </div>
                            <div>
                                <h2 className="font-fragment m-0 text-[26px] font-400 text-ink-text">{profile.name}</h2>
                                <p className="font-geist mt-1 m-0 text-[14px] text-muted">
                                    ★ {profile.rating} · {profile.trips} trips · Partner since {profile.member_since}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOnline((v) => !v)}
                            className={`font-geist inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[13px] font-500 transition ${
                                online
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'border border-[#d8d8dc] bg-white text-ink-text'
                            }`}
                        >
                            <span className={`h-2 w-2 rounded-full ${online ? 'bg-white' : 'bg-[#9a9a9a]'}`} />
                            {online ? 'Online' : 'Offline'}
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">Email</p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.email}</p>
                        </div>
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">Phone</p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.phone}</p>
                        </div>
                        <div>
                            <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-muted uppercase">City</p>
                            <p className="font-geist mt-1 m-0 text-[15px] text-ink-text">{profile.city}</p>
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
                    <p className="font-geist mt-3 m-0 text-[18px] font-500 text-ink-text">{profile.vehicle.model}</p>
                    <p className="font-geist mt-1 m-0 text-[14px] text-muted">
                        {profile.vehicle.class} · {profile.vehicle.color} · {profile.vehicle.year}
                    </p>
                    <p className="font-geist mt-4 m-0 inline-flex rounded-lg bg-page px-3 py-2 text-[14px] font-500 text-ink-text">
                        {profile.vehicle.plate}
                    </p>

                    <h3 className="font-fragment mt-8 m-0 text-[22px] font-400 text-ink-text">Documents</h3>
                    <ul className="mt-3 m-0 list-none space-y-2 p-0">
                        {profile.documents.map((doc) => (
                            <li
                                key={doc.id}
                                className="flex items-center justify-between gap-3 rounded-xl border border-[#f0eee9] px-3 py-3"
                            >
                                <span className="font-geist text-[14px] text-ink-text">{doc.label}</span>
                                <span className="font-geist rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-500 text-emerald-700">
                                    {doc.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <RideHistorySection rides={rides} currency={profile.currency} />
        </div>
    );
}

/**
 * Chauffeur partner portal — Offers / Current / Rides / Profile.
 * Mobile: bottom nav + slide-to-accept offer cards. Desktop: top tabs.
 */
export default function ChauffeurPortal() {
    const { tab: tabParam } = useParams();
    const baseId = useId();
    const [query, setQuery] = useState('');
    const [offers, setOffers] = useState(CHAUFFEUR_OFFERS);
    const [rides] = useState(CHAUFFEUR_RIDES);
    const [currentRide, setCurrentRide] = useState(CHAUFFEUR_CURRENT_RIDE);
    const [online, setOnline] = useState(true);
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

    const filteredOffers = useMemo(() => {
        return offers.filter((o) => {
            if (filters.classFilter === 'business' && !/business/i.test(o.vehicle_class || '')) return false;
            if (filters.classFilter === 'first' && !/first/i.test(o.vehicle_class || '')) return false;
            if (filters.service !== 'all' && o.mode !== filters.service) return false;
            if (filters.when !== 'all' && o.when !== filters.when) return false;
            const payout = Number(o.payout) || 0;
            if (payout < filters.minPayout || payout > filters.maxPayout) return false;
            const dist = Number(o.distance_km);
            if (Number.isFinite(dist) && dist > filters.radiusKm) return false;
            if (!q) return true;
            return [o.pickup, o.dropoff, o.mode_label, o.passenger_name, o.vehicle_class, o.flight]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q);
        });
    }, [offers, q, filters]);

    const filteredRides = useMemo(() => {
        if (!q) return rides;
        return rides.filter((r) =>
            [r.pickup, r.dropoff, r.booking_number, r.passenger_name, r.mode_label]
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

    if (tabParam && !['rides', 'profile', 'offers', 'current'].includes(tabParam)) {
        return <Navigate to="/chauffeur" replace />;
    }

    const acceptOffer = (offer) => {
        setOffers((list) => list.filter((o) => o.id !== offer.id));
        setToast(`Offer accepted · ${offer.mode_label}`);
        window.setTimeout(() => setToast(''), 2400);
    };

    const declineOffer = (offer) => {
        setOffers((list) => list.filter((o) => o.id !== offer.id));
        setToast('Offer declined');
        window.setTimeout(() => setToast(''), 2000);
    };

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
                                    {formatPayout(CHAUFFEUR_PROFILE.earnings_week, CHAUFFEUR_PROFILE.currency)}
                                </p>
                            </div>
                        ) : activeTab.id === 'current' ? (
                            <div className="inline-flex items-center gap-2 rounded-full border border-wine-700/20 bg-wine-50 px-4 py-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wine-700 opacity-50" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-wine-700" />
                                </span>
                                <span className="font-geist text-[13px] font-500 text-wine-700">
                                    {currentRide ? 'Live · on the way' : 'No active ride'}
                                </span>
                            </div>
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
                                <ProfilePanel
                                    profile={CHAUFFEUR_PROFILE}
                                    online={online}
                                    setOnline={setOnline}
                                    rides={rides}
                                />
                            ) : activeTab.id === 'current' ? (
                                <CurrentRidePanel
                                    ride={currentRide}
                                    onComplete={() => setCurrentRide(null)}
                                    onRestartDemo={() => setCurrentRide(CHAUFFEUR_CURRENT_RIDE)}
                                />
                            ) : activeTab.id === 'offers' ? (
                                filteredOffers.length === 0 ? (
                                    <EmptyState title={activeTab.emptyTitle} body={activeTab.emptyBody} />
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
                                {q ? ` matching “${query.trim()}”` : ''}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>

            <ChauffeurBottomNav tabs={TABS} activeId={activeTab.id} counts={tabCounts} />

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
