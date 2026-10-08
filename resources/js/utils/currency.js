/** Site-wide currency — Qatari Riyal */
export const DEFAULT_CURRENCY = 'QAR';

/**
 * Normalize API / legacy codes to the display code used across the SPA.
 * Maps USD / US$ / $ → QAR so leftover dollar data still renders as QAR.
 */
export function normalizeCurrency(currency) {
    const raw = String(currency || '').trim();
    if (!raw || raw === 'USD' || raw === 'US$' || raw === '$') {
        return DEFAULT_CURRENCY;
    }
    return raw.toUpperCase() === 'USD' ? DEFAULT_CURRENCY : raw;
}

export function formatMoney(amount, currency = DEFAULT_CURRENCY) {
    const n = Number(amount);
    if (!Number.isFinite(n)) return '—';
    return `${normalizeCurrency(currency)} ${n.toFixed(2)}`;
}
