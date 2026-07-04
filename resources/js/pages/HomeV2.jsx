import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import Intro from '../components/v2/Intro';
import NavbarAr from '../components/v2/NavbarAr';
import HeroAr from '../components/v2/HeroAr';
import MarqueeAr from '../components/v2/MarqueeAr';
import GlobalReachAr from '../components/v2/GlobalReachAr';
import ServicesAr from '../components/v2/ServicesAr';
import ExperienceAr from '../components/v2/ExperienceAr';
import FleetAr from '../components/v2/FleetAr';
import ExcellenceAr from '../components/v2/ExcellenceAr';
import CtaBandAr from '../components/v2/CtaBandAr';
import FooterAr from '../components/v2/FooterAr';
import VersionSwitcher from '../components/v2/VersionSwitcher';

export default function HomeV2() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        const html = document.documentElement;
        const prevLang = html.getAttribute('lang');
        const prevDir = html.getAttribute('dir');
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        return () => {
            if (prevLang) html.setAttribute('lang', prevLang);
            if (prevDir) html.setAttribute('dir', prevDir);
            else html.removeAttribute('dir');
        };
    }, []);

    return (
        <div dir="rtl" lang="ar" className="relative overflow-x-hidden bg-ink">
            <Intro />
            <motion.div
                style={{ scaleX }}
                className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-right bg-gradient-to-l from-gold-300 via-gold-500 to-wine-600"
            />
            <NavbarAr />
            <main>
                <HeroAr />
                <MarqueeAr />
                <GlobalReachAr />
                <ServicesAr />
                <ExperienceAr />
                <FleetAr />
                <ExcellenceAr />
                <CtaBandAr />
            </main>
            <FooterAr />
            <VersionSwitcher current="v2" />
        </div>
    );
}
