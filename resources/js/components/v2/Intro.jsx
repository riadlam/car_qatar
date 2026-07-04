import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Premium gold monogram intro that draws itself, then lifts like a curtain.
export default function Intro() {
    const [done, setDone] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDone(true), 2600);
        return () => clearTimeout(t);
    }, []);

    return (
        <AnimatePresence>
            {!done && (
                <motion.div
                    exit={{ y: '-100%' }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
                >
                    <div className="lux-grain absolute inset-0" />
                    <motion.div
                        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-wine-700/25 blur-[120px]"
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2.4, ease: 'easeInOut' }}
                    />

                    <motion.svg
                        width="120"
                        height="120"
                        viewBox="0 0 48 48"
                        fill="none"
                        className="relative"
                    >
                        <defs>
                            <linearGradient id="intro-gold" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#f0e0b6" />
                                <stop offset="50%" stopColor="#d4af5f" />
                                <stop offset="100%" stopColor="#a9843a" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            d="M24 2l19 11v22L24 46 5 35V13L24 2z"
                            fill="none"
                            stroke="url(#intro-gold)"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.6, ease: 'easeInOut' }}
                        />
                        <motion.path
                            d="M24 12l7 24h-3.4l-1.3-4.6h-4.6L20.4 36H17l7-24zm-1.6 12.4h3.2L24 18.9l-1.6 5.5z"
                            fill="url(#intro-gold)"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                            style={{ transformOrigin: 'center' }}
                        />
                    </motion.svg>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.9 }}
                        className="relative mt-6 flex flex-col items-center"
                    >
                        <span className="font-ar-display text-4xl text-ivory">المجد</span>
                        <span className="mt-2 font-ar-kufi text-[11px] tracking-[0.2em] text-gold-400">
                            فندق ↔ مطار · قطر
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
