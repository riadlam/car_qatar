import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, options = {}) => {
        setToast({
            id: Date.now(),
            message,
            type: options.type || 'success',
            duration: options.duration ?? 3800,
        });
    }, []);

    const clearToast = useCallback(() => setToast(null), []);

    return (
        <ToastContext.Provider value={{ showToast, clearToast, toast }}>
            {children}
            <ToastViewport toast={toast} onDismiss={clearToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return ctx;
}

function ToastViewport({ toast, onDismiss }) {
    useEffect(() => {
        if (!toast) return undefined;
        const t = window.setTimeout(onDismiss, toast.duration);
        return () => window.clearTimeout(t);
    }, [toast, onDismiss]);

    return (
        <div
            className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex justify-center px-4 sm:top-6"
            aria-live="polite"
        >
            <AnimatePresence>
                {toast ? (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_12px_40px_rgba(15,19,25,0.14)] backdrop-blur-md ${
                            toast.type === 'error'
                                ? 'border-rose-200/80 bg-white/95 text-rose-800'
                                : 'border-[#5b0520]/12 bg-white/95 text-ink-text'
                        }`}
                        role="status"
                    >
                        <span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                                toast.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-wine-50 text-wine-700'
                            }`}
                            aria-hidden="true"
                        >
                            {toast.type === 'error' ? '!' : '✓'}
                        </span>
                        <p className="font-geist m-0 flex-1 text-[15px] leading-6 font-500">{toast.message}</p>
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="font-geist -mr-1 cursor-pointer rounded-full px-2 py-0.5 text-[18px] leading-none text-muted transition hover:bg-black/5 hover:text-ink-text"
                            aria-label="Dismiss"
                        >
                            ×
                        </button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
