export default function LogoAr({ compact = false, className = '' }) {
    return (
        <div className={`flex min-w-0 items-center gap-2 sm:gap-3 ${className}`}>
            <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center sm:h-11 sm:w-11">
                <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
                    <defs>
                        <linearGradient id="alm-gold-v2" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f0e0b6" />
                            <stop offset="50%" stopColor="#d4af5f" />
                            <stop offset="100%" stopColor="#a9843a" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M24 2l19 11v22L24 46 5 35V13L24 2z"
                        fill="none"
                        stroke="url(#alm-gold-v2)"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M24 12l7 24h-3.4l-1.3-4.6h-4.6L20.4 36H17l7-24zm-1.6 12.4h3.2L24 18.9l-1.6 5.5z"
                        fill="url(#alm-gold-v2)"
                    />
                </svg>
            </span>
            <span className="flex min-w-0 flex-col items-start leading-none">
                <span className="font-ar-display text-2xl text-ivory sm:text-[26px]">المجد</span>
                {!compact && (
                    <span className="mt-1 hidden font-ar-kufi text-[10px] tracking-[0.2em] text-gold-400 sm:block">
                        فندق ↔ مطار · قطر
                    </span>
                )}
            </span>
        </div>
    );
}
