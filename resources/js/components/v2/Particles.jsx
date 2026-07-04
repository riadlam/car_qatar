import { useMemo } from 'react';

// Lightweight floating gold dust — pure CSS animation for performance.
export default function Particles({ count = 18 }) {
    const dots = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                bottom: Math.random() * 40,
                size: 1 + Math.random() * 2.5,
                delay: Math.random() * 8,
                duration: 8 + Math.random() * 10,
                opacity: 0.2 + Math.random() * 0.5,
            })),
        [count],
    );

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {dots.map((d) => (
                <span
                    key={d.id}
                    className="absolute rounded-full bg-gold-400"
                    style={{
                        left: `${d.left}%`,
                        bottom: `${d.bottom}%`,
                        width: `${d.size}px`,
                        height: `${d.size}px`,
                        opacity: d.opacity,
                        animation: `floatUp ${d.duration}s ease-in-out ${d.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
}
