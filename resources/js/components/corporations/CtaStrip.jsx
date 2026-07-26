export default function CtaStrip({ label, href }) {
    return (
        <section className="bg-page px-6 py-6 text-center lg:px-12 lg:py-8">
            <a
                href={href}
                className="font-geist inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
            >
                {label}
            </a>
        </section>
    );
}
