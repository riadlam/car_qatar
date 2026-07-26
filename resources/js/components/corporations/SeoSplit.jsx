/**
 * SEO image + text split.
 * imageOn: 'left' = image then text (default); 'right' = text then image on desktop.
 */
export default function SeoSplit({
    title,
    body,
    bodyNode,
    bullets,
    image,
    alt,
    link,
    cta,
    imageOn = 'left',
}) {
    const imageFirst = imageOn !== 'right';

    const text = (
        <div className="w-full lg:w-1/2">
            <h2 className="font-fragment m-0 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] sm:leading-10 lg:text-[40px] lg:leading-[48px]">
                {title}
            </h2>
            {bodyNode ? (
                <div className="font-geist mt-4 text-[16px] leading-6 font-400 tracking-[0.15px] text-ink-text/80">
                    {bodyNode}
                </div>
            ) : (
                <p className="font-geist mt-4 m-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-ink-text/80">
                    {body}
                    {link ? (
                        <>
                            {' '}
                            <a
                                href={link.href}
                                className="font-500 text-wine-700 underline-offset-2 hover:underline"
                            >
                                {link.label}
                            </a>
                        </>
                    ) : null}
                </p>
            )}
            {bullets?.length ? (
                <ul className="font-geist mt-6 m-0 list-none space-y-3 p-0 text-[16px] leading-6 text-ink-text">
                    {bullets.map((b) => {
                        const key = typeof b === 'string' ? b : b.lead || b.text;
                        return (
                            <li key={key} className="flex gap-3">
                                <span className="mt-0.5 shrink-0 text-wine-700" aria-hidden="true">
                                    ✓
                                </span>
                                <span>
                                    {typeof b === 'string' ? (
                                        b
                                    ) : (
                                        <>
                                            {b.lead ? <strong className="font-500">{b.lead}</strong> : null}
                                            {b.lead ? ' ' : null}
                                            {b.text}
                                        </>
                                    )}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
            {cta ? (
                <a
                    href={cta.href}
                    className="font-geist mt-8 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-8 py-3 text-[16px] font-500 text-white transition hover:bg-wine-600"
                >
                    {cta.label}
                </a>
            ) : null}
        </div>
    );

    const media = (
        <div className="w-full lg:w-1/2">
            <img
                src={image}
                alt={alt}
                className="h-auto w-full rounded-2xl object-cover"
                loading="lazy"
            />
        </div>
    );

    return (
        <section className="bg-page px-6 py-12 lg:px-12 lg:py-16">
            <div className="mx-auto flex max-w-[1170px] flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
                {imageFirst ? (
                    <>
                        {media}
                        {text}
                    </>
                ) : (
                    <>
                        {text}
                        {media}
                    </>
                )}
            </div>
        </section>
    );
}
