import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Logo3 from './Logo3';
import { NAV_LINKS } from './data';

export default function Nav3() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('menu-open', open);
        return () => document.body.classList.remove('menu-open');
    }, [open]);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
                scrolled || open
                    ? 'border-b border-[#14060c]/10 bg-[#f7f2ea]/92 py-3 shadow-sm backdrop-blur-xl'
                    : 'border-b border-transparent bg-[#f7f2ea]/70 py-4 backdrop-blur-md sm:py-5'
            }`}
        >
            <nav className="mx-auto flex max-w-[88rem] items-center justify-between gap-3 px-4 sm:px-8">
                <a href="#top" aria-label="AL MAJD" className="min-w-0 shrink">
                    <Logo3 />
                </a>

                <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex xl:gap-10">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="group relative font-grotesk text-[13px] font-500 text-[#14060c]/70 transition hover:text-[#14060c]"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#5b0520] transition-all duration-400 group-hover:w-full" />
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-5 lg:flex">
                    <a href="/login" className="font-grotesk text-[13px] font-500 text-[#14060c]/70 transition hover:text-[#14060c]">
                        Sign in
                    </a>
                    <a
                        href="#book"
                        className="rounded-full bg-[#5b0520] px-6 py-2.5 font-grotesk text-[13px] font-500 text-[#f7f2ea] transition hover:bg-[#741133]"
                    >
                        Reserve
                    </a>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-[#14060c]/12 bg-white/60 lg:hidden"
                    aria-label="Menu"
                    aria-expanded={open}
                >
                    <span className={`h-px w-5 bg-[#14060c] transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
                    <span className={`h-px w-5 bg-[#14060c] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
                    <span className={`h-px w-5 bg-[#14060c] transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
                </button>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-[#14060c]/10 bg-[#f7f2ea] lg:hidden"
                    >
                        <ul className="flex flex-col gap-1 px-4 py-5 sm:px-8">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="block py-3.5 font-editorial text-2xl text-[#14060c]"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li className="mt-3 flex flex-col gap-3 sm:flex-row">
                                <a href="/login" className="flex-1 rounded-full border border-[#14060c]/15 py-3.5 text-center font-grotesk text-sm text-[#14060c]">
                                    Sign in
                                </a>
                                <a href="#book" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-[#5b0520] py-3.5 text-center font-grotesk text-sm text-[#f7f2ea]">
                                    Reserve
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
