export default function Breadcrumb() {
    return (
        <nav
            aria-label="Breadcrumb"
            className="bg-page px-6 py-4 text-center lg:px-12"
        >
            <ol className="font-geist m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0 text-[14px] leading-5 text-muted">
                <li>
                    <a href="/" className="text-ink-text transition hover:text-wine-700">
                        Home
                    </a>
                </li>
                <li aria-hidden="true" className="text-muted">
                    /
                </li>
                <li className="text-muted" aria-current="page">
                    Corporate Travel Solutions for Business Executives
                </li>
            </ol>
        </nav>
    );
}
