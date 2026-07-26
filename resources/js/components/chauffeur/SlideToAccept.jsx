import { useCallback, useEffect, useRef, useState } from 'react';

const THUMB = 52;
const PAD = 4;
const THRESHOLD = 0.86;

/**
 * Premium slide-to-accept control (mobile offers).
 * Drag thumb to the end to confirm — springs back if released early.
 */
export default function SlideToAccept({
    amountLabel,
    onAccept,
    disabled = false,
    className = '',
}) {
    const trackRef = useRef(null);
    const draggingRef = useRef(false);
    const startXRef = useRef(0);
    const startOffsetRef = useRef(0);
    const maxRef = useRef(0);
    const offsetRef = useRef(0);
    const [offset, setOffset] = useState(0);
    const [max, setMax] = useState(0);
    const [done, setDone] = useState(false);
    const [settling, setSettling] = useState(false);

    const measure = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const m = Math.max(0, el.clientWidth - THUMB - PAD * 2);
        maxRef.current = m;
        setMax(m);
    }, []);

    useEffect(() => {
        measure();
        const el = trackRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [measure]);

    const setOffsetBoth = (v) => {
        offsetRef.current = v;
        setOffset(v);
    };

    const finishAccept = useCallback(() => {
        setDone(true);
        setSettling(true);
        const m = maxRef.current;
        setOffsetBoth(m);
        window.setTimeout(() => {
            onAccept?.();
        }, 280);
    }, [onAccept]);

    const springBack = useCallback(() => {
        setSettling(true);
        setOffsetBoth(0);
        window.setTimeout(() => setSettling(false), 420);
    }, []);

    const onPointerDown = (e) => {
        if (disabled || done) return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        draggingRef.current = true;
        setSettling(false);
        startXRef.current = e.clientX;
        startOffsetRef.current = offsetRef.current;
    };

    const onPointerMove = (e) => {
        if (!draggingRef.current || disabled || done) return;
        const delta = e.clientX - startXRef.current;
        const next = Math.min(maxRef.current, Math.max(0, startOffsetRef.current + delta));
        setOffsetBoth(next);
    };

    const onPointerUp = () => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        const m = maxRef.current || 1;
        const ratio = offsetRef.current / m;
        if (ratio >= THRESHOLD) {
            finishAccept();
        } else {
            springBack();
        }
    };

    const progress = max > 0 ? offset / max : 0;

    return (
        <div
            ref={trackRef}
            className={`relative h-[60px] w-full touch-none select-none overflow-hidden rounded-full bg-[#f3f1ec] shadow-[inset_0_1px_3px_rgba(15,19,25,0.06)] ${
                disabled ? 'opacity-50' : ''
            } ${className}`}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label={`Slide to accept for ${amountLabel}`}
            aria-disabled={disabled || done}
        >
            {/* Fill wash as you drag */}
            <div
                className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-wine-700/10"
                style={{
                    width: `calc(${PAD * 2 + THUMB}px + ${offset}px)`,
                    transition: settling ? 'width 0.42s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                }}
            />

            <p
                className={`font-geist pointer-events-none absolute inset-0 flex items-center justify-center text-[18px] font-600 tracking-[-0.02em] text-ink-text transition-opacity duration-200 ${
                    progress > 0.35 || done ? 'opacity-35' : 'opacity-100'
                }`}
            >
                {done ? 'Accepted' : amountLabel}
            </p>

            <button
                type="button"
                disabled={disabled || done}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className={`absolute z-10 flex h-[52px] w-[52px] cursor-grab items-center justify-center rounded-full bg-wine-700 p-0 text-white shadow-[0_8px_20px_rgba(91,5,32,0.35)] active:cursor-grabbing ${
                    done ? 'bg-emerald-600 shadow-[0_8px_20px_rgba(5,150,105,0.35)]' : ''
                }`}
                style={{
                    top: PAD,
                    left: PAD,
                    transform: `translate3d(${offset}px, 0, 0)`,
                    transition: settling
                        ? 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s ease'
                        : 'background-color 0.2s ease',
                    willChange: 'transform',
                }}
                aria-hidden="true"
                tabIndex={-1}
            >
                <span className="pointer-events-none flex h-6 w-6 items-center justify-center">
                    {done ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M6 12.2 10.2 16.4 18 8.2"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M4.5 12h11.75M12.5 7l5.5 5-5.5 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </span>
            </button>
        </div>
    );
}
