import SiteLayout from '../components/landing/SiteLayout';
import CtaHero from '../components/business/CtaHero';
import Services from '../components/business/Services';
import FromPlanningToPickup from '../components/business/FromPlanningToPickup';
import Arrival from '../components/business/Arrival';
import Quote from '../components/business/Quote';
import Help from '../components/business/Help';
import Awards from '../components/business/Awards';

export default function Business() {
    return (
        <SiteLayout mainClassName="relative z-[3]" afterMain={<Awards />}>
            <CtaHero />
            <Services />
            <FromPlanningToPickup />
            <Arrival />
            <Quote />
            <Help />
        </SiteLayout>
    );
}
