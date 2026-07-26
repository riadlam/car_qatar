import SiteLayout from '../components/landing/SiteLayout';
import Hero from '../components/landing/Hero';
import Services from '../components/landing/Services';
import AppBand from '../components/landing/AppBand';
import Experience from '../components/landing/Experience';
import Excellence from '../components/landing/Excellence';
import Sustainability from '../components/landing/Sustainability';

export default function Home() {
    return (
        <SiteLayout className="relative min-w-0 overflow-x-hidden bg-page">
            <Hero />
            <Services />
            <AppBand />
            <Experience />
            <Excellence />
            <Sustainability />
        </SiteLayout>
    );
}
