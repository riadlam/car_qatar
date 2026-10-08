import { useCallback, useEffect, useState } from 'react';
import { getWallet, getWalletTransactions } from '../../api/wallet';
import { formatMoney, normalizeCurrency } from '../../utils/currency';
import Skeleton from '../ui/Skeleton';

function money(amount, currency = 'QAR') {
    return formatMoney(amount, normalizeCurrency(currency));
}

function formatWhen(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString();
}

/**
 * Shared wallet balance + ledger for customers, partners, and chauffeurs.
 */
export default function WalletHistory({
    showBalance = true,
    helperText = 'Only AL MAJD admin can add funds. Credits and trip payments appear below.',
    className = '',
}) {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [meta, setMeta] = useState(null);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const type = filter === 'all' ? undefined : filter;
            const [summary, history] = await Promise.all([
                getWallet(),
                getWalletTransactions({ page, perPage: 15, type }),
            ]);
            setWallet(summary);
            setTransactions(history.transactions || []);
            setMeta(history.meta || null);
        } catch (err) {
            setError(err?.response?.data?.message || 'Could not load wallet history.');
        } finally {
            setLoading(false);
        }
    }, [filter, page]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        setPage(1);
    }, [filter]);

    const currency = wallet?.currency || meta?.currency || 'QAR';
    const balance = wallet?.balance ?? meta?.balance ?? 0;

    return (
        <div className={className}>
            {showBalance ? (
                <div className="rounded-xl border border-[#e8e8ea] bg-[#fafafa] px-4 py-5">
                    <p className="font-geist m-0 text-[13px] font-500 tracking-[0.04em] text-muted uppercase">
                        Available balance
                    </p>
                    <p className="font-fragment mt-2 m-0 text-[32px] leading-10 text-ink-text">
                        {money(balance, currency)}
                    </p>
                    {helperText ? (
                        <p className="font-geist mt-2 m-0 text-[14px] text-muted">{helperText}</p>
                    ) : null}
                </div>
            ) : null}

            <div className={`${showBalance ? 'mt-5' : ''} flex flex-wrap items-center justify-between gap-3`}>
                <h3 className="font-fragment m-0 text-[20px] font-400 text-ink-text">Wallet history</h3>
                <div className="flex gap-1 rounded-full border border-[#e8e8ea] bg-white p-1">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'credit', label: 'Added' },
                        { id: 'debit', label: 'Spent' },
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFilter(opt.id)}
                            className={`font-geist cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-500 transition ${
                                filter === opt.id
                                    ? 'bg-wine-700 text-white'
                                    : 'text-ink-text/70 hover:text-ink-text'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                </div>
            ) : error ? (
                <p className="font-geist mt-4 m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">
                    {error}
                </p>
            ) : transactions.length === 0 ? (
                <p className="font-geist mt-4 m-0 rounded-xl border border-[#e8e8ea] bg-white px-4 py-5 text-[14px] text-muted">
                    No wallet activity yet.
                    {filter === 'credit'
                        ? ' When AL MAJD adds funds, it will show here.'
                        : ''}
                </p>
            ) : (
                <ul className="mt-4 m-0 list-none space-y-0 p-0">
                    {transactions.map((tx) => (
                        <li
                            key={tx.id}
                            className="flex items-center justify-between gap-3 border-b border-[#f3f3f4] py-3.5 last:border-b-0"
                        >
                            <div className="min-w-0">
                                <p className="font-geist m-0 text-[14px] font-500 text-ink-text">
                                    {tx.reason_label || (tx.type === 'credit' ? 'Credit' : 'Debit')}
                                </p>
                                {tx.note ? (
                                    <p className="font-geist mt-0.5 m-0 truncate text-[13px] text-muted">
                                        {tx.note}
                                    </p>
                                ) : null}
                                <p className="font-geist mt-0.5 m-0 text-[12px] text-muted">
                                    {formatWhen(tx.created_at)}
                                    {tx.balance_after != null
                                        ? ` · Balance ${money(tx.balance_after, tx.currency || currency)}`
                                        : ''}
                                </p>
                            </div>
                            <p
                                className={`font-geist m-0 shrink-0 text-[15px] font-500 ${
                                    tx.type === 'credit' ? 'text-emerald-700' : 'text-ink-text'
                                }`}
                            >
                                {tx.type === 'credit' ? '+' : '−'}
                                {money(tx.amount, tx.currency || currency)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            {meta && meta.last_page > 1 ? (
                <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2 text-[13px] font-500 disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <p className="font-geist m-0 text-[13px] text-muted">
                        Page {meta.current_page} of {meta.last_page}
                    </p>
                    <button
                        type="button"
                        disabled={page >= meta.last_page || loading}
                        onClick={() => setPage((p) => p + 1)}
                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2 text-[13px] font-500 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            ) : null}
        </div>
    );
}
