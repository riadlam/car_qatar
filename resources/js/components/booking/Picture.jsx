export default function Picture({ lg, sm, alt = '', className = '', imgClassName = '' }) {
    return (
        <picture className={className}>
            <source media="(min-width: 1024px)" srcSet={lg} />
            <source media="(max-width: 1023px)" srcSet={sm} />
            <img src={sm || lg} alt={alt} className={imgClassName} draggable={false} />
        </picture>
    );
}
