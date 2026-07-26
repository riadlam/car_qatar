/**
 * Blacklane StaticPageContent “Scroll to top” parity (wine link instead of blue).
 */
export default function ScrollTop() {
    return (
        <section className="mx-auto w-full max-w-[1170px] px-6 py-8 lg:px-12">
            <div className="flex justify-center">
                <a
                    href="#top"
                    className="corp-scroll-top font-geist text-[16px] leading-6 font-500 tracking-[0.15px] text-wine-700"
                >
                    Scroll to top of the page
                </a>
            </div>
        </section>
    );
}
