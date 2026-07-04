// AL MAJD — Version 3 (Editorial) — Qatar hotel ↔ airport transfers.
export const EASE = [0.22, 1, 0.36, 1];

export const rise = {
    hidden: { opacity: 0, y: 44 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export const fade = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

export const stagger = (delay = 0, gap = 0.1) => ({
    hidden: {},
    show: { transition: { delayChildren: delay, staggerChildren: gap } },
});

export const clipReveal = {
    hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
    show: {
        clipPath: 'inset(0 0 0% 0)',
        opacity: 1,
        transition: { duration: 1, ease: EASE },
    },
};

export const IMG = {
    hero: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=80',
    heroWide: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80',
    airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    meet: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    hourly: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
    interior: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1400&q=80',
    fleet1: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80',
    fleet2: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1400&q=80',
    fleet3: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80',
    manifesto: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=2000&q=80',
    cta: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80',
};

export const NAV_LINKS = [
    { label: 'Services', href: '#services' },
    { label: 'Journey', href: '#journey' },
    { label: 'Fleet', href: '#fleet' },
    { label: 'Membership', href: '#membership' },
];

export const SERVICES = [
    {
        no: '01',
        tag: 'Arrival',
        title: 'Airport to hotel',
        copy: 'Land at Hamad International Airport and ride straight to your hotel. Flight-tracked pickup with complimentary wait time.',
        img: IMG.airport,
    },
    {
        no: '02',
        tag: 'Departure',
        title: 'Hotel to airport',
        copy: 'Your chauffeur collects you from the lobby, handles luggage, and gets you to HIA on time — calm and unhurried.',
        img: IMG.hotel,
    },
    {
        no: '03',
        tag: 'Meet & greet',
        title: 'Meet & greet',
        copy: 'Name-board welcome at arrivals, assistance through the terminal, and a seamless walk to your waiting vehicle.',
        img: IMG.meet,
    },
    {
        no: '04',
        tag: 'Hourly',
        title: 'Hotel-area hire',
        copy: 'Need a few hours between check-in and your flight? Keep a dedicated chauffeur on standby across Doha.',
        img: IMG.hourly,
    },
];

export const JOURNEY = [
    {
        no: '01',
        title: 'Book',
        copy: 'Choose hotel → airport or airport → hotel, set your time, and confirm in moments.',
    },
    {
        no: '02',
        title: 'Confirm',
        copy: 'Receive your chauffeur details, vehicle class, and pickup instructions instantly.',
    },
    {
        no: '03',
        title: 'Ride',
        copy: 'We track your flight or meet you at the lobby — luggage handled, cabin ready.',
    },
    {
        no: '04',
        title: 'Arrive',
        copy: 'Step into your hotel or terminal on time, composed, and without stress.',
    },
];

export const FLEET = [
    {
        name: 'Business Class',
        line: 'Mercedes E-Class · BMW 5 Series',
        specs: ['3 guests', '2 bags', 'Ideal for solo & couples'],
        img: IMG.fleet1,
    },
    {
        name: 'First Class',
        line: 'Mercedes S-Class · Audi A8',
        specs: ['3 guests', '2 bags', 'Maximum comfort'],
        img: IMG.fleet2,
    },
    {
        name: 'Luxury SUV',
        line: 'Cadillac Escalade · Range Rover',
        specs: ['5 guests', '5 bags', 'Families & groups'],
        img: IMG.fleet3,
    },
];

export const TESTIMONIALS = [
    {
        quote: 'From Hamad Airport to our hotel in West Bay — flawless. The chauffeur was waiting before we cleared arrivals.',
        name: 'A. Rahman',
        role: 'Guest, Four Seasons Doha',
    },
    {
        quote: 'Hotel lobby to HIA with time to spare. Punctual, discreet, and exactly what a Qatar stay deserves.',
        name: 'L. Moreau',
        role: 'Frequent business traveller',
    },
    {
        quote: 'We only book AL MAJD for airport transfers in Doha. Reliable every single time.',
        name: 'S. Al Fahad',
        role: 'Corporate travel manager',
    },
];

export const TIERS = [
    {
        name: 'Signature',
        tagline: 'For regular Qatar travellers',
        features: ['Priority booking', 'Business-class fleet', '24/7 Doha support', 'Flight tracking'],
        featured: false,
    },
    {
        name: 'Prestige',
        tagline: 'For the discerning guest',
        features: [
            'Everything in Signature',
            'First-class fleet',
            'Meet & greet included',
            'Complimentary wait time',
            'Preferred hotel partners',
        ],
        featured: true,
    },
    {
        name: 'Majlis',
        tagline: 'By invitation only',
        features: [
            'Everything in Prestige',
            'Dedicated chauffeur',
            'Multi-transfer packages',
            'Private jet terminal support',
            'On-call across Doha',
        ],
        featured: false,
    },
];
