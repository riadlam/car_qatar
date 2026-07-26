import { useEffect, useId, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import JourneyCard from '../components/journeys/JourneyCard';
import { useAuth } from '../context/AuthContext';
import { getAllJourneys } from '../data/journeys';

const TABS = [
    {
        id: 'upcoming',
        label: 'Upcoming',
        path: '/journeys',
        emptyTitle: 'No upcoming bookings yet',
        emptyBody: 'Your bookings will appear here once you schedule a journey.',
    },
    {
        id: 'past',
        label: 'Past',
        path: '/journeys/past',
        emptyTitle: 'No past bookings yet',
        emptyBody: 'Completed journeys will show up here.',
    },
    {
        id: 'cancelled',
        label: 'Canceled',
        path: '/journeys/cancelled',
        emptyTitle: 'No canceled bookings',
        emptyBody: 'Canceled journeys will appear in this list.',
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

function EmptyPin() {
    return (
        <img
            src="/images/journeys-empty.png"
            alt=""
            width={77}
            height={80}
            className="object-contain"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
        />
    );
}

function EmptyPinFallback() {
    return (
        <svg
            width="77"
            height="80"
            viewBox="0 0 77 80"
            fill="none"
            aria-hidden="true"
            className="hidden text-wine-700"
        >
            <path
                d="M38.5 6C26.074 6 16 16.074 16 28.5C16 42.25 32.2 61.4 36.9 66.6a2.2 2.2 0 0 0 3.2 0C44.8 61.4 61 42.25 61 28.5 61 16.074 50.926 6 38.5 6Z"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle cx="38.5" cy="28.5" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M33 48h11M38.5 44.5v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function EmptyState({ title, body }) {
    return (
        <div className="flex w-full flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
            <div className="flex flex-col items-center gap-5">
                <EmptyPin />
                <EmptyPinFallback />
                <div>
                    <p className="font-fragment m-0 text-[20px] leading-7 tracking-[0.25px] text-ink-text sm:text-[22px]">
                        {title}
                    </p>
                    <p className="font-geist mt-2 m-0 text-[15px] leading-6 text-muted sm:text-[16px]">{body}</p>
                    <Link
                        to="/booking"
                        className="font-geist mt-5 inline-flex cursor-pointer rounded-full bg-wine-700 px-5 py-2.5 text-[14px] font-500 text-white transition hover:bg-wine-600"
                    >
                        Book a journey
                    </Link>
                </div>
            </div>
        </div>
    );
}

function matchesTab(j, tabId) {
    const status = j.status || 'upcoming';
    if (tabId === 'upcoming') return status === 'upcoming';
    if (tabId === 'past') return status === 'past';
    if (tabId === 'cancelled') return status === 'cancelled' || status === 'canceled';
    return false;
}

function matchesQuery(j, q) {
    if (!q) return true;
    const hay = [
        j.booking_number,
        j.pickup,
        j.dropoff,
        j.passenger_name,
        j.vehicle,
        j.flight,
        j.mode_label,
        j.status_label,
        j.chauffeur?.name,
        j.notes,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return hay.includes(q);
}

/**
 * Journeys — list bookings by Upcoming / Past / Canceled.
 * Routes: /journeys, /journeys/past, /journeys/cancelled
 */
export default function Journeys() {
    const { tab: tabParam } = useParams();
    const navigate = useNavigate();
    const { loading, isAuthenticated, setReturnTo } = useAuth();
    const baseId = useId();
    const [query, setQuery] = useState('');
    const [journeys, setJourneys] = useState([]);

    const activeTab = useMemo(() => {
        if (tabParam === 'past') return TABS[1];
        if (tabParam === 'cancelled' || tabParam === 'canceled') return TABS[2];
        return TABS[0];
    }, [tabParam]);

    const q = query.trim().toLowerCase();

    const tabCounts = useMemo(() => {
        const counts = { upcoming: 0, past: 0, cancelled: 0 };
        journeys.forEach((j) => {
            if (!matchesQuery(j, q)) return;
            if (matchesTab(j, 'upcoming')) counts.upcoming += 1;
            if (matchesTab(j, 'past')) counts.past += 1;
            if (matchesTab(j, 'cancelled')) counts.cancelled += 1;
        });
        return counts;
    }, [journeys, q]);

    const filtered = useMemo(
        () => journeys.filter((j) => matchesTab(j, activeTab.id) && matchesQuery(j, q)),
        [journeys, activeTab.id, q],
    );

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            const from = `/journeys${tabParam ? `/${tabParam}` : ''}`;
            setReturnTo(from);
            navigate(`/login?from=${encodeURIComponent(from)}`, { replace: true });
        }
    }, [loading, isAuthenticated, navigate, setReturnTo, tabParam]);

    useEffect(() => {
        setJourneys(getAllJourneys());
    }, []);

    if (tabParam && !['past', 'cancelled', 'canceled'].includes(tabParam)) {
        return <Navigate to="/journeys" replace />;
    }

    if (loading || !isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-page text-ink-text">
                Loading...
            </div>
        );
    }

    const count = filtered.length;

    return (
        <SiteLayout showFooter={false}>
            <div className="min-h-[calc(100dvh-80px)] bg-page pt-[88px] pb-12 lg:pt-[104px] lg:pb-16">
                <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-14">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                        <div>
                            <h1 className="font-fragment m-0 shrink-0 text-[32px] leading-10 font-400 tracking-[0.25px] text-ink-text sm:text-[40px] sm:leading-[48px]">
                                Journeys
                            </h1>
                            <p className="font-geist mt-1 m-0 hidden text-[15px] text-muted sm:block">
                                Track upcoming rides, past trips, and cancellations in one place.
                            </p>
                        </div>

                        <form
                            className="w-full sm:max-w-[420px] sm:flex-1 lg:max-w-[480px]"
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
                                    aria-label="Search by booking number, location, or name"
                                    placeholder="Search by booking number, location, or name"
                                    className="font-geist min-w-0 flex-1 border-0 bg-transparent py-2 pr-3 text-[15px] leading-6 text-ink-text outline-none placeholder:text-muted sm:text-[16px]"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 lg:mt-10">
                        <div
                            role="tablist"
                            aria-label="Ride list filter"
                            className="flex w-full gap-0 overflow-x-auto border-b border-[#e0ddd6]"
                        >
                            {TABS.map((tab) => {
                                const selected = tab.id === activeTab.id;
                                const n = tabCounts[tab.id] ?? 0;
                                return (
                                    <Link
                                        key={tab.id}
                                        id={`${baseId}-tab-${tab.id}`}
                                        role="tab"
                                        aria-selected={selected}
                                        aria-controls={`${baseId}-panel-${tab.id}`}
                                        tabIndex={selected ? 0 : -1}
                                        to={tab.path}
                                        className={`font-geist relative -mb-px inline-flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-[15px] font-500 transition sm:px-5 sm:text-[16px] ${
                                            selected
                                                ? 'border-wine-700 text-ink-text'
                                                : 'border-transparent text-muted hover:text-ink-text'
                                        }`}
                                    >
                                        {tab.label}
                                        <span
                                            className={`rounded-full px-1.5 py-0.5 text-[11px] font-600 tabular-nums ${
                                                selected
                                                    ? 'bg-wine-50 text-wine-700'
                                                    : 'bg-[#f0eee9] text-muted'
                                            }`}
                                        >
                                            {n}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div
                            id={`${baseId}-panel-${activeTab.id}`}
                            role="tabpanel"
                            aria-labelledby={`${baseId}-tab-${activeTab.id}`}
                            className="w-full pt-5 sm:pt-6"
                        >
                            {count === 0 ? (
                                <EmptyState title={activeTab.emptyTitle} body={activeTab.emptyBody} />
                            ) : (
                                <ul className="m-0 flex w-full list-none flex-col gap-4 p-0 sm:gap-5">
                                    {filtered.map((j) => (
                                        <li key={j.id} className="w-full">
                                            <JourneyCard journey={j} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <p className="font-geist mt-5 m-0 text-[14px] text-muted sm:text-[15px]">
                            {count} {count === 1 ? 'Booking' : 'Bookings'}
                            {q ? ` matching “${query.trim()}”` : ''}
                        </p>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
