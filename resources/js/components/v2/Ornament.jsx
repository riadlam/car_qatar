import { motion } from 'motion/react';

// Animated gold ornamental divider — draws in on view.
export default function Ornament({ className = '' }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={`flex items-center justify-center gap-4 ${className}`}
        >
            <motion.span
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}
                className="h-px w-16 origin-right bg-gradient-to-l from-gold-500 to-transparent sm:w-24"
            />
            <motion.svg
                variants={{ hidden: { opacity: 0, rotate: -90, scale: 0.4 }, show: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 } } }}
                width="34"
                height="34"
                viewBox="0 0 40 40"
                fill="none"
                className="shrink-0"
            >
                <path d="M20 2l4.5 11L36 15l-9 8 2.5 13L20 29l-9.5 7L13 23l-9-8 11.5-2L20 2z" stroke="#c9a24b" strokeWidth="1" opacity="0.5" />
                <path d="M20 9l2.7 6.6L30 16l-5 4.6L26.5 28 20 24l-6.5 4L15 20.6 10 16l7.3-.4L20 9z" fill="#c9a24b" opacity="0.9" />
            </motion.svg>
            <motion.span
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}
                className="h-px w-16 origin-left bg-gradient-to-r from-gold-500 to-transparent sm:w-24"
            />
        </motion.div>
    );
}
