import { motion } from 'motion/react';

const OPTIONS = [
    { id: 'v1', label: 'V1 · EN', href: '/' },
    { id: 'v2', label: 'V2 · ع', href: '/v2' },
    { id: 'v3', label: 'V3 · Editorial', href: '/second' },
];

// Floating toggle so the client can jump between the three concepts.
export default function VersionSwitcher({ current = 'v1' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            dir="ltr"
            className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2"
        >
            <div className="flex items-center gap-1 rounded-full border border-gold-500/30 bg-ink/85 p-1 backdrop-blur-xl">
                {OPTIONS.map((o) => (
                    <a
                        key={o.id}
                        href={o.href}
                        className={`whitespace-nowrap rounded-full px-3.5 py-2 font-sans text-[11px] font-500 tracking-[0.12em] uppercase transition sm:px-4 ${
                            current === o.id
                                ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-ink'
                                : 'text-ivory/70 hover:text-ivory'
                        }`}
                    >
                        {o.label}
                    </a>
                ))}
            </div>
        </motion.div>
    );
}
