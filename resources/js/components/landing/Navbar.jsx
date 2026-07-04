import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo';

const LINKS = [
    { label: 'Services', href: '#services' },
    { label: 'Experience', href: '#experience' },
    { label: 'Fleet', href: '#fleet' },
    { label: 'Why AL MAJD', href: '#excellence' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('menu-open', open);
        return () => document.body.classList.remove('menu-open');
    }, [open]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 1024) setOpen(false);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
                scrolled || open
                    ? 'border-b border-white/5 bg-ink/90 py-3 backdrop-blur-xl'
                    : 'border-b border-transparent bg-transparent py-4 sm:py-5'
            }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
                <a href="#top" aria-label="AL MAJD home" className="min-w-0 shrink">
                    <Logo />
                </a>

                <ul className="hidden items-center gap-6 xl:gap-9 lg:flex">
                    {LINKS.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="group relative whitespace-nowrap font-sans text-[12px] font-400 tracking-[0.16em] text-ivory/75 uppercase transition hover:text-ivory xl:text-[13px] xl:tracking-[0.18em]"
                            >
                                {link.label}
                                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-400 transition-all duration-400 group-hover:w-full" />
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-4 lg:flex">
                    <a
                        href="/login"
                        className="whitespace-nowrap font-sans text-[12px] font-500 tracking-[0.16em] text-ivory/80 uppercase transition hover:text-ivory xl:text-[13px]"
                    >
                        Sign in
                    </a>
                    <a
                        href="#book"
                        className="group relative overflow-hidden rounded-full border border-gold-500/60 px-5 py-2.5 font-sans text-[12px] font-500 tracking-[0.16em] text-ivory uppercase transition xl:px-6 xl:text-[13px]"
                    >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                            Book now
                        </span>
                        <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-gold-300 to-gold-500 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                    </a>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 lg:hidden"
                    aria-label="Toggle menu"
                    aria-expanded={open}
                >
                    <span
                        className={`h-px w-5 bg-ivory transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
                    />
                    <span
                        className={`h-px w-5 bg-ivory transition-all duration-300 ${open ? 'opacity-0' : ''}`}
                    />
                    <span
                        className={`h-px w-5 bg-ivory transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
                    />
                </button>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-white/5 bg-ink/95 backdrop-blur-xl lg:hidden"
                    >
                        <ul className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto px-4 py-5 sm:px-6">
                            {LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="block py-3.5 font-sans text-sm tracking-[0.18em] text-ivory/80 uppercase"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li className="mt-3 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="/login"
                                    className="flex-1 rounded-full border border-white/15 py-3.5 text-center font-sans text-xs tracking-[0.16em] text-ivory uppercase"
                                >
                                    Sign in
                                </a>
                                <a
                                    href="#book"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 py-3.5 text-center font-sans text-xs tracking-[0.16em] text-ink uppercase"
                                >
                                    Book now
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
