import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CORP_IMG } from './assets';

const FAQS = [
    {
        q: 'How far in advance can I book a ride?',
        a: (
            <p>
                You can book months ahead or as little as 60 minutes before pickup. We recommend
                booking with lead time when possible. Free cancellation up to 1 hour before pickup;
                changes are available until 60 minutes before.
            </p>
        ),
    },
    {
        q: 'What vehicles does AL MAJD use?',
        a: (
            <p>
                We offer Business Class, First Class, and Business Van/SUV options. Vehicle
                availability varies by city. Browse illustrative options in our Help Center.
            </p>
        ),
    },
    {
        q: 'Which languages do the chauffeurs speak?',
        a: <p>Our chauffeurs speak English as well as the local language.</p>,
    },
    {
        q: 'Which payment options are available?',
        a: (
            <p>
                We accept Visa, Maestro, Mastercard, and American Express. Cash is not accepted.
                PayPal and Apple Pay are available in our apps. Corporate clients can also arrange
                monthly invoicing.
            </p>
        ),
    },
    {
        q: 'How does AL MAJD contribute to sustainable travel options?',
        a: (
            <p>
                Electric vehicles are incorporated into Business Class and First Class in many
                cities, and we automatically offset emissions with our carbon offset program —
                whichever vehicle class you choose.
            </p>
        ),
    },
];

function AccordionItem({ item, open, onToggle }) {
    return (
        <div className={`rounded-lg bg-[#f5f5f5] px-4 transition sm:px-5 ${open ? 'ring-1 ring-wine-700/30' : ''}`}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="font-geist flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[16px] font-500 tracking-[0.15px] text-ink-text sm:text-[18px]"
            >
                <span>{item.q}</span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                >
                    <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="font-geist pb-4 text-[15px] leading-6 font-400 text-muted sm:text-[16px]">
                            {item.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Faqs() {
    const [open, setOpen] = useState(0);

    return (
        <section className="bg-page px-6 py-16 lg:px-12 lg:py-20">
            <div className="mx-auto flex max-w-[1170px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[100px]">
                <div className="min-w-0 flex-1">
                    <h2 className="font-fragment m-0 mb-8 text-[28px] leading-9 font-400 tracking-[0.25px] text-ink-text sm:text-[32px] lg:text-[40px] lg:leading-[48px]">
                        Frequently asked questions
                    </h2>
                    <div className="flex flex-col gap-3">
                        {FAQS.map((item, i) => (
                            <AccordionItem
                                key={item.q}
                                item={item}
                                open={open === i}
                                onToggle={() => setOpen(open === i ? -1 : i)}
                            />
                        ))}
                    </div>
                </div>
                <div className="hidden w-full max-w-[420px] shrink-0 lg:block">
                    <img
                        src={CORP_IMG.faq}
                        alt=""
                        className="h-[548px] w-full rounded-2xl object-cover lg:h-[640px]"
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
}
