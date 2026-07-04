export default function Logo3({ className = '', dark = false }) {
    const wordColor = dark ? 'text-[#f7f2ea]' : 'text-[#14060c]';
    const tagColor = dark ? 'text-[#c9a24b]' : 'text-[#5b0520]';

    return (
        <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
            <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
                    <defs>
                        <linearGradient id="alm-gold-v3" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#c9a24b" />
                            <stop offset="100%" stopColor="#5b0520" />
                        </linearGradient>
                    </defs>
                    <path d="M24 2l19 11v22L24 46 5 35V13L24 2z" fill="none" stroke="url(#alm-gold-v3)" strokeWidth="1.5" />
                    <path
                        d="M24 12l7 24h-3.4l-1.3-4.6h-4.6L20.4 36H17l7-24zm-1.6 12.4h3.2L24 18.9l-1.6 5.5z"
                        fill="url(#alm-gold-v3)"
                    />
                </svg>
            </span>
            <span className="flex min-w-0 flex-col leading-none">
                <span className={`font-editorial text-xl font-700 tracking-tight ${wordColor}`}>
                    AL MAJD
                </span>
                <span className={`mt-0.5 hidden font-grotesk text-[9px] font-500 tracking-[0.22em] uppercase sm:block ${tagColor}`}>
                    Qatar · Hotel ↔ Airport
                </span>
            </span>
        </div>
    );
}
