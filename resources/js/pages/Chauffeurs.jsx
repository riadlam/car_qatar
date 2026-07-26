import SiteLayout from '../components/landing/SiteLayout';
import CtaHero from '../components/chauffeurs/CtaHero';
import PremiumClients from '../components/chauffeurs/PremiumClients';
import YourJourney from '../components/chauffeurs/YourJourney';
import Quote from '../components/chauffeurs/Quote';
import EasyOnboarding from '../components/chauffeurs/EasyOnboarding';
import SustainableFuture from '../components/chauffeurs/SustainableFuture';
import Questions from '../components/chauffeurs/Questions';
import Help from '../components/chauffeurs/Help';

export default function Chauffeurs() {
    return (
        <SiteLayout>
            <CtaHero />
            <PremiumClients />
            <YourJourney />
            <Quote />
            <EasyOnboarding />
            <SustainableFuture />
            <Questions />
            <Help />
        </SiteLayout>
    );
}
