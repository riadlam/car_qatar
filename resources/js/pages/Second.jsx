import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import Nav3 from '../components/v3/Nav3';
import Hero3 from '../components/v3/Hero3';
import Ticker3 from '../components/v3/Ticker3';
import Services3 from '../components/v3/Services3';
import Journey3 from '../components/v3/Journey3';
import Manifesto3 from '../components/v3/Manifesto3';
import Fleet3 from '../components/v3/Fleet3';
import Testimonials3 from '../components/v3/Testimonials3';
import Membership3 from '../components/v3/Membership3';
import Cta3 from '../components/v3/Cta3';
import Footer3 from '../components/v3/Footer3';
import VersionSwitcher from '../components/v2/VersionSwitcher';

export default function Second() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        const body = document.body;
        const prevBg = body.style.backgroundColor;
        const prevColor = body.style.color;
        body.style.backgroundColor = '#f7f2ea';
        body.style.color = '#14060c';
        return () => {
            body.style.backgroundColor = prevBg;
            body.style.color = prevColor;
        };
    }, []);

    return (
        <div className="editorial-page relative min-h-screen overflow-x-hidden bg-[#f7f2ea] text-[#14060c]">
            <motion.div
                style={{ scaleX }}
                className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#5b0520] via-[#c9a24b] to-[#e4cd8f]"
            />
            <Nav3 />
            <main className="relative z-0">
                <Hero3 />
                <Ticker3 />
                <Services3 />
                <Journey3 />
                <Manifesto3 />
                <Fleet3 />
                <Testimonials3 />
                <Membership3 />
                <Cta3 />
            </main>
            <Footer3 />
            <VersionSwitcher current="v3" />
        </div>
    );
}
