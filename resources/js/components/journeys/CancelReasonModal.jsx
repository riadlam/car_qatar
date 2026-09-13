import { useEffect, useId, useState } from 'react';
import { listCancellationReasons } from '../../api/bookings';

/**
 * Cancel modal. Reasons come from the signed-in role only. Other is a typed note.
 */
export default function CancelReasonModal({ open, title, onClose, onConfirm, busy = false }) {
    const baseId = useId();
    const [reasons, setReasons] = useState([]);
    const [loadError, setLoadError] = useState('');
    const [selected, setSelected] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) return undefined;
        let cancelled = false;
        setSelected('');
        setNote('');
        setError('');
        setLoadError('');
        listCancellationReasons()
            .then((rows) => {
                if (!cancelled) setReasons(rows);
            })
            .catch(() => {
                if (!cancelled) setLoadError('Could not load cancel reasons.');
            });
        return () => {
            cancelled = true;
        };
    }, [open]);

    if (!open) return null;

    const other = selected === 'other';
    const canSubmit = selected && (!other || note.trim().length >= 3) && !busy;

    const submit = async () => {
        if (!canSubmit) return;
        setError('');
        try {
            await onConfirm(other ? { note: note.trim() } : { reason_id: Number(selected) });
        } catch (err) {
            setError(
                err?.response?.data?.errors?.reason?.[0]
                    || err?.response?.data?.errors?.reason_id?.[0]
                    || err?.response?.data?.errors?.note?.[0]
                    || err?.response?.data?.message
                    || 'Could not cancel.',
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/40 p-4 sm:items-center" role="presentation">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${baseId}-title`}
                className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6"
            >
                <h2 id={`${baseId}-title`} className="font-fragment m-0 text-[24px] font-400 text-ink-text">
                    {title}
                </h2>
                <p className="font-geist mt-1 m-0 text-[14px] text-muted">
                    Choose a reason. Other is sent as you type it.
                </p>

                {loadError ? <p className="font-geist mt-4 m-0 text-[14px] text-wine-700">{loadError}</p> : null}

                <fieldset className="mt-4 m-0 space-y-2 border-0 p-0">
                    <legend className="sr-only">Cancel reason</legend>
                    {reasons.map((reason) => (
                        <label
                            key={reason.id}
                            className="font-geist flex cursor-pointer items-start gap-3 rounded-xl border border-[#e8e6e1] px-3 py-3 text-[15px] text-ink-text"
                        >
                            <input
                                type="radio"
                                name={`${baseId}-reason`}
                                value={reason.id}
                                checked={selected === String(reason.id)}
                                onChange={() => setSelected(String(reason.id))}
                                className="mt-1"
                            />
                            <span>{reason.label}</span>
                        </label>
                    ))}
                    <label className="font-geist flex cursor-pointer items-start gap-3 rounded-xl border border-[#e8e6e1] px-3 py-3 text-[15px] text-ink-text">
                        <input
                            type="radio"
                            name={`${baseId}-reason`}
                            value="other"
                            checked={other}
                            onChange={() => setSelected('other')}
                            className="mt-1"
                        />
                        <span>Other</span>
                    </label>
                </fieldset>

                {other ? (
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value.slice(0, 500))}
                        maxLength={500}
                        rows={3}
                        placeholder="Tell the other person why"
                        className="font-geist mt-3 w-full rounded-xl border border-[#d8d8dc] px-3 py-2 text-[15px] text-ink-text outline-none focus:border-wine-700"
                    />
                ) : null}

                {error ? <p className="font-geist mt-3 m-0 text-[13px] text-wine-700">{error}</p> : null}

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2 text-[14px] font-500 text-ink-text"
                    >
                        Keep trip
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!canSubmit}
                        className="font-geist cursor-pointer rounded-full bg-wine-700 px-4 py-2 text-[14px] font-500 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {busy ? 'Cancelling…' : 'Cancel trip'}
                    </button>
                </div>
            </div>
        </div>
    );
}
