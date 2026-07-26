import Logo from './Logo';
import { IMG } from './motion';
import { useSectionAnim } from './useSectionAnim';

const COLS = [
    {
        title: 'Company',
        links: [
            { label: 'How AL MAJD works', href: '/#services' },
            { label: 'Career', href: '#' },
            { label: 'Press', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Green initiatives', href: '#' },
            { label: 'Become a chauffeur partner', href: '/partners' },
        ],
    },
    {
        title: 'AL MAJD for Business',
        id: 'business',
        links: [
            { label: 'Overview', href: '/business' },
            { label: 'Corporations', href: '/corporations' },
            { label: 'Travel agencies', href: '/travel-agencies' },
            { label: 'Strategic partnerships', href: '/strategic-partnerships' },
        ],
    },
    {
        title: 'Top cities',
        links: [
            { label: 'New York', href: '#' },
            { label: 'London', href: '#' },
            { label: 'Berlin', href: '#' },
            { label: 'Los Angeles', href: '#' },
            { label: 'Paris', href: '#' },
            { label: 'All cities', href: '#' },
        ],
    },
    {
        title: 'Explore',
        links: [
            { label: 'City-to-city rides', href: '#' },
            { label: 'Limousine service', href: '#' },
            { label: 'Chauffeur service', href: '/partners' },
            { label: 'Private car service', href: '#' },
            { label: 'Ground transportation', href: '#' },
            { label: 'Airport transfer', href: '#' },
            { label: 'All countries', href: '#' },
        ],
    },
    {
        title: 'City-to-City rides',
        links: [
            { label: 'New York - East Hampton', href: '#' },
            { label: 'Los Angeles - San Diego', href: '#' },
            { label: 'Miami - Palm Beach', href: '#' },
            { label: 'London - Bristol', href: '#' },
            { label: 'Dubai - Abu Dhabi', href: '#' },
            { label: 'Paris - Reims', href: '#' },
        ],
    },
];

const LEGAL = [
    { label: 'Terms', href: '#' },
    { label: 'Privacy policy', href: '#' },
    { label: 'Legal notice', href: '#' },
    { label: 'Accessibility', href: '#' },
];

const SOCIAL = [
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/blacklane-gmbh/',
        icon: (
            <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 17V13.5V10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 17V13.75M11 10V13.75M11 13.75C11 10 17 10 17 13.75V17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 7.01L7.01 6.99889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/blacklane/',
        icon: (
            <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" />
                <path d="M17.5 6.51L17.51 6.49889" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        label: 'Facebook',
        href: 'https://www.facebook.com/Blacklane',
        icon: (
            <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17 2H14C12.6739 2 11.4021 2.52678 10.4645 3.46447C9.52678 4.40215 9 5.67392 9 7V10H6V14H9V22H13V14H16L17 10H13V7C13 6.73478 13.1054 6.48043 13.2929 6.29289C13.4804 6.10536 13.7348 6 14 6H17V2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        label: 'TikTok',
        href: 'https://www.tiktok.com/@blacklane',
        icon: (
            <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18C11.6569 18 13 16.6569 13 15V6C13.3333 7 14.6 9 17 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        label: 'YouTube',
        href: 'https://www.youtube.com/user/blacklanelimo',
        icon: (
            <svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14 12L10.5 14V10L14 12Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path
                    d="M2 12.7075V11.2924C2 8.39705 2 6.94939 2.90549 6.01792C3.81099 5.08645 5.23656 5.04613 8.08769 4.96549C9.43873 4.92728 10.8188 4.8999 12 4.8999C13.1812 4.8999 14.5613 4.92728 15.9123 4.96549C18.7634 5.04613 20.189 5.08645 21.0945 6.01792C22 6.94939 22 8.39705 22 11.2924V12.7075C22 15.6028 22 17.0505 21.0945 17.982C20.189 18.9134 18.7634 18.9538 15.9123 19.0344C14.5613 19.0726 13.1812 19.1 12 19.1C10.8188 19.1 9.43873 19.0726 8.08769 19.0344C5.23656 18.9538 3.81099 18.9134 2.90549 17.982C2 17.0505 2 15.6028 2 12.7075Z"
                    stroke="currentColor"
                />
            </svg>
        ),
    },
];

export default function Footer() {
    const rootRef = useSectionAnim({ start: 'top 90%' });
    const year = new Date().getFullYear();

    return (
        <footer id="help" ref={rootRef} data-anim="section" className="bg-page">
            <div className="mx-auto max-w-[1170px] px-4 pt-10 pb-8 sm:px-6 lg:px-12 lg:pt-16">
                <div
                    data-anim="fade"
                    className="flex flex-col gap-6 border-b border-[#eef1f3] pb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                    <Logo inverted />
                    <div className="flex flex-wrap gap-3">
                        <a href="#" data-anim="badge" aria-label="Download on the App Store">
                            <img src={IMG.appStoreDark} alt="Download on the App Store" className="h-10 w-auto" />
                        </a>
                        <a href="#" data-anim="badge" aria-label="Get it on Google Play">
                            <img src={IMG.playStoreDark} alt="Get it on Google Play" className="h-10 w-auto" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 sm:py-10 lg:grid-cols-5 lg:gap-6">
                    {COLS.map((col) => (
                        <div key={col.title} id={col.id} data-anim="item">
                            <h4 className="font-geist text-[16px] leading-6 font-600 text-ink-text">
                                {col.title}
                            </h4>
                            <ul className="mt-4 space-y-2.5">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <a
                                            href={l.href}
                                            className="font-geist text-[14px] leading-5 text-ink-text/70 transition hover:text-ink-text"
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Blacklane LegalSection — copyright + links left, social right */}
                <div
                    data-anim="fade"
                    className="flex flex-col-reverse items-start gap-6 border-t border-[#eef1f3] py-5 text-ink-text sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
                >
                    <div className="flex w-full flex-col-reverse items-start gap-3 lg:w-auto lg:flex-row lg:items-center lg:gap-8">
                        <p className="font-geist m-0 text-[16px] leading-6 font-600 tracking-[0.15px] text-ink-text">
                            ©{year} AL MAJD
                        </p>
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                            {LEGAL.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    className="font-geist text-[14px] leading-5 text-ink-text/70 transition hover:text-ink-text"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-start gap-4 lg:w-auto lg:justify-end">
                        {SOCIAL.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className="flex items-center justify-center text-ink-text transition-colors duration-200 hover:text-[#6e6e73]"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
