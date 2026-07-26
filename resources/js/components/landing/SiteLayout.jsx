import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Shared site chrome — same Navbar + Footer as the home page.
 * Use this on every marketing page so we don’t duplicate the shell.
 */
export default function SiteLayout({
    children,
    afterMain = null,
    mainClassName = '',
    className = 'relative min-w-0 overflow-x-clip bg-page',
    showFooter = true,
}) {
    return (
        <div className={className}>
            <Navbar />
            <main className={mainClassName}>{children}</main>
            {afterMain}
            {showFooter ? <Footer /> : null}
        </div>
    );
}
