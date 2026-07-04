import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LogoAr from './LogoAr';
import { NAV_LINKS } from './data';

export default function NavbarAr() {
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
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 2.4 }}
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
                scrolled || open
                    ? 'border-b border-gold-500/10 bg-ink/90 py-3 backdrop-blur-xl'
                    : 'border-b border-transparent bg-transparent py-4 sm:py-5'
            }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
                <a href="#top" aria-label="المجد" className="min-w-0 shrink">
                    <LogoAr />
                </a>

                <ul className="hidden items-center gap-7 xl:gap-10 lg:flex">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="group relative whitespace-nowrap font-ar-kufi text-[15px] text-ivory/75 transition hover:text-ivory"
                            >
                                {link.label}
                                <span className="absolute -bottom-1.5 right-0 h-px w-0 bg-gold-400 transition-all duration-400 group-hover:w-full" />
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-4 lg:flex">
                    <a
                        href="/login"
                        className="whitespace-nowrap font-ar-kufi text-[15px] text-ivory/80 transition hover:text-ivory"
                    >
                        تسجيل الدخول
                    </a>
                    <a
                        href="#book"
                        className="group relative overflow-hidden rounded-full border border-gold-500/60 px-6 py-2.5 font-ar-kufi text-[15px] text-ivory transition"
                    >
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-ink">
                            احجز الآن
                        </span>
                        <span className="absolute inset-0 origin-right scale-x-0 bg-gradient-to-l from-gold-300 to-gold-500 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                    </a>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-gold-500/20 lg:hidden"
                    aria-label="القائمة"
                    aria-expanded={open}
                >
                    <span className={`h-px w-5 bg-ivory transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
                    <span className={`h-px w-5 bg-ivory transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
                    <span className={`h-px w-5 bg-ivory transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
                </button>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-gold-500/10 bg-ink/95 backdrop-blur-xl lg:hidden"
                    >
                        <ul className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto px-4 py-5 sm:px-6">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="block py-3.5 font-ar-kufi text-lg text-ivory/80"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li className="mt-3 flex flex-col gap-3 sm:flex-row">
                                <a href="/login" className="flex-1 rounded-full border border-gold-500/20 py-3.5 text-center font-ar-kufi text-base text-ivory">
                                    تسجيل الدخول
                                </a>
                                <a
                                    href="#book"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 rounded-full bg-gradient-to-l from-gold-300 to-gold-500 py-3.5 text-center font-ar-kufi text-base text-ink"
                                >
                                    احجز الآن
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
