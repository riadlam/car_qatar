import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildReceiptPdf } from '../../utils/receiptPdf';

/**
 * Modern receipt preview modal — PDF iframe + download.
 */
export default function ReceiptModal({ open, journey, onClose }) {
    const [pdf, setPdf] = useState(null);
    const [error, setError] = useState('');
    const [building, setBuilding] = useState(false);

    useEffect(() => {
        if (!open || !journey) return undefined;

        let active = true;
        setBuilding(true);
        setError('');
        setPdf(null);

        try {
            const next = buildReceiptPdf(journey);
            if (active) {
                setPdf((prev) => {
                    prev?.revoke?.();
                    return next;
                });
                setBuilding(false);
            } else {
                next.revoke();
            }
        } catch (e) {
            if (active) {
                setError('Could not generate receipt. Please try again.');
                setBuilding(false);
            }
        }

        return () => {
            active = false;
        };
    }, [open, journey]);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (open) return undefined;
        setPdf((prev) => {
            prev?.revoke?.();
            return null;
        });
        return undefined;
    }, [open]);
    if (!open) return null;

    const download = () => {
        if (!pdf?.url) return;
        const a = document.createElement('a');
        a.href = pdf.url;
        a.download = pdf.filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[230] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-title"
        >
            <button type="button" className="absolute inset-0 border-0" aria-label="Close" onClick={onClose} />

            <div className="relative z-[1] flex max-h-[min(92dvh,900px)] w-full max-w-[720px] flex-col overflow-hidden rounded-t-2xl bg-page shadow-2xl sm:rounded-2xl">
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#e8e6e1] bg-white px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                        <p className="font-geist m-0 text-[12px] font-500 tracking-[0.08em] text-wine-700 uppercase">
                            AL MAJD
                        </p>
                        <h2 id="receipt-title" className="font-fragment m-0 mt-1 text-[24px] font-400 text-ink-text">
                            Receipt
                        </h2>
                        <p className="font-geist mt-1 m-0 truncate text-[13px] text-muted">
                            {journey?.booking_number}
                            {journey?.date_label ? ` · ${journey.date_label}` : ''}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink-text hover:bg-page"
                    >
                        ×
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden bg-[#ebe8e2] p-3 sm:p-5">
                    <div className="mx-auto h-full min-h-[420px] overflow-hidden rounded-xl border border-[#e0ddd6] bg-white shadow-sm">
                        {building ? (
                            <div className="flex h-[420px] items-center justify-center text-muted">
                                <p className="font-geist m-0 text-[14px]">Generating receipt…</p>
                            </div>
                        ) : error ? (
                            <div className="flex h-[420px] items-center justify-center px-6 text-center">
                                <p className="font-geist m-0 text-[14px] text-muted">{error}</p>
                            </div>
                        ) : pdf?.url ? (
                            <iframe
                                title="Receipt preview"
                                src={`${pdf.url}#toolbar=0&navpanes=0`}
                                className="h-[min(62dvh,560px)] w-full border-0 bg-white"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#e8e6e1] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-[#d8d8dc] px-5 text-[15px] font-500 text-ink-text"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={download}
                        disabled={!pdf?.url}
                        className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-5 text-[15px] font-500 text-white transition hover:bg-wine-600 disabled:cursor-not-allowed disabled:bg-[#aeaeae]"
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
