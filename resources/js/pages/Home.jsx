import { motion, useScroll, useSpring } from 'motion/react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Marquee from '../components/landing/Marquee';
import GlobalReach from '../components/landing/GlobalReach';
import Services from '../components/landing/Services';
import Experience from '../components/landing/Experience';
import Fleet from '../components/landing/Fleet';
import Excellence from '../components/landing/Excellence';
import CtaBand from '../components/landing/CtaBand';
import Footer from '../components/landing/Footer';
import VersionSwitcher from '../components/v2/VersionSwitcher';

export default function Home() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div className="relative overflow-x-hidden bg-ink">
            <motion.div
                style={{ scaleX }}
                className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold-300 via-gold-500 to-wine-600"
            />
            <Navbar />
            <main>
                <Hero />
                <Marquee />
                <GlobalReach />
                <Services />
                <Experience />
                <Fleet />
                <Excellence />
                <CtaBand />
            </main>
            <Footer />
            <VersionSwitcher current="v1" />
        </div>
    );
}
