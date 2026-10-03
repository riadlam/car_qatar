import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import {
    fetchPartnerBookings,
    fetchPartnerEarnings,
    fetchPartnerMe,
    refreshPartnerPaymentLink,
} from '../api/partner';
import { getWallet } from '../api/wallet';
import WalletHistory from '../components/wallet/WalletHistory';

const TABS = [
    { id: 'overview', label: 'Overview', path: '/partner' },
    { id: 'book', label: 'Book a ride', path: '/partner/book' },
    { id: 'rides', label: 'Rides', path: '/partner/rides' },
    { id: 'wallet', label: 'Wallet', path: '/partner/wallet' },
    { id: 'earnings', label: 'Earnings', path: '/partner/earnings' },
];

function money(amount, currency = 'QAR') {
    const n = Number(amount);
    if (Number.isNaN(n)) return '—';
    return `${currency} ${n.toFixed(2)}`;
}

function statusLabel(status) {
    return String(status || '')
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PartnerPortal() {
    const { tab } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const active = TABS.find((t) => t.id === tab) || TABS[0];
    const [me, setMe] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [linkBusy, setLinkBusy] = useState(null);
    const [copied, setCopied] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);

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

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [profile, rides, earn, walletData] = await Promise.all([
                fetchPartnerMe(),
                fetchPartnerBookings(1),
                fetchPartnerEarnings(),
                getWallet().catch(() => null),
            ]);
            setMe(profile);
            setBookings(rides.data || []);
            setEarnings(earn);
            setWallet(walletData);
        } catch (err) {
            setError(err?.response?.data?.message || 'Could not load partner portal.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const onCopyLink = async (booking) => {
        setLinkBusy(booking.id);
        try {
            let url = booking.payment_link?.url;
            if (!url) {
                const refreshed = await refreshPartnerPaymentLink(booking.id);
                url = refreshed.url;
                setBookings((rows) =>
                    rows.map((r) =>
                        r.id === booking.id
                            ? { ...r, payment_link: { url: refreshed.url, expires_at: refreshed.expires_at } }
                            : r,
                    ),
                );
            }
            await navigator.clipboard.writeText(url);
            setCopied(booking.id);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            setError(err?.response?.data?.message || 'Could not refresh payment link.');
        } finally {
            setLinkBusy(null);
        }
    };

    return (
        <SiteLayout>
            <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-geist m-0 text-[13px] font-500 tracking-[0.08em] text-muted uppercase">
                            Partner portal
                        </p>
                        <h1 className="font-fragment mt-1 m-0 text-[32px] leading-10 font-400 text-ink-text sm:text-[40px] sm:leading-[48px]">
                            {me?.display_name || 'Your partnership'}
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={onLogout}
                            disabled={loggingOut}
                            className="font-geist inline-flex cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] bg-white px-5 py-2.5 text-[15px] font-500 text-ink-text transition hover:bg-[#f7f7f8] disabled:opacity-60"
                        >
                            {loggingOut ? 'Signing out…' : 'Log out'}
                        </button>
                        <Link
                            to="/booking"
                            className="font-geist inline-flex items-center justify-center rounded-full bg-wine-700 px-5 py-2.5 text-[15px] font-500 text-white transition hover:bg-wine-600"
                        >
                            Book for a guest
                        </Link>
                    </div>
                </div>

                <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-ink-text/10 pb-px" aria-label="Partner sections">
                    {TABS.map((t) => {
                        const isActive = t.id === active.id;
                        return (
                            <Link
                                key={t.id}
                                to={t.path}
                                className={`font-geist shrink-0 rounded-t-lg px-4 py-3 text-[15px] transition ${
                                    isActive
                                        ? 'border-b-2 border-wine-700 font-500 text-wine-700'
                                        : 'text-ink-text/70 hover:text-ink-text'
                                }`}
                            >
                                {t.label}
                            </Link>
                        );
                    })}
                </nav>

                {loading ? (
                    <div className="mt-8 space-y-4">
                        <Skeleton className="h-28 w-full rounded-2xl" />
                        <Skeleton className="h-48 w-full rounded-2xl" />
                    </div>
                ) : error ? (
                    <p className="font-geist mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800" role="alert">
                        {error}
                    </p>
                ) : (
                    <div className="mt-8">
                        {active.id === 'overview' && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5">
                                    <p className="font-geist m-0 text-[13px] text-muted uppercase">Wallet</p>
                                    <p className="font-fragment mt-2 m-0 text-[28px] text-ink-text">
                                        {money(wallet?.balance ?? 0, wallet?.currency || 'QAR')}
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                        Use at checkout when balance covers the trip
                                    </p>
                                    <Link
                                        to="/partner/wallet"
                                        className="font-geist mt-3 inline-flex text-[13px] font-500 text-wine-700 underline-offset-2 hover:underline"
                                    >
                                        View wallet history
                                    </Link>
                                </div>
                                <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5">
                                    <p className="font-geist m-0 text-[13px] text-muted uppercase">Earned</p>
                                    <p className="font-fragment mt-2 m-0 text-[28px] text-ink-text">
                                        {money(me?.earned_total)}
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                        Completed rides only
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5">
                                    <p className="font-geist m-0 text-[13px] text-muted uppercase">Unpaid balance</p>
                                    <p className="font-fragment mt-2 m-0 text-[28px] text-ink-text">
                                        {money(me?.unpaid_balance)}
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                        Settled by AL MAJD admin
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5">
                                    <p className="font-geist m-0 text-[13px] text-muted uppercase">Completed rides</p>
                                    <p className="font-fragment mt-2 m-0 text-[28px] text-ink-text">
                                        {me?.completed_rides ?? 0}
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                        Fee:{' '}
                                        {me?.commission_type === 'flat'
                                            ? money(me?.commission_value)
                                            : `${me?.commission_value}%`}
                                    </p>
                                </div>
                            </div>
                        )}

                        {active.id === 'book' && (
                            <div className="rounded-2xl border border-[#e8e8ea] bg-white p-6 sm:p-8">
                                <h2 className="font-fragment m-0 text-[24px] text-ink-text">Book a ride for a guest</h2>
                                <p className="font-geist mt-3 m-0 max-w-xl text-[16px] leading-6 text-ink-text/75">
                                    Use the booking flow, enter the guest&apos;s details (not yourself), and checkout.
                                    You&apos;ll get a secure payment link to share with the guest.
                                </p>
                                <Link
                                    to="/booking"
                                    className="font-geist mt-6 inline-flex rounded-full bg-wine-700 px-5 py-3 text-[15px] font-500 text-white transition hover:bg-wine-600"
                                >
                                    Start booking
                                </Link>
                            </div>
                        )}

                        {active.id === 'rides' && (
                            <div className="space-y-3">
                                {bookings.length === 0 ? (
                                    <p className="font-geist m-0 rounded-2xl border border-dashed border-ink-text/15 p-8 text-center text-ink-text/70">
                                        No partner bookings yet.
                                    </p>
                                ) : (
                                    bookings.map((b) => (
                                        <article
                                            key={b.id}
                                            className="rounded-2xl border border-[#e8e8ea] bg-white p-5"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-geist m-0 text-[13px] text-muted">
                                                        {b.booking_number} · {statusLabel(b.status)}
                                                    </p>
                                                    <p className="font-geist mt-1 m-0 text-[17px] font-500 text-ink-text">
                                                        {b.guest?.name || 'Guest'}
                                                    </p>
                                                    <p className="font-geist mt-1 m-0 text-[14px] text-ink-text/70">
                                                        {b.pickup_at
                                                            ? new Date(b.pickup_at).toLocaleString()
                                                            : '—'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-geist m-0 text-[16px] font-500 text-ink-text">
                                                        {money(b.total_amount, b.currency)}
                                                    </p>
                                                    <p className="font-geist mt-1 m-0 text-[14px] text-wine-700">
                                                        Your fee {money(b.partner_commission_amount, b.currency)}
                                                        {b.partner_commission_status
                                                            ? ` · ${statusLabel(b.partner_commission_status)}`
                                                            : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-geist mt-3 m-0 text-[14px] text-ink-text/75">
                                                {b.pickup || '—'}
                                                {b.dropoff ? ` → ${b.dropoff}` : ''}
                                            </p>
                                            {b.status === 'pending_payment' ? (
                                                <button
                                                    type="button"
                                                    disabled={linkBusy === b.id}
                                                    onClick={() => onCopyLink(b)}
                                                    className="font-geist mt-4 rounded-full border border-ink-text/15 px-4 py-2 text-[14px] font-500 text-ink-text transition hover:bg-black/5 disabled:opacity-60"
                                                >
                                                    {linkBusy === b.id
                                                        ? 'Preparing…'
                                                        : copied === b.id
                                                          ? 'Link copied'
                                                          : 'Copy guest payment link'}
                                                </button>
                                            ) : null}
                                        </article>
                                    ))
                                )}
                            </div>
                        )}

                        {active.id === 'wallet' && (
                            <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5 sm:p-6">
                                <WalletHistory helperText="Funds added by AL MAJD and trip payments from this wallet. Partner commission earnings are tracked separately under Earnings." />
                            </div>
                        )}

                        {active.id === 'earnings' && (
                            <div>
                                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl bg-[#f7f7f8] px-4 py-3">
                                        <p className="font-geist m-0 text-[12px] text-muted">Earned</p>
                                        <p className="font-geist m-0 text-[18px] font-500">
                                            {money(earnings?.earned_total)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#f7f7f8] px-4 py-3">
                                        <p className="font-geist m-0 text-[12px] text-muted">Paid out</p>
                                        <p className="font-geist m-0 text-[18px] font-500">
                                            {money(earnings?.paid_total)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#f7f7f8] px-4 py-3">
                                        <p className="font-geist m-0 text-[12px] text-muted">Balance</p>
                                        <p className="font-geist m-0 text-[18px] font-500">
                                            {money(earnings?.unpaid_balance)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-geist mb-4 m-0 text-[14px] text-muted">
                                    Settlements are processed by AL MAJD — there is no claim button here.
                                </p>
                                <ul className="m-0 list-none space-y-2 p-0">
                                    {(earnings?.lines || []).length === 0 ? (
                                        <li className="font-geist rounded-2xl border border-dashed border-ink-text/15 p-8 text-center text-ink-text/70">
                                            No earnings yet. Fees appear after successful completed rides.
                                        </li>
                                    ) : (
                                        (earnings?.lines || []).map((line, idx) => (
                                            <li
                                                key={`${line.type}-${line.booking_id || line.id}-${idx}`}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-[#e8e8ea] bg-white px-4 py-3"
                                            >
                                                <div>
                                                    <p className="font-geist m-0 text-[15px] font-500 text-ink-text">
                                                        {line.type === 'payout'
                                                            ? 'Settlement paid'
                                                            : `Ride ${line.booking_number}`}
                                                    </p>
                                                    <p className="font-geist mt-0.5 m-0 text-[13px] text-muted">
                                                        {line.guest || line.note || ''}
                                                        {line.at
                                                            ? ` · ${new Date(line.at).toLocaleDateString()}`
                                                            : ''}
                                                    </p>
                                                </div>
                                                <p
                                                    className={`font-geist m-0 text-[15px] font-500 ${
                                                        line.type === 'payout' ? 'text-ink-text/70' : 'text-wine-700'
                                                    }`}
                                                >
                                                    {line.type === 'payout' ? '−' : '+'}
                                                    {money(line.amount, line.currency)}
                                                </p>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
