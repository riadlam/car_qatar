import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Partner checkout UI: copy a guest payment link before (or instead of) paying yourself.
 * Payment gateway is not live yet — this is a shareable preview URL for handoff.
 */
export default function PartnerGuestPayLink({ quoteId, draftId, compact = false }) {
    const { t } = useTranslation('booking');
    const [copied, setCopied] = useState(false);
    const [busy, setBusy] = useState(false);

    const link = useMemo(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const token = quoteId
            ? `preview-q${quoteId}`
            : draftId
              ? `preview-d${String(draftId).slice(0, 12)}`
              : 'preview';
        return `${origin}/pay/${token}`;
    }, [quoteId, draftId]);

    const onCopy = async () => {
        setBusy(true);
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(link);
            } else {
                const input = document.createElement('input');
                input.value = link;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
            }
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2200);
        } catch {
            // ignore — still show the link for manual copy
        } finally {
            setBusy(false);
        }
    };

    if (compact) {
        return (
            <div className="mb-3 rounded-xl border border-wine-700/20 bg-wine-50 px-3 py-3">
                <p className="font-geist m-0 text-[12px] font-500 tracking-wide text-wine-800 uppercase">
                    {t('checkout.partnerPayLink.eyebrow')}
                </p>
                <p className="font-geist mt-1 m-0 text-[13px] leading-5 text-ink-text/80">
                    {t('checkout.partnerPayLink.compactHint')}
                </p>
                <button
                    type="button"
                    onClick={onCopy}
                    disabled={busy}
                    className="font-geist mt-2 inline-flex min-h-10 w-full cursor-pointer items-center justify-center rounded-full bg-wine-700 px-4 py-2 text-[14px] font-500 text-white transition hover:bg-wine-600 disabled:opacity-60"
                >
                    {copied
                        ? t('checkout.partnerPayLink.copied')
                        : busy
                          ? t('checkout.partnerPayLink.copying')
                          : t('checkout.partnerPayLink.copy')}
                </button>
            </div>
        );
    }

    return (
        <div
            id="partner-guest-pay-link"
            className="rounded-xl border border-wine-700/20 bg-wine-50 px-4 py-4 sm:px-5"
        >
            <h3 className="font-geist m-0 text-[15px] font-500 text-ink-text">
                {t('checkout.partnerPayLink.title')}
            </h3>
            <p className="font-geist mt-1.5 m-0 text-[14px] leading-5 text-ink-text/75">
                {t('checkout.partnerPayLink.body')}
            </p>
            <p className="font-geist mt-2 m-0 text-[12px] leading-4 text-muted">
                {t('checkout.partnerPayLink.previewNote')}
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <input
                    type="text"
                    readOnly
                    value={link}
                    aria-label={t('checkout.partnerPayLink.linkAria')}
                    className="font-geist min-w-0 flex-1 cursor-default truncate rounded-lg border border-[#d8d4cc] bg-white px-3 py-2.5 text-[13px] text-ink-text outline-none"
                    onFocus={(e) => e.target.select()}
                />
                <button
                    type="button"
                    onClick={onCopy}
                    disabled={busy}
                    className="font-geist inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-5 py-2.5 text-[15px] font-500 text-white transition hover:bg-wine-600 disabled:opacity-60"
                >
                    {copied
                        ? t('checkout.partnerPayLink.copied')
                        : busy
                          ? t('checkout.partnerPayLink.copying')
                          : t('checkout.partnerPayLink.copy')}
                </button>
            </div>
        </div>
    );
}
