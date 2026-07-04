// AL MAJD — Version 2 (Arabic / RTL) — Qatar hotel ↔ airport transfers.
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
    hidden: { opacity: 0, y: 42 },
    show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.2, ease: EASE } },
};

export const wordReveal = {
    hidden: { opacity: 0, y: 50, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};

export const stagger = (delay = 0, gap = 0.1) => ({
    hidden: {},
    show: { transition: { delayChildren: delay, staggerChildren: gap } },
});

export const toArabicDigits = (input) =>
    String(input).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

export const IMG = {
    hero: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2100&q=80',
    airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80',
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
    meet: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80',
    hourly: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=80',
    interior: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80',
    fleet1: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    fleet2: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
    fleet3: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    cta: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=2100&q=80',
};

export const NAV_LINKS = [
    { label: 'الخدمات', href: '#services' },
    { label: 'التجربة', href: '#experience' },
    { label: 'الأسطول', href: '#fleet' },
    { label: 'لماذا المجد', href: '#excellence' },
];

export const CITIES = [
    'مطار حمد', 'الخليج الغربي', 'اللؤلؤة', 'لوسيل', 'مشيرب', 'الكورنيش',
    'الخليج', 'الواحة', 'الخيسة', 'الريان', 'الوكرة', 'الدوحة',
];

export const SERVICES = [
    {
        tag: 'من المطار إلى الفندق',
        title: 'وصولٌ هادئ إلى فندقك.',
        copy: 'نهبط معك في مطار حمد الدولي ونوصلك مباشرةً إلى فندقك. متابعة للرحلة وانتظار مجاني عند التأخير.',
        img: IMG.airport,
    },
    {
        tag: 'من الفندق إلى المطار',
        title: 'انطلاقٌ في الموعد تمامًا.',
        copy: 'يستقبلك السائق في بهو الفندق، يتولى أمتعتك، ويوصلك إلى المطار بهدوءٍ ودون عجلة.',
        img: IMG.hotel,
    },
    {
        tag: 'استقبال في المطار',
        title: 'ترحيبٌ باسمك.',
        copy: 'لوحة ترحيب في صالة الوصول، ومرافقة حتى المركبة — بداية رحلتك في قطر كما ينبغي.',
        img: IMG.meet,
    },
    {
        tag: 'بالساعة في الدوحة',
        title: 'سائقٌ رهن إشارتك.',
        copy: 'بين تسجيل الوصول وموعد رحلتك — احجز سائقًا خاصًا لساعاتٍ في أرجاء الدوحة.',
        img: IMG.hourly,
    },
];

export const DETAILS = [
    {
        n: '٠١',
        title: 'استقبالٌ في الفندق أو المطار',
        copy: 'يُفتح لك الباب، وتُحمل أمتعتك، ويُعتنى بكل شيء قبل أن تطلب — في بهو الفندق أو عند الوصول.',
    },
    {
        n: '٠٢',
        title: 'متابعة رحلتك الجوية',
        copy: 'نتابع رحلتك إلى مطار حمد ونتكيّف مع أي تأخير، مع وقت انتظار مجاني لراحتك.',
    },
    {
        n: '٠٣',
        title: 'راحةٌ طوال الطريق',
        copy: 'مقصورة هادئة، شواحن، ومرطّبات. من الفندق إلى المطار — أو العكس — بلا توتر.',
    },
];

export const FLEET = [
    {
        name: 'درجة رجال الأعمال',
        line: 'مرسيدس الفئة E · بي إم دبليو الفئة الخامسة',
        seats: '٣ ركّاب · حقيبتان',
        img: IMG.fleet1,
    },
    {
        name: 'الدرجة الأولى',
        line: 'مرسيدس الفئة S · أودي A8',
        seats: '٣ ركّاب · حقيبتان',
        img: IMG.fleet2,
    },
    {
        name: 'الدفع الرباعي الفاخر',
        line: 'كاديلاك إسكاليد · رينج روفر',
        seats: '٥ ركّاب · ٥ حقائب',
        img: IMG.fleet3,
    },
];

export const STATS = [
    { to: 1, suffix: '', label: 'قطر فقط' },
    { to: 24, suffix: '/٧', label: 'خدمة في الدوحة' },
    { to: 60, suffix: '+', label: 'دقيقة انتظار مجاني' },
    { to: 100, suffix: '٪', label: 'سائقون موثوقون' },
];

export const PILLARS = [
    {
        title: 'مطار حمد الدولي',
        copy: 'خبرة يومية في الاستلام والتوصيل من وإلى HIA — في الموعد، بلا مفاجآت.',
    },
    {
        title: 'فنادق الدوحة',
        copy: 'نخدم أبرز الفنادق في الخليج الغربي واللؤلؤة ولوسيل ومشيرب والكورنيش.',
    },
    {
        title: 'رحلاتٌ آمنة',
        copy: 'سائقون مدرَّبون، مركبات فاخرة، ومتابعة دقيقة لمواعيد رحلاتك.',
    },
    {
        title: 'خصوصيةٌ تامة',
        copy: 'خدمة رزينة ومخصّصة لنزلاء الفنادق ورجال الأعمال في قطر.',
    },
];
