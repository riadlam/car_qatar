const CDN = 'https://service-catalog-assets.blacklane.com/Service+Catalog+Assets';

/** Vehicle catalog for /booking — layout mirrors Blacklane; accents use AL MAJD wine. */
export const VEHICLES = [
    {
        id: 'business',
        name: 'Business Class',
        similar: 'Mercedes-Benz EQE or similar',
        passengers: 3,
        luggage: 2,
        total: 303.73,
        base: 257.4,
        leadTime: 0,
        tax: 46.33,
        currency: 'US$',
        main: {
            lg: `${CDN}/Business+Class/Main/Mobile_Business_Class_Main%402x.png`,
            sm: `${CDN}/Business+Class/Main/Desktop_Web_Business_Class_Main%402x.png`,
        },
        highlights: [1, 2, 3, 4, 5].map((n) => ({
            lg: `${CDN}/Business+Class/Carousel/Desktop_Business_Class_Carousel_${n}%402x.png`,
            sm: `${CDN}/Business+Class/Carousel/Mobile_Business_Class_Carousel_${n}%402x.png`,
            caption:
                n === 1
                    ? 'All-electric quiet and executive-level comfort'
                    : n === 2
                      ? 'Spacious seating for focused work or quiet rest'
                      : n === 3
                        ? 'Punctual pickups that keep your day in rhythm'
                        : n === 4
                          ? 'Professional chauffeurs, every journey'
                          : 'Premium made practical for everyday travel',
        })),
        description:
            'Premium made practical. Spacious seating, a smooth journey, and punctual pickups that keep your day in rhythm.',
        luggageOptions: [
            {
                id: 'cabin_asset',
                label: '2 x Carry-on',
                image: {
                    lg: `${CDN}/Business+Class/Luggage+Capacity/Desktop_Business_Class_Capacity_Luggage_Carry_On%402x.png`,
                    sm: `${CDN}/Business+Class/Luggage+Capacity/Mobile_Business_Class_Capacity_Luggage_Carry_On%402x.png`,
                },
            },
            {
                id: 'checked_asset',
                label: '2 x Standard check-in',
                image: {
                    lg: `${CDN}/Business+Class/Luggage+Capacity/Desktop_Business_Class_Capacity_Luggage_Check_In%402x.png`,
                    sm: `${CDN}/Business+Class/Luggage+Capacity/Mobile_Business_Class_Capacity_Luggage_Check_In%402x.png`,
                },
            },
            {
                id: 'extra_large_asset',
                label: '1 x Extra large check-in',
                image: {
                    lg: `${CDN}/Business+Class/Luggage+Capacity/Desktop_Business_Class_Capacity_Luggage_Extra_Large%402x.png`,
                    sm: `${CDN}/Business+Class/Luggage+Capacity/Mobile_Business_Class_Capacity_Luggage_Extra_Large%402x.png`,
                },
            },
        ],
        seatingOptions: [
            {
                id: 'maximum_asset',
                label: 'Three passengers',
                image: {
                    lg: `${CDN}/Business+Class/Seating+Capacity/Desktop_Business_Class_Capacity_Seating_Three%402x.png`,
                    sm: `${CDN}/Business+Class/Seating+Capacity/Mobile_Business_Class_Capacity_Seating_Three%402x.png`,
                },
            },
            {
                id: 'suggest_asset',
                label: 'Two passengers',
                image: {
                    lg: `${CDN}/Business+Class/Seating+Capacity/Desktop_Business_Class_Capacity_Seating_Two%402x.png`,
                    sm: `${CDN}/Business+Class/Seating+Capacity/Mobile_Business_Class_Capacity_Seating_Two%402x.png`,
                },
            },
            {
                id: 'child_seat_asset',
                label: 'Child seat',
                image: {
                    lg: `${CDN}/Business+Class/Seating+Capacity/Desktop_Business_Class_Capacity_Seating_Child%402x.png`,
                    sm: `${CDN}/Business+Class/Seating+Capacity/Mobile_Business_Class_Capacity_Seating_Child%402x.png`,
                },
            },
            {
                id: 'baby_seat_asset',
                label: 'Baby seat',
                image: {
                    lg: `${CDN}/Business+Class/Seating+Capacity/Desktop_Business_Class_Capacity_Seating_Baby%402x.png`,
                    sm: `${CDN}/Business+Class/Seating+Capacity/Mobile_Business_Class_Capacity_Seating_Baby%402x.png`,
                },
            },
        ],
    },
    {
        id: 'van',
        name: 'Business Van',
        similar: 'Mercedes-Benz V-Class or similar',
        passengers: 5,
        luggage: 5,
        total: 394.85,
        base: 334.62,
        leadTime: 0,
        tax: 60.23,
        currency: 'US$',
        main: {
            lg: `${CDN}/Business+Van/Main/Mobile_Van_Class_Main%402x.png`,
            sm: `${CDN}/Business+Van/Main/Desktop_Web_Van_Class_Main%402x.png`,
        },
        highlights: [1, 2, 3, 4, 5].map((n) => ({
            lg: `${CDN}/Business+Van/Carousel/Desktop_Van_Class_Carousel_${n}%402x.png`,
            sm: `${CDN}/Business+Van/Carousel/Mobile_Van_Class_Carousel_${n}%402x.png`,
            caption:
                n === 1
                    ? 'Extra space for groups, gear, and longer rides'
                    : n === 2
                      ? 'Comfortable seating for up to five passengers'
                      : n === 3
                        ? 'Room for larger luggage and assistive devices'
                        : n === 4
                          ? 'Ideal for airport runs with the whole team'
                          : 'Executive comfort with van-class capacity',
        })),
        description:
            'More room without compromise. Ideal for groups, excess luggage, or when you need flexibility on the road.',
        luggageOptions: [
            {
                id: 'cabin_asset',
                label: '5 x Carry-on',
                image: {
                    lg: `${CDN}/Business+Van/Luggage+Capacity/Desktop_Van_Class_Capacity_Luggage_Carry_On%402x.png`,
                    sm: `${CDN}/Business+Van/Luggage+Capacity/Mobile_Van_Class_Capacity_Luggage_Carry_On%402x.png`,
                },
            },
            {
                id: 'checked_asset',
                label: '5 x Standard check-in',
                image: {
                    lg: `${CDN}/Business+Van/Luggage+Capacity/Desktop_Van_Class_Capacity_Luggage_Check_In%402x.png`,
                    sm: `${CDN}/Business+Van/Luggage+Capacity/Mobile_Van_Class_Capacity_Luggage_Check_In%402x.png`,
                },
            },
            {
                id: 'extra_large_asset',
                label: '3 x Extra large check-in',
                image: {
                    lg: `${CDN}/Business+Van/Luggage+Capacity/Desktop_Van_Class_Capacity_Luggage_Extra_Large%402x.png`,
                    sm: `${CDN}/Business+Van/Luggage+Capacity/Mobile_Van_Class_Capacity_Luggage_Extra_Large%402x.png`,
                },
            },
        ],
        seatingOptions: [
            {
                id: 'maximum_asset',
                label: 'Five passengers',
                image: {
                    lg: `${CDN}/Business+Van/Seating+Capacity/Desktop_Van_Class_Capacity_Seating_Five%402x.png`,
                    sm: `${CDN}/Business+Van/Seating+Capacity/Mobile_Van_Class_Capacity_Seating_Five%402x.png`,
                },
            },
            {
                id: 'suggest_asset',
                label: 'Four passengers',
                image: {
                    lg: `${CDN}/Business+Van/Seating+Capacity/Desktop_Van_Class_Capacity_Seating_Four%402x.png`,
                    sm: `${CDN}/Business+Van/Seating+Capacity/Mobile_Van_Class_Capacity_Seating_Four%402x.png`,
                },
            },
            {
                id: 'child_seat_asset',
                label: 'Child seat',
                image: {
                    lg: `${CDN}/Business+Van/Seating+Capacity/Desktop_Van_Class_Capacity_Seating_Child%402x.png`,
                    sm: `${CDN}/Business+Van/Seating+Capacity/Mobile_Van_Class_Capacity_Seating_Child%402x.png`,
                },
            },
            {
                id: 'baby_seat_asset',
                label: 'Baby seat',
                image: {
                    lg: `${CDN}/Business+Van/Seating+Capacity/Desktop_Van_Class_Capacity_Seating_Baby%402x.png`,
                    sm: `${CDN}/Business+Van/Seating+Capacity/Mobile_Van_Class_Capacity_Seating_Baby%402x.png`,
                },
            },
        ],
    },
    {
        id: 'first',
        name: 'First Class',
        similar: 'Mercedes-Benz S-Class or similar',
        passengers: 3,
        luggage: 2,
        total: 471.82,
        base: 399.85,
        leadTime: 0,
        tax: 71.97,
        currency: 'US$',
        main: {
            lg: `${CDN}/First+Class/Main/Mobile_First_Class_Main%402x.png`,
            sm: `${CDN}/First+Class/Main/Desktop_Web_First_Class_Main%402x.png`,
        },
        highlights: [1, 2, 3, 4, 5].map((n) => ({
            lg: `${CDN}/First+Class/Carousel/Desktop_First_Class_Carousel_${n}%402x.png`,
            sm: `${CDN}/First+Class/Carousel/Mobile_First_Class_Carousel_${n}%402x.png`,
            caption:
                n === 1
                    ? 'Flagship comfort for the most important journeys'
                    : n === 2
                      ? 'Refined cabin details and a quieter ride'
                      : n === 3
                        ? 'Arrive with presence, every time'
                        : n === 4
                          ? 'Discreet service for VIP travel'
                          : 'First Class, end to end',
        })),
        description:
            'Our most refined ride. Elevated comfort, discreet service, and a cabin built for arrival moments that matter.',
        luggageOptions: [
            {
                id: 'cabin_asset',
                label: '2 x Carry-on',
                image: {
                    lg: `${CDN}/First+Class/Luggage+Capacity/Desktop_First_Class_Capacity_Luggage_Carry_On%402x.png`,
                    sm: `${CDN}/First+Class/Luggage+Capacity/Mobile_First_Class_Capacity_Luggage_Carry_On%402x.png`,
                },
            },
            {
                id: 'checked_asset',
                label: '2 x Standard check-in',
                image: {
                    lg: `${CDN}/First+Class/Luggage+Capacity/Desktop_First_Class_Capacity_Luggage_Check_In%402x.png`,
                    sm: `${CDN}/First+Class/Luggage+Capacity/Mobile_First_Class_Capacity_Luggage_Check_In%402x.png`,
                },
            },
            {
                id: 'extra_large_asset',
                label: '1 x Extra large check-in',
                image: {
                    lg: `${CDN}/First+Class/Luggage+Capacity/Desktop_First_Class_Capacity_Luggage_Extra_Large%402x.png`,
                    sm: `${CDN}/First+Class/Luggage+Capacity/Mobile_First_Class_Capacity_Luggage_Extra_Large%402x.png`,
                },
            },
        ],
        seatingOptions: [
            {
                id: 'maximum_asset',
                label: 'Three passengers',
                image: {
                    lg: `${CDN}/First+Class/Seating+Capacity/Desktop_First_Class_Capacity_Seating_Three%402x.png`,
                    sm: `${CDN}/First+Class/Seating+Capacity/Mobile_First_Class_Capacity_Seating_Three%402x.png`,
                },
            },
            {
                id: 'suggest_asset',
                label: 'Two passengers',
                image: {
                    lg: `${CDN}/First+Class/Seating+Capacity/Desktop_First_Class_Capacity_Seating_Two%402x.png`,
                    sm: `${CDN}/First+Class/Seating+Capacity/Mobile_First_Class_Capacity_Seating_Two%402x.png`,
                },
            },
            {
                id: 'child_seat_asset',
                label: 'Child seat',
                image: {
                    lg: `${CDN}/First+Class/Seating+Capacity/Desktop_First_Class_Capacity_Seating_Child%402x.png`,
                    sm: `${CDN}/First+Class/Seating+Capacity/Mobile_First_Class_Capacity_Seating_Child%402x.png`,
                },
            },
            {
                id: 'baby_seat_asset',
                label: 'Baby seat',
                image: {
                    lg: `${CDN}/First+Class/Seating+Capacity/Desktop_First_Class_Capacity_Seating_Baby%402x.png`,
                    sm: `${CDN}/First+Class/Seating+Capacity/Mobile_First_Class_Capacity_Seating_Baby%402x.png`,
                },
            },
        ],
    },
];

export const INCLUDED = [
    { id: 'meet', label: 'Personal meet & greet', icon: 'meet' },
    { id: 'cancel', label: 'Free to cancel up to 1 hour before pickup', icon: 'cancel' },
    { id: 'chargers', label: 'iOS and Android chargers onboard', icon: 'chargers' },
    { id: 'wipes', label: 'Complimentary tissues & sanitizing wipes', icon: 'wipes' },
    { id: 'water', label: 'Complimentary chilled water included', icon: 'water' },
];

export function formatMoney(amount, currency = 'US$') {
    return `${currency} ${Number(amount).toFixed(2)}`;
}
