import SiteLayout from '../components/landing/SiteLayout';
import Hero from '../components/landing/Hero';
import Experience from '../components/landing/Experience';

export default function Home() {
    return (
        <SiteLayout className="relative min-w-0 overflow-x-hidden bg-page">
            <Hero />
            <Experience />
        </SiteLayout>
    );
}
