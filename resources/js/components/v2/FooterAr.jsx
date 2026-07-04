import { motion } from 'motion/react';
import LogoAr from './LogoAr';
import { toArabicDigits } from './data';

const COLS = [
    {
        title: 'الخدمات',
        links: ['من المطار إلى الفندق', 'من الفندق إلى المطار', 'استقبال في المطار', 'بالساعة في الدوحة'],
    },
    {
        title: 'مناطق الدوحة',
        links: ['مطار حمد الدولي', 'الخليج الغربي', 'اللؤلؤة', 'لوسيل', 'مشيرب'],
    },
    {
        title: 'تواصل',
        links: ['concierge@almajd.com', '+974 4000 0000', 'الدوحة، قطر'],
    },
];

export default function FooterAr() {
    const year = toArabicDigits(new Date().getFullYear());

    return (
        <footer className="relative overflow-hidden border-t border-gold-500/10 bg-ink pt-14 pb-8 text-right sm:pt-20 sm:pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="sm:col-span-2 lg:col-span-1"
                    >
                        <LogoAr />
                        <p className="mt-5 max-w-xs font-ar-body text-lg leading-loose text-ivory/55 sm:mt-6">
                            نقلٌ خاصٌّ بسائق بين فنادق الدوحة ومطار حمد الدولي — لضيوف قطر.
                        </p>
                        <div className="mt-6 flex gap-3 sm:mt-7">
                            {['in', 'ig', 'x'].map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/15 font-sans text-xs uppercase text-ivory/60 transition hover:border-gold-500/60 hover:text-gold-400"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {COLS.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-ar-kufi text-[15px] text-gold-400">{col.title}</h4>
                            <ul className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5">
                                {col.links.map((l) => (
                                    <li key={l}>
                                        <a href="#" className="font-ar-body text-[15px] text-ivory/55 transition-colors hover:text-ivory">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 h-px w-full hairline sm:mt-16" />

                <div className="mt-6 flex flex-col items-center justify-between gap-4 text-center sm:mt-8 sm:flex-row-reverse">
                    <p className="font-ar-kufi text-[12px] text-ivory/40">© {year} المجد · للنقل الفاخر · قطر</p>
                    <div className="flex flex-wrap justify-center gap-5 sm:gap-7">
                        {['الشروط', 'الخصوصية', 'إشعار قانوني'].map((l) => (
                            <a key={l} href="#" className="font-ar-kufi text-[12px] text-ivory/40 transition hover:text-ivory/70">
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute -bottom-10 left-1/2 -z-0 hidden -translate-x-1/2 select-none font-ar-display text-[20vw] text-white/[0.015] sm:block sm:-bottom-20">
                المجد
            </div>
        </footer>
    );
}
