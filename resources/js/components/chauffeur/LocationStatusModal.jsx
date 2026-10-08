import { useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function formatAge(at) {
    if (!at) return null;
    const seconds = Math.max(0, Math.round((Date.now() - at) / 1000));
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
}

/**
 * Shows the chauffeur's latest device GPS so they can verify the pin is right.
 */
export default function LocationStatusModal({ open, fix, busy, note, onClose, onRefresh }) {
    const { t } = useTranslation('chauffeur');
    const titleId = useId();

    const mapsHref = useMemo(() => {
        if (!fix || !Number.isFinite(fix.lat) || !Number.isFinite(fix.lng)) return null;
        return `https://www.google.com/maps?q=${fix.lat},${fix.lng}`;
    }, [fix]);

    const embedSrc = useMemo(() => {
        if (!fix || !Number.isFinite(fix.lat) || !Number.isFinite(fix.lng)) return null;
        const pad = 0.008;
        const left = fix.lng - pad;
        const right = fix.lng + pad;
        const top = fix.lat + pad;
        const bottom = fix.lat - pad;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${fix.lat}%2C${fix.lng}`;
    }, [fix]);

    if (!open) return null;

    const hasFix = Boolean(fix && Number.isFinite(fix.lat) && Number.isFinite(fix.lng));

    return (
        <div
            className="fixed inset-0 z-[210] flex items-end justify-center bg-ink/45 p-4 sm:items-center"
            role="presentation"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                    <h2 id={titleId} className="font-fragment m-0 text-[24px] font-400 text-ink-text">
                        {t('locationModal.title')}
                    </h2>
                    <p className="font-geist mt-1 m-0 text-[14px] leading-5 text-muted">
                        {t('locationModal.subtitle')}
                    </p>
                </div>

                {embedSrc ? (
                    <div className="mt-4 h-48 w-full bg-[#ebe8e2] sm:h-56">
                        <iframe
                            title={t('locationModal.mapTitle')}
                            src={embedSrc}
                            className="h-full w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                ) : (
                    <div className="mx-5 mt-4 flex h-36 items-center justify-center rounded-xl bg-page text-center sm:mx-6">
                        <p className="font-geist m-0 max-w-[240px] px-3 text-[14px] text-muted">
                            {t('locationModal.noFix')}
                        </p>
                    </div>
                )}

                <div className="space-y-3 px-5 py-4 sm:px-6">
                    {hasFix ? (
                        <>
                            <div className="grid grid-cols-2 gap-3 text-left">
                                <div>
                                    <p className="font-geist m-0 text-[11px] font-500 tracking-wide text-muted uppercase">
                                        {t('locationModal.latitude')}
                                    </p>
                                    <p className="font-geist mt-0.5 m-0 text-[14px] font-600 tabular-nums text-ink-text">
                                        {fix.lat.toFixed(6)}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-geist m-0 text-[11px] font-500 tracking-wide text-muted uppercase">
                                        {t('locationModal.longitude')}
                                    </p>
                                    <p className="font-geist mt-0.5 m-0 text-[14px] font-600 tabular-nums text-ink-text">
                                        {fix.lng.toFixed(6)}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-geist m-0 text-[11px] font-500 tracking-wide text-muted uppercase">
                                        {t('locationModal.accuracy')}
                                    </p>
                                    <p className="font-geist mt-0.5 m-0 text-[14px] font-600 text-ink-text">
                                        {fix.accuracy != null
                                            ? t('locationModal.accuracyMeters', {
                                                  meters: Math.round(fix.accuracy),
                                              })
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-geist m-0 text-[11px] font-500 tracking-wide text-muted uppercase">
                                        {t('locationModal.updated')}
                                    </p>
                                    <p className="font-geist mt-0.5 m-0 text-[14px] font-600 text-ink-text">
                                        {formatAge(fix.at) || '—'}
                                    </p>
                                </div>
                            </div>
                            {mapsHref ? (
                                <a
                                    href={mapsHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-geist inline-flex text-[14px] font-500 text-wine-700 underline-offset-2 hover:underline"
                                >
                                    {t('locationModal.openMaps')}
                                </a>
                            ) : null}
                        </>
                    ) : null}

                    {note ? <p className="font-geist m-0 text-[13px] text-ink-text">{note}</p> : null}

                    <div className="flex flex-wrap justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="font-geist cursor-pointer rounded-full border border-[#d8d8dc] px-4 py-2 text-[14px] font-500 text-ink-text"
                        >
                            {t('actions.close')}
                        </button>
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={busy}
                            className="font-geist cursor-pointer rounded-full bg-wine-700 px-4 py-2 text-[14px] font-500 text-white disabled:opacity-60"
                        >
                            {busy ? t('locationModal.refreshing') : t('locationModal.refresh')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
