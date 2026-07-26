// Shared animation variants + image paths.
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: EASE },
    },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

export const stagger = (delay = 0, gap = 0.12) => ({
    hidden: {},
    show: {
        transition: { delayChildren: delay, staggerChildren: gap },
    },
});

export const revealChar = {
    hidden: { opacity: 0, y: 60, rotateX: -40 },
    show: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { duration: 0.9, ease: EASE },
    },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE } },
};

/** Exact assets from saveweb2zip-com-www-blacklane-com/images (V1 home) */
export const IMG = {
    hero: '/images/bg.e8e3285679399bbb.jpg',
    service1: '/images/1.879377e626f27fdd.webp',
    service2: '/images/2.9ae17562d88c590d.webp',
    service3: '/images/3.a05cc4329bbe2ee0.webp',
    service4: '/images/4.13f5624e9bdcc2ee.webp',
    platform: '/images/img.59bf95b01983baf4.png',
    ride1: '/images/ride-1.510c61ecb0d86e20.webp',
    ride2: '/images/ride-2.1ffe259f4c10fd5e.webp',
    ride3: '/images/ride-3.76756924ac2f6197.webp',
    appStoreLight: '/images/app-store-logo-light.5f768b87b08b58e5.svg',
    playStoreLight: '/images/playstore-logo-light.2938f2b1a073fbc4.svg',
    appStoreDark: '/images/app-store-logo-dark.5dc6643c29136385.svg',
    playStoreDark: '/images/playstore-logo-dark.083f89dd5c62e18d.svg',

    // Kept for V2 / V3 pages
    heroAlt: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2100&q=80',
    airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80',
    hourly: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=80',
    intercity: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=80',
    events: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
    interior: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80',
    chauffeur: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
    fleet1: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    fleet2: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
    fleet3: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    cta: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=2100&q=80',
};
