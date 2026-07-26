import { Link } from 'react-router-dom';

function BagIcon({ active }) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M7.5 8.5V7a4.5 4.5 0 0 1 9 0v1.5M5.5 9.5h13l-.8 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5.5 9.5Z"
                stroke="currentColor"
                strokeWidth={active ? 1.8 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function LiveIcon({ active }) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" />
            <path
                d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M7 7l1.4 1.4M15.6 15.6 17 17M17 7l-1.4 1.4M8.4 15.6 7 17"
                stroke="currentColor"
                strokeWidth={active ? 1.8 : 1.5}
                strokeLinecap="round"
            />
        </svg>
    );
}

function CarIcon({ active }) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4.5 15.5v2.2c0 .4.3.8.8.8h1.4c.4 0 .8-.4.8-.8v-.7h9v.7c0 .4.3.8.8.8h1.4c.4 0 .8-.4.8-.8v-2.2M4.5 15.5l1.2-5.2c.2-.8.9-1.4 1.7-1.4h9.2c.8 0 1.5.6 1.7 1.4l1.2 5.2M7.5 9l.8-2.2c.2-.6.8-1 1.4-1h4.6c.6 0 1.2.4 1.4 1L16.5 9"
                stroke="currentColor"
                strokeWidth={active ? 1.8 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="7.8" cy="15.5" r="1" fill="currentColor" />
            <circle cx="16.2" cy="15.5" r="1" fill="currentColor" />
        </svg>
    );
}

function UserIcon({ active }) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth={active ? 1.8 : 1.5} />
            <path
                d="M5.5 19.25c1.6-3.1 4-4.75 6.5-4.75s4.9 1.65 6.5 4.75"
                stroke="currentColor"
                strokeWidth={active ? 1.8 : 1.5}
                strokeLinecap="round"
            />
        </svg>
    );
}

const ICONS = {
    offers: BagIcon,
    current: LiveIcon,
    rides: CarIcon,
    profile: UserIcon,
};

/**
 * Glass bottom tab bar — mobile chauffeur portal only.
 */
export default function ChauffeurBottomNav({ tabs, activeId, counts = {} }) {
    return (
        <nav
            aria-label="Chauffeur"
            className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
        >
            <div className="mx-auto flex max-w-lg items-stretch justify-between gap-1 rounded-[28px] border border-white/60 bg-white/80 px-2 py-2 shadow-[0_12px_40px_rgba(20,6,12,0.12)] backdrop-blur-xl">
                {tabs.map((tab) => {
                    const selected = tab.id === activeId;
                    const Icon = ICONS[tab.id] || BagIcon;
                    const short =
                        tab.id === 'current' ? 'Live' : tab.id === 'offers' ? 'Offers' : tab.id === 'rides' ? 'Rides' : 'Profile';
                    const n = counts[tab.id];
                    return (
                        <Link
                            key={tab.id}
                            to={tab.path}
                            aria-current={selected ? 'page' : undefined}
                            className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 transition ${
                                selected ? 'bg-page text-ink-text' : 'text-muted'
                            }`}
                        >
                            <span className="relative">
                                <Icon active={selected} />
                                {n != null && n > 0 && tab.id !== 'profile' ? (
                                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine-700 px-1 text-[9px] font-600 text-white">
                                        {n > 9 ? '9+' : n}
                                    </span>
                                ) : null}
                            </span>
                            <span className="font-geist text-[11px] font-500 tracking-[0.01em]">{short}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
