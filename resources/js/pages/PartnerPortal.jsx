import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SiteLayout from '../components/landing/SiteLayout';
import { useAuth } from '../context/AuthContext';
import {
    fetchPartnerBookings,
    fetchPartnerEarnings,
    fetchPartnerMe,
    refreshPartnerPaymentLink,
} from '../api/partner';
import { getWallet } from '../api/wallet';
import WalletHistory from '../components/wallet/WalletHistory';
import { formatMoney, normalizeCurrency } from '../utils/currency';

const TAB_IDS = [
    { id: 'overview', path: '/partner' },
    { id: 'book', path: '/partner/book' },
    { id: 'rides', path: '/partner/rides' },
    { id: 'wallet', path: '/partner/wallet' },
    { id: 'earnings', path: '/partner/earnings' },
];

function money(amount, currency = 'QAR') {
    return formatMoney(amount, normalizeCurrency(currency));
}

const BOOKING_STATUS_KEYS = {
    pending_payment: 'rides.status.pendingPayment',
    confirmed: 'rides.status.confirmed',
    completed: 'rides.status.completed',
    cancelled: 'rides.status.cancelled',
};

export default function PartnerPortal() {
    const { t } = useTranslation('partner');
    const { tab } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const TABS = useMemo(
        () =>
            TAB_IDS.map((row) => ({
                ...row,
                label: t(`tabs.${row.id}`),
            })),
        [t],
    );

    const active = TABS.find((row) => row.id === tab) || TABS[0];
    const [me, setMe] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [linkBusy, setLinkBusy] = useState(null);
    const [copied, setCopied] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);

    const statusLabel = useCallback(
        (status) => {
            const key = BOOKING_STATUS_KEYS[status];
            if (key) return t(key);
            return String(status || '')
                .replaceAll('_', ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());
        },
        [t],
    );

    const onLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
        } finally {
            navigate('/login', { replace: true });
            setLoggingOut(false);
        }
    };

    // Load once on mount. Always clear loading (even after StrictMode cleanup) so
    // phones never sit on skeletons forever when a request is cancelled/remounted.
    useEffect(() => {
        let cancelled = false;
        const hardStop = window.setTimeout(() => {
            setLoading(false);
        }, 8000);

        (async () => {
            setLoading(true);
            setError('');
            try {
                const [profileResult, ridesResult, earnResult, walletData] = await Promise.all([
                    fetchPartnerMe()
                        .then((profile) => ({ ok: true, profile }))
                        .catch((err) => ({ ok: false, err })),
                    fetchPartnerBookings(1)
                        .then((rides) => ({ ok: true, rides }))
                        .catch((err) => ({ ok: false, err })),
                    fetchPartnerEarnings()
                        .then((earn) => ({ ok: true, earn }))
                        .catch((err) => ({ ok: false, err })),
                    getWallet().catch(() => null),
                ]);

                if (!cancelled) {
                    if (!profileResult.ok) {
                        throw profileResult.err;
                    }

                    setMe(profileResult.profile);
                    setBookings(ridesResult.ok ? ridesResult.rides?.data || [] : []);
                    setEarnings(earnResult.ok ? earnResult.earn : null);
                    setWallet(walletData);

                    if (!ridesResult.ok || !earnResult.ok) {
                        const fail = !ridesResult.ok ? ridesResult.err : earnResult.err;
                        setError(fail?.response?.data?.message || t('errors.load'));
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.response?.data?.message || t('errors.load'));
                }
            } finally {
                window.clearTimeout(hardStop);
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
            window.clearTimeout(hardStop);
            setLoading(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-once
    }, []);

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
            setError(err?.response?.data?.message || t('errors.refreshLink'));
        } finally {
            setLinkBusy(null);
        }
    };

    const feeOverview =
        me?.commission_type === 'flat'
            ? money(me?.commission_value)
            : `${me?.commission_value}%`;

    return (
        <SiteLayout>
            <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-geist m-0 text-[13px] font-500 tracking-[0.08em] text-muted uppercase">
                            {t('eyebrow')}
                        </p>
                        <h1 className="font-fragment mt-1 m-0 text-[32px] leading-10 font-400 text-ink-text sm:text-[40px] sm:leading-[48px]">
                            {me?.display_name || t('titleFallback')}
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={onLogout}
                            disabled={loggingOut}
                            className="font-geist inline-flex cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] bg-white px-5 py-2.5 text-[15px] font-500 text-ink-text transition hover:bg-[#f7f7f8] disabled:opacity-60"
                        >
                            {loggingOut ? t('actions.signingOut') : t('actions.logOut')}
                        </button>
                        <Link
                            to="/booking"
                            className="font-geist inline-flex items-center justify-center rounded-full bg-wine-700 px-5 py-2.5 text-[15px] font-500 text-white transition hover:bg-wine-600"
                        >
                            {t('actions.bookForGuest')}
                        </Link>
                    </div>
                </div>

                <nav
                    className="mt-8 flex gap-1 overflow-x-auto border-b border-ink-text/10 pb-px"
                    aria-label={t('sectionsAria')}
                >
                    {TABS.map((row) => {
                        const isActive = row.id === active.id;
                        return (
                            <Link
                                key={row.id}
                                to={row.path}
                                className={`font-geist shrink-0 rounded-t-lg px-4 py-3 text-[15px] transition ${
                                    isActive
                                        ? 'border-b-2 border-wine-700 font-500 text-wine-700'
                                        : 'text-ink-text/70 hover:text-ink-text'
                                }`}
                            >
                                {row.label}
                            </Link>
                        );
                    })}
                </nav>

                {loading ? (
                    <div className="mt-8 space-y-4" role="status" aria-live="polite">
                        <span className="sr-only">Loading</span>
                        <div className="h-28 w-full animate-pulse rounded-2xl bg-[#eceae6]" />
                        <div className="h-48 w-full animate-pulse rounded-2xl bg-[#eceae6]" />
                    </div>
                ) : error && !me ? (
                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5" role="alert">
                        <p className="font-geist m-0 text-red-800">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="font-geist mt-4 cursor-pointer rounded-full border border-red-300 bg-white px-4 py-2 text-[14px] font-500 text-red-900"
                        >
                            {t('actions.retry', { defaultValue: 'Retry' })}
                        </button>
                    </div>
                ) : (
                    <div className="mt-8">
                        {active.id === 'overview' && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5">
                                    <p className="font-geist m-0 text-[13px] text-muted uppercase">{t('overview.wallet')}</p>
                                    <p className="font-fragment mt-2 m-0 text-[28px] text-ink-text">
                                        {money(wallet?.balance ?? 0, wallet?.currency || 'QAR')}
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                        {t('overview.walletHint')}
                                    </p>
                                    <Link
                                        to="/partner/wallet"
                                        className="font-geist mt-3 inline-flex text-[13px] font-500 text-wine-700 underline-offset-2 hover:underline"
                                    >
                                        {t('actions.viewWalletHistory')}
                                    </Link>
                                </div>
                                <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5">
                                    <p className="font-geist m-0 text-[13px] text-muted uppercase">{t('overview.earned')}</p>
                                    <p className="font-fragment mt-2 m-0 text-[28px] text-ink-text">
                                        {money(me?.earned_total)}
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                        {t('overview.earnedHint')}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5">
                                    <p className="font-geist m-0 text-[13px] text-muted uppercase">{t('overview.unpaid')}</p>
                                    <p className="font-fragment mt-2 m-0 text-[28px] text-ink-text">
                                        {money(me?.unpaid_balance)}
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                        {t('overview.unpaidHint')}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5">
                                    <p className="font-geist m-0 text-[13px] text-muted uppercase">
                                        {t('overview.completedRides')}
                                    </p>
                                    <p className="font-fragment mt-2 m-0 text-[28px] text-ink-text">
                                        {me?.completed_rides ?? 0}
                                    </p>
                                    <p className="font-geist mt-1 m-0 text-[13px] text-muted">
                                        {t('overview.fee', { value: feeOverview })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {active.id === 'book' && (
                            <div className="rounded-2xl border border-[#e8e8ea] bg-white p-6 sm:p-8">
                                <h2 className="font-fragment m-0 text-[24px] text-ink-text">{t('book.title')}</h2>
                                <p className="font-geist mt-3 m-0 max-w-xl text-[16px] leading-6 text-ink-text/75">
                                    {t('book.body')}
                                </p>
                                <Link
                                    to="/booking"
                                    className="font-geist mt-6 inline-flex rounded-full bg-wine-700 px-5 py-3 text-[15px] font-500 text-white transition hover:bg-wine-600"
                                >
                                    {t('actions.startBooking')}
                                </Link>
                            </div>
                        )}

                        {active.id === 'rides' && (
                            <div className="space-y-3">
                                {bookings.length === 0 ? (
                                    <p className="font-geist m-0 rounded-2xl border border-dashed border-ink-text/15 p-8 text-center text-ink-text/70">
                                        {t('rides.empty')}
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
                                                        {b.guest?.name || t('rides.guest')}
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
                                                        {t('rides.yourFee', {
                                                            amount: money(b.partner_commission_amount, b.currency),
                                                        })}
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
                                                        ? t('actions.preparing')
                                                        : copied === b.id
                                                          ? t('actions.linkCopied')
                                                          : t('actions.copyLink')}
                                                </button>
                                            ) : null}
                                        </article>
                                    ))
                                )}
                            </div>
                        )}

                        {active.id === 'wallet' && (
                            <div className="rounded-2xl border border-[#e8e8ea] bg-white p-5 sm:p-6">
                                <WalletHistory helperText={t('wallet.helper')} />
                            </div>
                        )}

                        {active.id === 'earnings' && (
                            <div>
                                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl bg-[#f7f7f8] px-4 py-3">
                                        <p className="font-geist m-0 text-[12px] text-muted">{t('earnings.earned')}</p>
                                        <p className="font-geist m-0 text-[18px] font-500">
                                            {money(earnings?.earned_total)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#f7f7f8] px-4 py-3">
                                        <p className="font-geist m-0 text-[12px] text-muted">{t('earnings.paidOut')}</p>
                                        <p className="font-geist m-0 text-[18px] font-500">
                                            {money(earnings?.paid_total)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-[#f7f7f8] px-4 py-3">
                                        <p className="font-geist m-0 text-[12px] text-muted">{t('earnings.balance')}</p>
                                        <p className="font-geist m-0 text-[18px] font-500">
                                            {money(earnings?.unpaid_balance)}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-geist mb-4 m-0 text-[14px] text-muted">
                                    {t('earnings.settlementsNote')}
                                </p>
                                <ul className="m-0 list-none space-y-2 p-0">
                                    {(earnings?.lines || []).length === 0 ? (
                                        <li className="font-geist rounded-2xl border border-dashed border-ink-text/15 p-8 text-center text-ink-text/70">
                                            {t('earnings.empty')}
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
                                                            ? t('earnings.settlementPaid')
                                                            : t('earnings.ride', { number: line.booking_number })}
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
