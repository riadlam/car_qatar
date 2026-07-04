export default function Logo({ compact = false, className = '' }) {
    return (
        <div className={`flex min-w-0 items-center gap-2 sm:gap-3 ${className}`}>
            <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
                    <defs>
                        <linearGradient id="alm-gold" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f0e0b6" />
                            <stop offset="50%" stopColor="#d4af5f" />
                            <stop offset="100%" stopColor="#a9843a" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M24 2l19 11v22L24 46 5 35V13L24 2z"
                        fill="none"
                        stroke="url(#alm-gold)"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M24 12l7 24h-3.4l-1.3-4.6h-4.6L20.4 36H17l7-24zm-1.6 12.4h3.2L24 18.9l-1.6 5.5z"
                        fill="url(#alm-gold)"
                    />
                </svg>
            </span>
            <span className="flex min-w-0 flex-col leading-none">
                <span className="font-display text-base font-700 tracking-[0.22em] text-ivory sm:text-lg sm:tracking-[0.35em]">
                    AL&nbsp;MAJD
                </span>
                {!compact && (
                    <span className="mt-1 hidden font-sans text-[9px] font-400 tracking-[0.28em] text-gold-400 sm:block">
                        QATAR · HOTEL ↔ AIRPORT
                    </span>
                )}
            </span>
        </div>
    );
}
