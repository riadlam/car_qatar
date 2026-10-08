import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useChangeLanguage } from '../../hooks/useChangeLanguage';
import {
    canAccessChauffeurPortal,
    isCustomer,
    isPartnerAdmin,
    chauffeurStatusLabel,
} from '../../utils/roles';
import { fetchContactChannels } from '../../api/catalog';

import BookingHeader from '../booking/BookingHeader';

/** Pages whose first viewport is light (title-above-image SEO heroes) */
const LIGHT_TOP_PATHS = [
    '/corporations',
    '/travel-agencies',
    '/strategic-partnerships',
    '/business-solutions',
    '/about-us',
    '/contact',
    '/help',
    '/account',
    '/journeys',
    '/chauffeur',
    '/partner',
];

const CONTACT_KEY_TO_I18N = {
    call_us: 'contact.callUs',
    whatsapp: 'contact.whatsapp',
    leave_message: 'contact.leaveMessage',
    email: 'contact.email',
};

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
                d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 9 7.34315 9 9C9 10.3431 10.6569 12 12 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function isFormChannel(item) {
    return item?.type === 'form' || typeof item?.onSelect === 'function';
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

    const itemClass = `font-geist block w-full rounded-md px-3 py-2.5 text-start text-[15px] leading-5 whitespace-nowrap transition ${
        light ? 'text-ink-text hover:bg-black/5' : 'text-white hover:bg-white/10'
    }`;

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
                            align === 'end' ? 'end-0' : 'start-0'
                        } ${light ? 'nav-dd--light' : 'nav-dd--dark'}`}
                    >
                        {items.map((item) => {
                            if (isFormChannel(item)) {
                                return (
                                    <li key={item.key || item.label}>
                                        <button
                                            type="button"
                                            className={itemClass}
                                            onClick={() => {
                                                setOpen(false);
                                                item.onSelect?.();
                                            }}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                );
                            }
                            const href = item.href || '#';
                            const external =
                                /^https?:/i.test(href) ||
                                href.startsWith('mailto:') ||
                                href.startsWith('tel:');
                            return (
                                <li key={item.key || item.label}>
                                    <a
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        {...(external && /^https?:/i.test(href)
                                            ? { target: '_blank', rel: 'noreferrer' }
                                            : {})}
                                        className={itemClass}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    );
}

export default function Navbar() {
    const { t, i18n } = useTranslation('common');
    const changeLanguage = useChangeLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [pastHero, setPastHero] = useState(false);
    const [open, setOpen] = useState(false);
    const [mobileAcc, setMobileAcc] = useState(null);
    const [contactUs, setContactUs] = useState([]);
    const [loggingOut, setLoggingOut] = useState(false);

    const exploreQatar = useMemo(
        () => [
            { label: t('explore.iconicPlaces'), href: '/iconic-places' },
            { label: t('explore.hotels'), href: '/hotels' },
            { label: t('explore.malls'), href: '/malls' },
            { label: t('explore.beaches'), href: '/beaches' },
            { label: t('explore.restaurants'), href: '/restaurants' },
        ],
        [t],
    );

    const contactFallback = useMemo(
        () => [
            { key: 'call_us', label: t('contact.callUs'), href: 'tel:+97455045333', type: 'phone' },
            { key: 'whatsapp', label: t('contact.whatsapp'), href: 'https://wa.me/97455045333', type: 'whatsapp' },
            { key: 'leave_message', label: t('contact.leaveMessage'), href: '/contact', type: 'link' },
            { key: 'email', label: t('contact.email'), href: 'mailto:Mohammed.mashhour@almajdluxurytransport.com', type: 'email' },
        ],
        [t],
    );

    const langItems = useMemo(
        () => [
            {
                key: 'en',
                label: t('nav.english'),
                onSelect: () => void changeLanguage('en'),
                type: 'form',
            },
            {
                key: 'ar',
                label: t('nav.arabic'),
                onSelect: () => void changeLanguage('ar'),
                type: 'form',
            },
        ],
        [t, changeLanguage],
    );

    const langLabel = i18n.language?.startsWith('ar') ? t('nav.arabic') : t('nav.english');

    const onLogout = async () => {
        setLoggingOut(true);
        setOpen(false);
        try {
            await logout();
        } finally {
            navigate('/login', { replace: true });
            setLoggingOut(false);
        }
    };
    const isBooking = location.pathname.startsWith('/booking');
    const isChauffeurPortal = location.pathname.startsWith('/chauffeur');
    const lightTop =
        LIGHT_TOP_PATHS.includes(location.pathname) ||
        location.pathname.startsWith('/journeys') ||
        location.pathname.startsWith('/chauffeur') ||
        location.pathname.startsWith('/partner') ||
        location.pathname.startsWith('/pay');
    const profileLabel =
        user?.first_name?.trim() ||
        user?.name?.split?.(' ')?.[0] ||
        t('nav.account');

    const mapChannels = useCallback(
        (channels) =>
            channels.map((c) => {
                const isLeaveMessage = c.key === 'leave_message' || c.type === 'form';
                const i18nKey = CONTACT_KEY_TO_I18N[c.key];
                return {
                    key: c.key,
                    label: i18nKey ? t(i18nKey) : c.label,
                    href: isLeaveMessage ? '/contact' : c.href || '#',
                    type: isLeaveMessage ? 'link' : c.type || 'link',
                };
            }),
        [t],
    );

    useEffect(() => {
        setContactUs(mapChannels(contactFallback));
        let cancelled = false;
        fetchContactChannels()
            .then((channels) => {
                if (cancelled || !Array.isArray(channels) || !channels.length) return;
                setContactUs(mapChannels(channels));
            })
            .catch(() => {
                if (!cancelled) setContactUs(mapChannels(contactFallback));
            });
        return () => {
            cancelled = true;
        };
    }, [mapChannels, contactFallback]);

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
        <>
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
                    <a href="/" aria-label={t('nav.home')} className="relative z-10 shrink-0">
                        <Logo compact inverted={light} />
                    </a>

                    <nav className="relative z-10 hidden lg:block" aria-label={t('nav.menu')}>
                        <ul className="m-0 flex list-none items-center gap-1 p-0 xl:gap-2">
                            <li>
                                <a
                                    href="/#book"
                                    className={`font-geist inline-flex rounded-full px-2 py-1.5 text-[16px] leading-6 font-400 tracking-[0.15px] transition ${
                                        light
                                            ? 'text-ink-text/85 hover:text-ink-text'
                                            : 'text-white/90 hover:text-white'
                                    }`}
                                >
                                    {t('nav.book')}
                                </a>
                            </li>
                            <NavDropdown label={t('nav.exploreQatar')} items={exploreQatar} light={light} />
                            <li>
                                <a
                                    href="/business-solutions"
                                    className={`font-geist inline-flex rounded-full px-2 py-1.5 text-[16px] leading-6 font-400 tracking-[0.15px] transition ${
                                        light
                                            ? 'text-ink-text/85 hover:text-ink-text'
                                            : 'text-white/90 hover:text-white'
                                    }`}
                                >
                                    {t('footer.businessSolutions')}
                                </a>
                            </li>
                            <NavDropdown label={t('nav.contactUs')} items={contactUs} light={light} />
                            <li>
                                <a
                                    href="/about-us"
                                    className={`font-geist inline-flex rounded-full px-2 py-1.5 text-[16px] leading-6 font-400 tracking-[0.15px] transition ${
                                        light
                                            ? 'text-ink-text/85 hover:text-ink-text'
                                            : 'text-white/90 hover:text-white'
                                    }`}
                                >
                                    {t('nav.aboutUs')}
                                </a>
                            </li>
                            <NavDropdown label={langLabel} items={langItems} light={light} align="end" />
                            <li className="ms-1 flex items-center gap-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/account"
                                            data-cy="profile-button"
                                            className={`nav-signin font-geist inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[16px] leading-6 font-500 whitespace-nowrap transition ${
                                                light
                                                    ? 'nav-signin--light border-ink-text/12'
                                                    : 'nav-signin--dark border-white/25'
                                            }`}
                                        >
                                            <UserIcon />
                                            {profileLabel}
                                            {chauffeurStatusLabel(user) && user.chauffeur_status !== 'active' ? (
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[12px] font-500 text-amber-900">
                                                    {chauffeurStatusLabel(user)}
                                                </span>
                                            ) : null}
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={onLogout}
                                            disabled={loggingOut}
                                            className={`font-geist inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 py-2 text-[15px] leading-6 font-500 whitespace-nowrap transition disabled:opacity-60 ${
                                                light
                                                    ? 'border-ink-text/12 text-ink-text hover:bg-ink-text/5'
                                                    : 'border-white/25 text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {loggingOut ? t('actions.loading') : t('nav.signOut')}
                                        </button>
                                    </>
                                ) : (
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
                                        {t('nav.signIn')}
                                    </Link>
                                )}
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
                                            className="font-geist ms-1 inline-flex rounded-full bg-wine-700 px-4 py-2 text-[16px] leading-6 font-500 whitespace-nowrap text-white transition hover:bg-wine-600"
                                        >
                                            {t('actions.bookNow')}
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
                                    {t('actions.bookNow')}
                                </motion.a>
                            )}
                        </AnimatePresence>
                        <Link
                            to={isAuthenticated ? '/account' : loginHref}
                            aria-label={isAuthenticated ? t('nav.account') : t('nav.signIn')}
                            className={`nav-user font-geist flex h-11 items-center justify-center gap-1.5 rounded-full border px-3 text-[13px] font-500 whitespace-nowrap ${
                                light ? 'nav-user--light border-ink-text/12' : 'nav-user--dark border-white/25'
                            }`}
                        >
                            <UserIcon />
                            <span>{isAuthenticated ? profileLabel : t('nav.signIn')}</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            className={`nav-burger flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border ${
                                light ? 'nav-burger--light border-ink-text/12' : 'nav-burger--dark border-white/25'
                            }`}
                            aria-label={t('nav.menu')}
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
                                        href="/#book"
                                        onClick={() => setOpen(false)}
                                        className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                    >
                                        {t('nav.book')}
                                    </a>
                                </li>
                                {[
                                    { key: 'explore', label: t('nav.exploreQatar'), items: exploreQatar },
                                    { key: 'lang', label: langLabel, items: langItems },
                                ].map((group) => (
                                    <li key={group.key} className="border-b border-ink-text/8">
                                        <button
                                            type="button"
                                            className="font-geist flex w-full items-center justify-between py-3.5 text-start text-[16px] text-ink-text"
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
                                                        <li key={item.key || item.label}>
                                                            {isFormChannel(item) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpen(false);
                                                                        item.onSelect?.();
                                                                    }}
                                                                    className="font-geist block w-full py-2.5 ps-3 text-start text-[15px] text-ink-text/80"
                                                                >
                                                                    {item.label}
                                                                </button>
                                                            ) : (
                                                                <a
                                                                    href={item.href}
                                                                    onClick={() => setOpen(false)}
                                                                    className="font-geist block py-2.5 ps-3 text-[15px] text-ink-text/80"
                                                                >
                                                                    {item.label}
                                                                </a>
                                                            )}
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                ))}
                                <li>
                                    <a
                                        href="/business-solutions"
                                        onClick={() => setOpen(false)}
                                        className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                    >
                                        {t('footer.businessSolutions')}
                                    </a>
                                </li>
                                {[
                                    { key: 'contact', label: t('nav.contactUs'), items: contactUs },
                                ].map((group) => (
                                    <li key={group.key} className="border-b border-ink-text/8">
                                        <button
                                            type="button"
                                            className="font-geist flex w-full items-center justify-between py-3.5 text-start text-[16px] text-ink-text"
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
                                                        <li key={item.key || item.label}>
                                                            {isFormChannel(item) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpen(false);
                                                                        item.onSelect?.();
                                                                    }}
                                                                    className="font-geist block w-full py-2.5 ps-3 text-start text-[15px] text-ink-text/80"
                                                                >
                                                                    {item.label}
                                                                </button>
                                                            ) : (
                                                                <a
                                                                    href={item.href}
                                                                    onClick={() => setOpen(false)}
                                                                    className="font-geist block py-2.5 ps-3 text-[15px] text-ink-text/80"
                                                                >
                                                                    {item.label}
                                                                </a>
                                                            )}
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </li>
                                ))}
                                <li>
                                    <a
                                        href="/about-us"
                                        onClick={() => setOpen(false)}
                                        className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                    >
                                        {t('nav.aboutUs')}
                                    </a>
                                </li>
                                {isCustomer(user) ? (
                                    <li>
                                        <Link
                                            to="/journeys"
                                            onClick={() => setOpen(false)}
                                            className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                        >
                                            {t('nav.journeys')}
                                        </Link>
                                    </li>
                                ) : null}
                                {isAuthenticated && chauffeurStatusLabel(user) && user.chauffeur_status !== 'active' ? (
                                    <li>
                                        <p className="font-geist m-0 border-b border-ink-text/8 py-3.5 text-[16px] font-500 text-amber-900">
                                            {chauffeurStatusLabel(user)}
                                        </p>
                                    </li>
                                ) : null}
                                {canAccessChauffeurPortal(user) ? (
                                    <li>
                                        <Link
                                            to="/chauffeur"
                                            onClick={() => setOpen(false)}
                                            className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                        >
                                            {t('nav.chauffeurPortal')}
                                        </Link>
                                    </li>
                                ) : null}
                                {isPartnerAdmin(user) ? (
                                    <li>
                                        <Link
                                            to="/partner"
                                            onClick={() => setOpen(false)}
                                            className="font-geist block border-b border-ink-text/8 py-3.5 text-[16px] text-ink-text"
                                        >
                                            {t('nav.partnerPortal')}
                                        </Link>
                                    </li>
                                ) : null}
                                <li className="mt-3 flex flex-col gap-3 pb-2">
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/account"
                                                onClick={() => setOpen(false)}
                                                className="font-geist flex items-center justify-center gap-2 rounded-full border border-ink-text/15 py-3 text-ink-text"
                                            >
                                                <UserIcon />
                                                {profileLabel}
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={onLogout}
                                                disabled={loggingOut}
                                                className="font-geist flex cursor-pointer items-center justify-center rounded-full border border-ink-text/15 py-3 text-ink-text disabled:opacity-60"
                                            >
                                                {loggingOut ? t('actions.loading') : t('nav.signOut')}
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to={loginHref}
                                            onClick={() => setOpen(false)}
                                            className="font-geist flex items-center justify-center gap-2 rounded-full border border-ink-text/15 py-3 text-ink-text"
                                        >
                                            <UserIcon />
                                            {t('nav.signIn')}
                                        </Link>
                                    )}
                                    <a
                                        href="/#book"
                                        onClick={() => setOpen(false)}
                                        className="font-geist rounded-full bg-wine-700 py-3 text-center font-500 text-white"
                                    >
                                        {t('actions.bookNow')}
                                    </a>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
}
