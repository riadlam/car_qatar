import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo';

import BookingHeader from '../booking/BookingHeader';

/** Pages whose first viewport is light (title-above-image SEO heroes) */
const LIGHT_TOP_PATHS = [
    '/corporations',
    '/travel-agencies',
    '/strategic-partnerships',
    '/help',
    '/account',
    '/journeys',
    '/chauffeur',
];

const BUSINESS = [
    { label: 'Overview', href: '/business' },
    { label: 'Corporations', href: '/corporations' },
    { label: 'Travel agencies', href: '/travel-agencies' },
    { label: 'Strategic partnerships', href: '/strategic-partnerships' },
];

const LANGS = [{ label: 'English (US)', href: '#' }];

function Chevron({ open }) {
    return (
        <svg
            width="1.25em"
            height="1.25em"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
            <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function UserIcon({ className = '' }) {
    return (
        <svg className={className} width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4.271 18.3457C4.271 18.3457 6.50002 15.5 12 15.5C17.5 15.5 19.7291 18.3457 19.7291 18.3457"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function NavDropdown({ label, items, light, align = 'start' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onDoc = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    return (
        <li className="relative" ref={ref}>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className={`font-geist inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[16px] leading-6 font-400 tracking-[0.15px] transition ${
                    light ? 'text-ink-text/85 hover:text-ink-text' : 'text-white/90 hover:text-white'
                }`}
            >
                {label}
                <Chevron open={open} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className={`absolute top-[calc(100%+8px)] z-20 min-w-[220px] list-none rounded-lg p-2 ${
                            align === 'end' ? 'right-0' : 'left-0'
                        } ${light ? 'nav-dd--light' : 'nav-dd--dark'}`}
                    >
                        {items.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`font-geist block rounded-md px-3 py-2.5 text-[15px] leading-5 whitespace-nowrap transition ${
                                        light
                                            ? 'text-ink-text hover:bg-black/5'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    );
}

export default function Navbar() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [pastHero, setPastHero] = useState(false);
    const [open, setOpen] = useState(false);
    const [mobileAcc, setMobileAcc] = useState(null);
    const isBooking = location.pathname.startsWith('/booking');
    const isChauffeurPortal = location.pathname.startsWith('/chauffeur');
    const lightTop =
        LIGHT_TOP_PATHS.includes(location.pathname) ||
        location.pathname.startsWith('/journeys') ||
        location.pathname.startsWith('/chauffeur');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setPastHero(false);
        setOpen(false);
        setMobileAcc(null);
        const hero = document.getElementById('top');
        if (!hero) return undefined;
        const io = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
            threshold: 0,
        });
        io.observe(hero);
        return () => io.disconnect();
    }, [location.pathname]);

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

    if (isBooking) {
        return <BookingHeader />;
    }

    const light = scrolled || open || lightTop;
    const loginHref = `/login?from=${encodeURIComponent(location.pathname + location.search)}`;

    return (
        <motion.header
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-x-0 top-0 z-50 min-h-[72px] transition-colors duration-300 lg:min-h-[88px] ${
                isChauffeurPortal ? 'hidden lg:block' : ''
            } ${
                light
                    ? 'bg-page/90 text-ink-text backdrop-blur-xl'
                    : 'bg-transparent text-white'
            }`}
        >
            {!light && (
                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"
                    aria-hidden="true"
                />
            )}
            <div className="relative mx-auto flex h-[72px] w-full max-w-[100vw] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:h-[88px] lg:px-12">
                <a href="/" aria-label="Go to Homepage" className="relative z-10 shrink-0">
                    <Logo compact inverted={light} />
                </a>

                <nav className="relative z-10 hidden lg:block" aria-label="Primary">
                    <ul className="m-0 flex list-none items-center gap-1 p-0 xl:gap-2">
                        <li>
                            <a
                                href="/"
                                className={`font-geist inline-flex rounded-full px-2 py-1.5 text-[16px] leading-6 font-400 tracking-[0.15px] transition ${
                                    light
                                        ? 'text-ink-text/85 hover:text-ink-text'
                                        : 'text-white/90 hover:text-white'
                                }`}
                            >
                                Home
                            </a>
                        </li>
                        <NavDropdown label="For business" items={BUSINESS} light={light} />
                        <li>
                            <a
                                href="/partners"
                                className={`font-geist inline-flex rounded-full px-2 py-1.5 text-[16px] leading-6 font-400 tracking-[0.15px] transition ${
                                    light
                                        ? 'text-ink-text/85 hover:text-ink-text'
                                        : 'text-white/90 hover:text-white'
                                }`}
                            >
                                For chauffeurs
                            </a>
                        </li>
                        <li>
                            <a
                                href="/help"
                                className={`font-geist inline-flex rounded-full px-2 py-1.5 text-[16px] leading-6 font-400 tracking-[0.15px] transition ${
                                    light
                                        ? 'text-ink-text/85 hover:text-ink-text'
                                        : 'text-white/90 hover:text-white'
                                }`}
                            >
                                Help
                            </a>
                        </li>
                        <NavDropdown label="English (US)" items={LANGS} light={light} align="end" />
                        <li className="ml-1">
                            <Link
                                to={loginHref}
                                data-cy="sign-in-button"
                                className={`nav-signin font-geist inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[16px] leading-6 font-500 whitespace-nowrap transition ${
                                    light
                                        ? 'nav-signin--light border-ink-text/12'
                                        : 'nav-signin--dark border-white/25'
                                }`}
                            >
                                <UserIcon />
                                Sign in
                            </Link>
                        </li>
                        <AnimatePresence initial={false}>
                            {pastHero && (
                                <li>
                                    <motion.a
                                        href="/#book"
                                        initial={{ opacity: 0, scale: 0.92, x: 8 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.92, x: 8 }}
                                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                        className="font-geist ml-1 inline-flex rounded-full bg-wine-700 px-4 py-2 text-[16px] leading-6 font-500 whitespace-nowrap text-white transition hover:bg-wine-600"
                                    >
                                        Book now
                                    </motion.a>
                                </li>
                            )}
                        </AnimatePresence>
                    </ul>
                </nav>

                <div className="relative z-10 flex items-center gap-2 lg:hidden">
                    <AnimatePresence>
                        {pastHero && !open && (
                            <motion.a
                                href="/#book"
                                initial={{ opacity: 0, scale: 0.92, x: 8 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.92, x: 8 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className="font-geist rounded-full bg-wine-700 px-3.5 py-2 text-[14px] leading-5 font-500 whitespace-nowrap text-white transition hover:bg-wine-600 sm:px-4 sm:text-[15px]"
                            >
                                Book now
                            </motion.a>
                        )}
                    </AnimatePresence>
                    <Link
                        to={loginHref}
                        aria-label="Sign in"
                        className={`nav-user flex h-11 w-11 items-center justify-center rounded-full border ${
                            light ? 'nav-user--light border-ink-text/12' : 'nav-user--dark border-white/25'
                        }`}
                    >
                        <UserIcon />
                    </Link>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className={`nav-burger flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border ${
                            light ? 'nav-burger--light border-ink-text/12' : 'nav-burger--dark border-white/25'
                        }`}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        <span
                            className={`h-px w-5 transition-all ${light ? 'bg-ink-text' : 'bg-white'} ${
                                open ? 'translate-y-[7px] rotate-45' : ''
                            }`}
                        />
                        <span
                            className={`h-px w-5 transition-all ${light ? 'bg-ink-text' : 'bg-white'} ${
                                open ? 'opacity-0' : ''
                            }`}
                        />
                        <span
                            className={`h-px w-5 transition-all ${light ? 'bg-ink-text' : 'bg-white'} ${
                                open ? '-translate-y-[7px] -rotate-45' : ''
                            }`}
                        />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-black/5 bg-page lg:hidden"
                    >
                        <ul className="flex max-h-[calc(100svh-72px)] flex-col overflow-y-auto px-4 py-4 sm:px-6">
                            <li>
                                <a
                                    href="/"
                                    onClick={() => setOpen(false)}
                                    className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                >
                                    Home
                                </a>
                            </li>
                            {[
                                { key: 'business', label: 'For business', items: BUSINESS },
                            ].map((group) => (
                                <li key={group.key} className="border-b border-ink-text/8">
                                    <button
                                        type="button"
                                        className="font-geist flex w-full items-center justify-between py-3.5 text-left text-[16px] text-ink-text"
                                        onClick={() =>
                                            setMobileAcc(mobileAcc === group.key ? null : group.key)
                                        }
                                        aria-expanded={mobileAcc === group.key}
                                    >
                                        {group.label}
                                        <Chevron open={mobileAcc === group.key} />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {mobileAcc === group.key && (
                                            <motion.ul
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden pb-2"
                                            >
                                                {group.items.map((item) => (
                                                    <li key={item.label}>
                                                        <a
                                                            href={item.href}
                                                            onClick={() => setOpen(false)}
                                                            className="font-geist block py-2.5 pl-3 text-[15px] text-ink-text/80"
                                                        >
                                                            {item.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </li>
                            ))}
                            <li>
                                <a
                                    href="/partners"
                                    onClick={() => setOpen(false)}
                                    className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                >
                                    For chauffeurs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/help"
                                    onClick={() => setOpen(false)}
                                    className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                >
                                    Help
                                </a>
                            </li>
                            <li>
                                <Link
                                    to="/journeys"
                                    onClick={() => setOpen(false)}
                                    className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                >
                                    Journeys
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/chauffeur"
                                    onClick={() => setOpen(false)}
                                    className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                >
                                    Chauffeur portal
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/account"
                                    onClick={() => setOpen(false)}
                                    className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                >
                                    Account
                                </Link>
                            </li>
                            <li className="mt-3 flex flex-col gap-3 pb-2">
                                <Link
                                    to={loginHref}
                                    onClick={() => setOpen(false)}
                                    className="font-geist flex items-center justify-center gap-2 rounded-full border border-ink-text/15 py-3 text-ink-text"
                                >
                                    <UserIcon />
                                    Sign in
                                </Link>
                                <a
                                    href="/#book"
                                    onClick={() => setOpen(false)}
                                    className="font-geist rounded-full bg-wine-700 py-3 text-center font-500 text-white"
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
