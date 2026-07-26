import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const fieldClass =
    'font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700';

const DURATION_OPTIONS = [
    { value: '2', label: '2 hours (80 km included)' },
    { value: '3', label: '3 hours (100 km included)' },
    { value: '4', label: '4 hours (120 km included)' },
    { value: '6', label: '6 hours (160 km included)' },
    { value: '8', label: '8 hours (200 km included)' },
    { value: '12', label: '12 hours (250 km included)' },
];

/**
 * Edit trip sheet — same fields as home booking widget (light theme for checkout).
 */
export default function EditTripModal({ open, onClose, initial, onSave }) {
    const [tab, setTab] = useState(initial?.mode === 'transfer' ? 'one_way' : 'by_hour');
    const [pickup, setPickup] = useState(initial?.pickup || '');
    const [dropoff, setDropoff] = useState(initial?.dropoff || '');
    const [duration, setDuration] = useState(initial?.duration || '2');
    const [date, setDate] = useState(initial?.date || '');
    const [time, setTime] = useState(initial?.time || '22:15');

    useEffect(() => {
        if (!open) return;
        setTab(initial?.mode === 'transfer' ? 'one_way' : 'by_hour');
        setPickup(initial?.pickup || '');
        setDropoff(initial?.dropoff || '');
        setDuration(initial?.duration || '2');
        setDate(initial?.date || '');
        setTime(initial?.time || '22:15');
    }, [open, initial]);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open || typeof document === 'undefined') return null;

    const submit = (e) => {
        e.preventDefault();
        onSave({
            pickup: pickup.trim(),
            dropoff: dropoff.trim(),
            duration,
            date,
            time,
            mode: tab === 'one_way' ? 'transfer' : 'hourly',
        });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[210] flex items-end justify-center sm:items-center sm:p-4">
            <button type="button" className="absolute inset-0 border-0 bg-ink/50" aria-label="Close" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative z-[1] flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
            >
                <div className="flex items-center justify-between border-b border-[#eef1f3] px-5 py-4">
                    <h2 className="font-fragment m-0 text-[22px] font-400 text-ink-text">Change trip</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-2xl text-muted hover:bg-page"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    <div
                        role="radiogroup"
                        aria-label="Trip type"
                        className="mb-5 grid grid-cols-2 gap-1 rounded-full border border-[#e0ddd6] bg-page p-1"
                    >
                        {[
                            { id: 'one_way', label: 'One way' },
                            { id: 'by_hour', label: 'By the hour' },
                        ].map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                role="radio"
                                aria-checked={tab === t.id}
                                onClick={() => setTab(t.id)}
                                className={`font-geist cursor-pointer rounded-full py-2.5 text-[14px] font-500 transition ${
                                    tab === t.id ? 'bg-wine-700 text-white' : 'text-ink-text'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="block">
                            <span className="font-geist mb-1.5 block text-[14px] text-muted">Pickup location</span>
                            <input
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                className={fieldClass}
                                placeholder="Address, airport, hotel, ..."
                                required
                            />
                        </label>

                        {tab === 'one_way' ? (
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] text-muted">Drop-off location</span>
                                <input
                                    value={dropoff}
                                    onChange={(e) => setDropoff(e.target.value)}
                                    className={fieldClass}
                                    placeholder="Address, airport, hotel, ..."
                                    required
                                />
                            </label>
                        ) : (
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] text-muted">Duration</span>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className={`${fieldClass} cursor-pointer`}
                                >
                                    {DURATION_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] text-muted">Date</span>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={fieldClass}
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="font-geist mb-1.5 block text-[14px] text-muted">Pickup time</span>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className={fieldClass}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 border-t border-[#eef1f3] px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist flex-1 cursor-pointer rounded-full border border-[#d8d8dc] py-3.5 text-[15px] font-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="font-geist flex-1 cursor-pointer rounded-full bg-wine-700 py-3.5 text-[15px] font-500 text-white hover:bg-wine-600"
                    >
                        Update trip
                    </button>
                </div>
            </form>
        </div>,
        document.body,
    );
}
