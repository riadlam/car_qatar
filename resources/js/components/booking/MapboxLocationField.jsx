import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import MapLocationModal from './MapLocationModal';
import { getSearchScope } from '../../maps/searchScopes';
import { useMapboxSearch } from '../../maps/useMapboxSearch';
import Skeleton from '../ui/Skeleton';

const PinIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
    </svg>
);

const VARIANTS = {
    dark: {
        label: 'font-geist mb-1 text-[14px] leading-5 font-400 tracking-[0.15px] text-white/80',
        underline:
            'relative flex items-center gap-2 border-b border-white/80 pb-2 transition-[border-color] focus-within:border-b-2 focus-within:border-wine-500',
        input: 'font-geist w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-white outline-none placeholder:text-white/40',
        pin: 'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white',
        menu: 'nav-dd--dark z-[220] m-0 list-none overflow-y-auto rounded-lg p-2',
        optionIdle: 'text-white hover:bg-white/10',
        optionActive: 'bg-wine-700 text-white',
        optionPinIdle: 'text-white/55',
        optionPinActive: 'text-white/90',
        optionSecondaryIdle: 'text-white/50',
        optionSecondaryActive: 'text-white/75',
        loading: 'font-geist px-3 py-2.5 text-[14px] leading-5 text-white/55',
    },
    light: {
        label: 'font-geist mb-1 text-[14px] leading-5 font-400 tracking-[0.15px] text-ink-text/70',
        underline:
            'relative flex items-center gap-2 border-b border-ink-text/25 pb-2 transition-[border-color] focus-within:border-b-2 focus-within:border-wine-700',
        input: 'font-geist w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-[16px] leading-6 font-400 tracking-[0.15px] text-ink-text outline-none placeholder:text-ink-text/35',
        pin: 'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-text/45 transition hover:bg-ink-text/5 hover:text-wine-700',
        menu: 'nav-dd--light z-[220] m-0 list-none overflow-y-auto rounded-lg p-2',
        optionIdle: 'text-ink-text hover:bg-page',
        optionActive: 'bg-wine-700 text-white',
        optionPinIdle: 'text-ink-text/40',
        optionPinActive: 'text-white/90',
        optionSecondaryIdle: 'text-ink-text/50',
        optionSecondaryActive: 'text-white/75',
        loading: 'font-geist px-3 py-2.5 text-[14px] leading-5 text-ink-text/45',
    },
};

function themeFor(variant, density) {
    const base = VARIANTS[variant] || VARIANTS.dark;
    if (density !== 'compact') return base;
    return {
        ...base,
        label: base.label.replace('mb-1 text-[14px] leading-5', 'mb-0.5 text-[11px] leading-4'),
        underline: base.underline.replace('gap-2', 'gap-1.5').replace('pb-2', 'pb-1'),
        input: base.input.replace('text-[16px] leading-6', 'text-[14px] leading-5'),
        pin: base.pin.replace('h-8 w-8', 'h-7 w-7'),
    };
}

/**
 * Mapbox Search Box typeahead + pin modal.
 * variant: dark (hero) | light (Explore Qatar schedulers)
 */
export default function MapboxLocationField({
    id,
    label,
    value,
    coords = null,
    onChange,
    onPick,
    searchScope = 'qatar',
    variant = 'dark',
    density = 'regular',
    required = true,
    name,
}) {
    const theme = themeFor(variant, density);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapRef = useRef(null);
    const inputRef = useRef(null);
    const menuRef = useRef(null);
    const scopeConfig = getSearchScope(searchScope);
    const { suggestions, loading, suggestDebounced, retrieve, clear } = useMapboxSearch({
        scope: searchScope,
        proximity: scopeConfig.proximity,
    });

    const position = useCallback(() => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom - 16;
        const spaceAbove = rect.top - 16;
        const flip = spaceBelow < 220 && spaceAbove > spaceBelow;
        setMenuStyle({
            position: 'fixed',
            left: rect.left,
            width: Math.max(rect.width, 260),
            maxHeight: Math.max(180, Math.min(320, flip ? spaceAbove : spaceBelow)),
            ...(flip ? { bottom: window.innerHeight - rect.top + 10 } : { top: rect.bottom + 10 }),
        });
    }, []);

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
        setActiveIndex(-1);
        clear();
    }, [clear]);

    const pickSuggestion = useCallback(
        async (suggestion) => {
            if (!suggestion?.mapbox_id) return;
            const place = await retrieve(suggestion.mapbox_id);
            const nextLabel = place?.label || suggestion.full_address || suggestion.name;
            onChange(nextLabel);
            if (place) onPick?.(place);
            closeMenu();
        },
        [retrieve, onChange, onPick, closeMenu],
    );

    useEffect(() => {
        if (!menuOpen) return undefined;
        position();

        const onPointerDown = (e) => {
            if (wrapRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
            closeMenu();
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeMenu();
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', position);
        window.addEventListener('scroll', position, true);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', position);
            window.removeEventListener('scroll', position, true);
        };
    }, [menuOpen, position, closeMenu]);

    useEffect(() => {
        if (menuOpen && suggestions.length > 0) position();
    }, [menuOpen, suggestions, position]);

    const showMenu = menuOpen && (suggestions.length > 0 || loading);

    const onInputKeyDown = (e) => {
        if (!showMenu || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            pickSuggestion(suggestions[activeIndex]);
        }
    };

    return (
        <div ref={wrapRef} className="relative min-w-0 flex-1">
            <div className="relative flex min-w-0 flex-1 flex-col">
                <label htmlFor={id} className={theme.label}>
                    {label}
                </label>
                <div className={theme.underline}>
                    <input
                        ref={inputRef}
                        id={id}
                        name={name}
                        value={value}
                        onChange={(e) => {
                            const next = e.target.value;
                            onChange(next);
                            setMenuOpen(true);
                            setActiveIndex(-1);
                            suggestDebounced(next);
                        }}
                        onFocus={() => {
                            if (String(value || '').trim().length >= 2) {
                                setMenuOpen(true);
                                suggestDebounced(value);
                            }
                        }}
                        onKeyDown={onInputKeyDown}
                        className={theme.input}
                        placeholder={scopeConfig.searchHint || 'Address, airport, hotel, ...'}
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={showMenu}
                        aria-autocomplete="list"
                        aria-controls={`${id}-suggestions`}
                        required={required}
                    />
                    <button
                        type="button"
                        onClick={() => setPickerOpen(true)}
                        aria-label={`Select ${label.toLowerCase()} on the map`}
                        className={theme.pin}
                    >
                        {PinIcon}
                    </button>
                </div>
            </div>

            {typeof document !== 'undefined' &&
                createPortal(
                    <AnimatePresence>
                        {showMenu && menuStyle && (
                            <motion.ul
                                ref={menuRef}
                                id={`${id}-suggestions`}
                                role="listbox"
                                aria-label={`${label} suggestions`}
                                style={menuStyle}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                                className={theme.menu}
                            >
                                {loading && suggestions.length === 0 && (
                                    <li className={theme.loading}>
                                        <Skeleton variant="inline" />
                                    </li>
                                )}
                                {suggestions.map((s, index) => {
                                    const active = index === activeIndex;
                                    return (
                                        <li key={s.mapbox_id || `${s.name}-${index}`}>
                                            <button
                                                type="button"
                                                role="option"
                                                aria-selected={active}
                                                onMouseEnter={() => setActiveIndex(index)}
                                                onClick={() => pickSuggestion(s)}
                                                className={`font-geist flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-left transition ${
                                                    active ? theme.optionActive : theme.optionIdle
                                                }`}
                                            >
                                                <span
                                                    className={`mt-0.5 shrink-0 ${
                                                        active ? theme.optionPinActive : theme.optionPinIdle
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    {PinIcon}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-[15px] leading-5 font-500">
                                                        {s.name}
                                                    </span>
                                                    {s.secondary ? (
                                                        <span
                                                            className={`mt-0.5 block truncate text-[13px] leading-4 ${
                                                                active
                                                                    ? theme.optionSecondaryActive
                                                                    : theme.optionSecondaryIdle
                                                            }`}
                                                        >
                                                            {s.secondary}
                                                        </span>
                                                    ) : null}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </motion.ul>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}

            <MapLocationModal
                open={pickerOpen}
                label={label}
                initialValue={value}
                initialPlace={
                    Number.isFinite(Number(coords?.lat)) && Number.isFinite(Number(coords?.lng))
                        ? {
                              label: value,
                              lat: Number(coords.lat),
                              lng: Number(coords.lng),
                              place_id: coords.place_id,
                              name: coords.name,
                          }
                        : null
                }
                searchScope={searchScope}
                onClose={() => setPickerOpen(false)}
                onSelect={(loc) => {
                    onChange(loc.label);
                    onPick?.(loc);
                    setPickerOpen(false);
                    closeMenu();
                }}
            />
        </div>
    );
}
