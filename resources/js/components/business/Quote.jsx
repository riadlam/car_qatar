export default function Quote() {
    return (
        <section className="bg-page px-6 pt-[224px] pb-16 text-center lg:px-12 lg:pt-[288px] lg:pb-20">
            <div className="mx-auto max-w-[1200px]">
                <blockquote className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-wine-400 sm:text-[40px] sm:leading-[48px] lg:text-[48px] lg:leading-[56px]">
                    &ldquo;I can always rely on AL MAJD to provide our customers with a reliable,
                    professional, and elegant service.&rdquo;
                </blockquote>
                <p className="font-geist mt-8 whitespace-pre-line text-[16px] leading-6 font-400 tracking-[0.15px] text-muted">
                    {'Witta Wette, Project Manager.\n American Express Meetings & Events'}
                </p>
            </div>
        </section>
    );
}
