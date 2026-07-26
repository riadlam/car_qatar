import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Logo from '../landing/Logo';

const SERVICES = [
    { label: 'City-to-City rides', href: '/#services' },
    { label: 'Chauffeur hailing', href: '/#services' },
    { label: 'Airport transfers', href: '/#services' },
    { label: 'Hourly hire', href: '/#services' },
    { label: 'Chauffeur service', href: '/#services' },
    { label: 'Limousine service', href: '/#services' },
];

const BUSINESS = [
    { label: 'Overview', href: '/business' },
    { label: 'Corporations', href: '/corporations' },
    { label: 'Travel agencies', href: '/travel-agencies' },
    { label: 'Strategic partnerships', href: '/strategic-partnerships' },
];

const DURATION_LABELS = {
    '2': '2 hours (80 km included)',
    '3': '3 hours (100 km included)',
    '4': '4 hours (120 km included)',
    '6': '6 hours (160 km included)',
    '8': '8 hours (200 km included)',
    '12': '12 hours (250 km included)',
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
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function ArrowRightIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <path
                d="M6 12H18.5M18.5 12L12.5 6M18.5 12L12.5 18"
                stroke="#8F9499"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DateTimeIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 13.25C4.69036 13.25 5.25 12.6904 5.25 12C5.25 11.3096 4.69036 10.75 4 10.75C3.30964 10.75 2.75 11.3096 2.75 12C2.75 12.6904 3.30964 13.25 4 13.25ZM6.75 12C6.75 13.5188 5.51878 14.75 4 14.75C2.48122 14.75 1.25 13.5188 1.25 12C1.25 10.4812 2.48122 9.25 4 9.25C5.51878 9.25 6.75 10.4812 6.75 12Z"
                fill="#8F9499"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.5303 11.4697C22.8232 11.7626 22.8232 12.2374 22.5303 12.5303L19.5303 15.5303C19.2374 15.8232 18.7626 15.8232 18.4697 15.5303C18.1768 15.2374 18.1768 14.7626 18.4697 14.4697L20.1893 12.75H9C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H20.1893L18.4697 9.53033C18.1768 9.23744 18.1768 8.76256 18.4697 8.46967C18.7626 8.17678 19.2374 8.17678 19.5303 8.46967L22.5303 11.4697Z"
                fill="#8F9499"
            />
        </svg>
    );
}

function formatTripDate(dateStr) {
    const d = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
    if (Number.isNaN(d.getTime())) {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
        });
    }
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
    });
}

function formatTripTime(timeStr) {
    const raw = timeStr || '22:15';
    const [hRaw, mRaw = '00'] = raw.split(':');
    let h = Number(hRaw);
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${mRaw} ${period}`;
}

/**
 * Booking-only header: trip chips + hamburger (menu like tablet, all breakpoints).
 */
export default function BookingHeader() {
    const [params] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [mobileAcc, setMobileAcc] = useState(null);

    const trip = useMemo(() => {
        const mode = params.get('mode') || 'hourly';
        const pickup = params.get('pickup') || 'Embassy Of Algeria';
        const dropoff = params.get('dropoff') || '';
        const duration = params.get('duration') || '2';
        const destination =
            mode === 'transfer' && dropoff
                ? dropoff
                : DURATION_LABELS[duration] || DURATION_LABELS['2'];
        return {
            pickup,
            destination,
            dateLabel: formatTripDate(params.get('date')),
            timeLabel: formatTripTime(params.get('time') || '22:15'),
        };
    }, [params]);

    useEffect(() => {
        document.body.classList.toggle('menu-open', open);
        return () => document.body.classList.remove('menu-open');
    }, [open]);

    const loginHref = `/login?from=${encodeURIComponent(location.pathname + location.search)}`;

    const editTrip = () => navigate('/#book');

    const chipBtn =
        'font-geist inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-full border border-[#e0ddd6] bg-white px-3 py-2 text-left transition hover:border-[#c9c5bc] hover:bg-page sm:gap-2 sm:px-3.5 sm:py-2.5';
    const chipText = 'max-w-[140px] truncate text-[13px] leading-5 font-500 text-ink-text sm:max-w-[200px] sm:text-[14px] lg:max-w-[240px]';

    return (
        <header className={`fixed inset-x-0 top-0 z-50 border-b border-[#e8e6e1] bg-page/95 text-ink-text backdrop-blur-xl ${
            location.pathname.startsWith('/booking/checkout') ? 'hidden lg:block' : ''
        }`}>
            <div className="relative mx-auto flex h-[72px] w-full max-w-[100vw] items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:h-[80px] lg:px-8">
                <a href="/" aria-label="Go to Homepage" className="relative z-10 shrink-0">
                    <Logo compact inverted />
                </a>

                <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-hidden sm:gap-3">
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
                        <button type="button" onClick={editTrip} className={chipBtn} title={`${trip.pickup} → ${trip.destination}`}>
                            <span className={chipText} title={trip.pickup}>
                                {trip.pickup}
                            </span>
                            <ArrowRightIcon />
                            <span className={chipText} title={trip.destination}>
                                {trip.destination}
                            </span>
                        </button>

                        <button type="button" onClick={editTrip} className={`${chipBtn} hidden sm:inline-flex`} title={`${trip.dateLabel}, ${trip.timeLabel}`}>
                            <span className="shrink-0 whitespace-nowrap text-[13px] leading-5 font-500 text-ink-text sm:text-[14px]" title={trip.dateLabel}>
                                {trip.dateLabel}
                            </span>
                            <DateTimeIcon />
                            <span className="shrink-0 whitespace-nowrap text-[13px] leading-5 font-500 text-ink-text sm:text-[14px]" title={trip.timeLabel}>
                                {trip.timeLabel}
                            </span>
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="nav-burger nav-burger--light relative z-10 flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-ink-text/12"
                    aria-label="Toggle menu"
                    aria-expanded={open}
                >
                    <span className={`h-px w-5 bg-ink-text transition-all ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
                    <span className={`h-px w-5 bg-ink-text transition-all ${open ? 'opacity-0' : ''}`} />
                    <span className={`h-px w-5 bg-ink-text transition-all ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
                </button>
            </div>

            {/* Date/time row on very small screens */}
            <div className="flex justify-center border-t border-[#eeebe4] px-3 pb-2.5 sm:hidden">
                <button type="button" onClick={editTrip} className={`${chipBtn} w-full max-w-md justify-center`}>
                    <span className="text-[13px] font-500 text-ink-text">{trip.dateLabel}</span>
                    <DateTimeIcon />
                    <span className="text-[13px] font-500 text-ink-text">{trip.timeLabel}</span>
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-black/5 bg-page"
                    >
                        <ul className="mx-auto flex max-h-[calc(100svh-72px)] max-w-lg flex-col overflow-y-auto px-4 py-4 sm:px-6 lg:max-w-xl">
                            {[
                                { key: 'services', label: 'Our services', items: SERVICES },
                                { key: 'business', label: 'For business', items: BUSINESS },
                            ].map((group) => (
                                <li key={group.key} className="border-b border-ink-text/8">
                                    <button
                                        type="button"
                                        className="font-geist flex w-full cursor-pointer items-center justify-between py-3.5 text-left text-[16px] text-ink-text"
                                        onClick={() => setMobileAcc(mobileAcc === group.key ? null : group.key)}
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
                                    Edit trip
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
