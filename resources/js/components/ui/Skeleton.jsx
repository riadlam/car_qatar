function Bar({ className = '' }) {
    return <div className={`animate-pulse rounded-full bg-[#eceae6] ${className}`} />;
}

function Card({ children, className = '' }) {
    return (
        <div className={`rounded-2xl border border-[#e8e6e1] bg-white p-5 sm:p-6 ${className}`}>{children}</div>
    );
}

function ListCards({ count = 3 }) {
    return (
        <div className="flex flex-col gap-4" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <Card key={i}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <Bar className="h-3 w-24" />
                            <Bar className="mt-3 h-4 w-2/3" />
                            <Bar className="mt-2 h-3 w-1/2" />
                        </div>
                        <Bar className="h-6 w-16" />
                    </div>
                    <Bar className="mt-5 h-3 w-full" />
                    <Bar className="mt-2 h-3 w-4/5" />
                </Card>
            ))}
        </div>
    );
}

function PageBody() {
    return (
        <div className="mx-auto w-full max-w-[1440px] px-4 pt-8 sm:px-6 lg:px-10 xl:px-14" aria-hidden="true">
            <Bar className="h-8 w-40" />
            <Bar className="mt-3 h-4 w-64" />
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
                <Card>
                    <Bar className="h-4 w-1/3" />
                    <Bar className="mt-4 h-3 w-full" />
                    <Bar className="mt-2 h-3 w-5/6" />
                    <Bar className="mt-2 h-3 w-2/3" />
                </Card>
                <Card>
                    <Bar className="h-4 w-1/4" />
                    <Bar className="mt-4 h-3 w-full" />
                    <Bar className="mt-2 h-3 w-4/5" />
                    <Bar className="mt-2 h-3 w-1/2" />
                </Card>
            </div>
        </div>
    );
}

function LiveBody() {
    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]" aria-hidden="true">
            <div className="min-h-[280px] animate-pulse rounded-2xl border border-[#e8e6e1] bg-[#eceae6] lg:min-h-[480px]" />
            <Card>
                <Bar className="h-3 w-24" />
                <Bar className="mt-3 h-6 w-2/3" />
                <Bar className="mt-6 h-3 w-full" />
                <Bar className="mt-2 h-3 w-4/5" />
                <div className="mt-6 grid grid-cols-2 gap-2">
                    <Bar className="h-11" />
                    <Bar className="h-11" />
                </div>
            </Card>
        </div>
    );
}

function ProfileBody() {
    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" aria-hidden="true">
            <Card>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 animate-pulse rounded-full bg-[#eceae6]" />
                    <div className="min-w-0 flex-1">
                        <Bar className="h-5 w-40" />
                        <Bar className="mt-2 h-3 w-56" />
                    </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Bar className="h-10" />
                    <Bar className="h-10" />
                    <Bar className="h-10 sm:col-span-2" />
                </div>
            </Card>
            <Card>
                <Bar className="h-5 w-24" />
                <Bar className="mt-4 h-4 w-2/3" />
                <Bar className="mt-2 h-3 w-1/2" />
                <Bar className="mt-8 h-5 w-28" />
                <Bar className="mt-4 h-10 w-full" />
            </Card>
        </div>
    );
}

function InlineBody() {
    return (
        <div className="flex flex-col gap-2 py-1" aria-hidden="true">
            <Bar className="h-3 w-3/4" />
            <Bar className="h-3 w-1/2" />
        </div>
    );
}

/**
 * Light pulse placeholder for API waits. Use this instead of “Loading…” text.
 */
export default function Skeleton({ variant = 'inline', className = '' }) {
    const labelled = (
        <span className="sr-only">Loading</span>
    );

    if (variant === 'page') {
        return (
            <div className={`min-h-screen bg-page ${className}`} role="status" aria-live="polite">
                {labelled}
                <PageBody />
            </div>
        );
    }

    if (variant === 'list') {
        return (
            <div className={className} role="status" aria-live="polite">
                {labelled}
                <ListCards />
            </div>
        );
    }

    if (variant === 'profile') {
        return (
            <div className={className} role="status" aria-live="polite">
                {labelled}
                <ProfileBody />
            </div>
        );
    }

    if (variant === 'live') {
        return (
            <div className={className} role="status" aria-live="polite">
                {labelled}
                <LiveBody />
            </div>
        );
    }

    return (
        <div className={className} role="status" aria-live="polite">
            {labelled}
            <InlineBody />
        </div>
    );
}
