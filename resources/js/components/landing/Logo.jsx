export default function Logo({ compact = false, inverted = false, className = '' }) {
    const mark = inverted ? '#5b0520' : '#f0e0b6';
    const word = inverted ? 'text-ink-text' : 'text-white';
    const sub = inverted ? 'text-wine-600' : 'text-hero-title';

    return (
        <div className={`flex min-w-0 items-center gap-2 sm:gap-3 ${className}`}>
            <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9">
                <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
                    <path
                        d="M24 2l19 11v22L24 46 5 35V13L24 2z"
                        fill="none"
                        stroke={mark}
                        strokeWidth="1.5"
                    />
                    <path
                        d="M24 12l7 24h-3.4l-1.3-4.6h-4.6L20.4 36H17l7-24zm-1.6 12.4h3.2L24 18.9l-1.6 5.5z"
                        fill={mark}
                    />
                </svg>
            </span>
            <span className="flex min-w-0 flex-col leading-none">
                <span className={`font-fragment text-base font-400 tracking-[0.08em] sm:text-lg ${word}`}>
                    AL&nbsp;MAJD
                </span>
                {!compact && (
                    <span className={`mt-1 hidden font-geist text-[9px] font-400 tracking-[0.18em] uppercase sm:block ${sub}`}>
                        The global chauffeur service
                    </span>
                )}
            </span>
        </div>
    );
}
