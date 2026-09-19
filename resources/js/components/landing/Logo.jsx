export default function Logo({ compact = false, inverted = false, className = '' }) {
    const word = inverted ? 'text-ink-text' : 'text-white';
    const sub = inverted ? 'text-wine-600' : 'text-hero-title';

    return (
        <div className={`flex min-w-0 items-center gap-3 sm:gap-3.5 ${className}`}>
            <span
                className="relative inline-flex h-11 w-auto shrink-0 items-center justify-center sm:h-[3.25rem]"
                aria-hidden="true"
            >
                <img
                    src="/images/brand/al-majd-mark.png"
                    alt=""
                    className="h-full w-auto max-w-none object-contain"
                    draggable={false}
                />
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
