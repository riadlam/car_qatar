function formatDateLabel(dateStr) {
    if (!dateStr) return '';
    const d = new Date(`${dateStr}T12:00:00`);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

function formatTimeLabel(timeStr) {
    if (!timeStr) return '';
    const [hRaw, mRaw = '00'] = String(timeStr).split(':');
    let h = Number(hRaw);
    const m = Number(mRaw);
    if (!Number.isFinite(h)) return timeStr;
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, '0')} ${period}`;
}

function MetaPill({ icon, children }) {
    return (
        <span className="font-geist inline-flex items-center gap-1.5 rounded-full border border-[#e0ddd6] bg-white px-3 py-1.5 text-[13px] leading-4 font-500 text-ink-text">
            {icon ? <span className="text-ink-text/45">{icon}</span> : null}
            {children}
        </span>
    );
}

function CalendarIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function RouteIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/**
 * Modern trip summary for /booking — route timeline + meta pills.
 */
export default function TripOverview({
    serviceLabel = '',
    pickup = '',
    dropoff = '',
    secondaryLabel = '',
    secondaryHeading = 'Details',
    secondaryTitle = '',
    date = '',
    time = '',
    distanceKm = null,
    durationMinutes = null,
    meta = [],
}) {
    const dateLabel = formatDateLabel(date);
    const timeLabel = formatTimeLabel(time);
    const showRoute = Boolean(pickup || dropoff || secondaryLabel);
    const endLabel = dropoff || secondaryLabel;
    const endHeading = dropoff ? 'Drop off' : secondaryLabel ? secondaryHeading : '';

    return (
        <div className="mt-4 rounded-2xl border border-[#e8e6e1] bg-white/90 p-4 shadow-[0_8px_24px_rgba(15,19,25,0.04)] backdrop-blur-sm sm:p-5">
            {serviceLabel ? (
                <span className="font-geist mb-4 inline-flex rounded-full bg-wine-50 px-3 py-1 text-[12px] font-500 tracking-[0.02em] text-wine-800">
                    {serviceLabel}
                </span>
            ) : null}

            {showRoute ? (
                <div className="flex gap-3">
                    <div className="flex w-3 shrink-0 flex-col items-center pt-1.5" aria-hidden="true">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-wine-700 ring-4 ring-wine-100" />
                        {endLabel ? <span className="my-1.5 w-px flex-1 min-h-[1.75rem] bg-gradient-to-b from-[#d8d4cc] to-[#e8e6e1]" /> : null}
                        {endLabel ? (
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink-text/35 bg-white" />
                        ) : null}
                    </div>

                    <div className="min-w-0 flex-1 space-y-4">
                        {pickup ? (
                            <div>
                                <p className="font-geist m-0 mb-1 text-[11px] font-500 uppercase tracking-[0.12em] text-muted">
                                    Pick up
                                </p>
                                <p className="font-geist m-0 text-[15px] leading-6 font-500 text-ink-text" title={pickup}>
                                    {pickup}
                                </p>
                            </div>
                        ) : null}
                        {endLabel ? (
                            <div>
                                <p className="font-geist m-0 mb-1 text-[11px] font-500 uppercase tracking-[0.12em] text-muted">
                                    {endHeading}
                                </p>
                                <p
                                    className="font-geist m-0 text-[15px] leading-6 font-500 text-ink-text"
                                    title={secondaryTitle || endLabel}
                                >
                                    {endLabel}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <div className={`flex flex-wrap gap-2 ${showRoute ? 'mt-4 border-t border-[#eeebe4] pt-4' : ''}`}>
                {dateLabel ? (
                    <MetaPill icon={<CalendarIcon />}>{dateLabel}</MetaPill>
                ) : null}
                {timeLabel ? (
                    <MetaPill icon={<ClockIcon />}>{timeLabel}</MetaPill>
                ) : null}
                {distanceKm != null ? (
                    <MetaPill icon={<RouteIcon />}>{Number(distanceKm).toFixed(1)} km</MetaPill>
                ) : null}
                {durationMinutes ? (
                    <MetaPill>{durationMinutes} min</MetaPill>
                ) : null}
                {meta.map((item) => (
                    <MetaPill key={item}>{item}</MetaPill>
                ))}
            </div>
        </div>
    );
}
