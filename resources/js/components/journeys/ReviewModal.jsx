import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

function StarButton({ value, filled, onSelect, label }) {
    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            aria-label={label}
            aria-pressed={filled}
            className={`font-geist flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[28px] leading-none transition ${
                filled ? 'text-wine-700' : 'text-[#d8d4cc] hover:text-wine-700/50'
            }`}
        >
            ★
        </button>
    );
}

/**
 * Post-trip review — stars required, comment optional. Skip allowed.
 */
export default function ReviewModal({ open, chauffeurName, onClose, onSubmit, busy = false }) {
    const { t } = useTranslation('journeys');
    const baseId = useId();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) return;
        setRating(0);
        setComment('');
        setError('');
    }, [open]);

    if (!open) return null;

    const canSubmit = rating >= 1 && rating <= 5 && !busy;

    const submit = async () => {
        if (!canSubmit) return;
        setError('');
        try {
            await onSubmit({ rating, comment: comment.trim() || null });
        } catch (err) {
            setError(
                err?.response?.data?.errors?.rating?.[0] ||
                    err?.response?.data?.errors?.comment?.[0] ||
                    err?.response?.data?.errors?.booking?.[0] ||
                    err?.response?.data?.message ||
                    t('review.submitError'),
            );
        }
    };

    return (
        <div
            className="fixed inset-0 z-[210] flex items-end justify-center bg-ink/45 p-4 sm:items-center"
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${baseId}-title`}
                className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6"
            >
                <h2 id={`${baseId}-title`} className="font-fragment m-0 text-[24px] font-400 text-ink-text">
                    {t('review.title')}
                </h2>
                <p className="font-geist mt-2 m-0 text-[15px] leading-6 text-muted">
                    {chauffeurName
                        ? t('review.subtitleNamed', { name: chauffeurName })
                        : t('review.subtitle')}
                </p>

                <div className="mt-5 flex items-center justify-center gap-1" role="group" aria-label={t('review.starsAria')}>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <StarButton
                            key={n}
                            value={n}
                            filled={n <= rating}
                            onSelect={setRating}
                            label={t('review.starLabel', { count: n })}
                        />
                    ))}
                </div>

                <label className="mt-5 block" htmlFor={`${baseId}-comment`}>
                    <span className="font-geist text-[13px] font-500 text-muted">{t('review.commentLabel')}</span>
                    <textarea
                        id={`${baseId}-comment`}
                        value={comment}
                        onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                        maxLength={1000}
                        rows={3}
                        placeholder={t('review.commentPlaceholder')}
                        className="font-geist mt-1.5 w-full resize-none rounded-xl border border-[#e8e6e1] bg-white px-3 py-2.5 text-[15px] text-ink-text outline-none placeholder:text-muted focus:border-wine-700"
                    />
                </label>

                {error ? <p className="font-geist mt-3 m-0 text-[14px] text-wine-700">{error}</p> : null}

                <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2 text-[14px] font-500 text-ink-text disabled:opacity-60"
                    >
                        {t('review.skip')}
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!canSubmit}
                        className="font-geist cursor-pointer rounded-full bg-wine-700 px-4 py-2 text-[14px] font-500 text-white disabled:opacity-60"
                    >
                        {busy ? t('review.submitting') : t('review.submit')}
                    </button>
                </div>
            </div>
        </div>
    );
}
