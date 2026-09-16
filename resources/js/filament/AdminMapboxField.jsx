import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MapLocationModal from '../components/booking/MapLocationModal';
import { getSearchScope } from '../maps/searchScopes';
import { useMapboxSearch } from '../maps/useMapboxSearch';

const PinIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
    </svg>
);

function readWireState(wire, key) {
    try {
        if (!wire) return null;
        if (typeof wire.get === 'function') {
            const nested = wire.get(`data.${key}`);
            if (nested !== undefined) return nested;
            const data = wire.get('data');
            if (data && typeof data === 'object' && key in data) return data[key];
        }
        return null;
    } catch {
        return null;
    }
}

function writeWirePlace(wire, place, { withAddress, withPlaceId }) {
    if (!wire || typeof wire.set !== 'function') return;
    wire.set('data.latitude', place.lat);
    wire.set('data.longitude', place.lng);
    if (withAddress) {
        wire.set('data.formatted_address', place.label || '');
    }
    if (withPlaceId) {
        wire.set('data.place_id', place.place_id || null);
        wire.set('data.provider', 'mapbox');
    }
}

/**
 * Filament admin Mapbox search + hero MapLocationModal (same as homepage).
 */
export default function AdminMapboxField({
    label = 'Search Mapbox',
    placeholder = 'Search…',
    searchScope = 'qatar',
    withAddress = false,
    withPlaceId = false,
    getWire = () => null,
}) {
    const uid = useId();
    const scopeConfig = getSearchScope(searchScope);
    const [value, setValue] = useState('');
    const [coords, setCoords] = useState(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapRef = useRef(null);
    const { suggestions, loading, suggestDebounced, retrieve, clear } = useMapboxSearch({
        scope: searchScope,
        proximity: scopeConfig.proximity,
    });

    useEffect(() => {
        const wire = getWire();
        if (!wire) return;
        const address = withAddress ? readWireState(wire, 'formatted_address') : null;
        const lat = Number(readWireState(wire, 'latitude'));
        const lng = Number(readWireState(wire, 'longitude'));
        if (address) setValue(String(address));
        else if (Number.isFinite(lat) && Number.isFinite(lng)) {
            setValue(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            setCoords({
                lat,
                lng,
                place_id: withPlaceId ? readWireState(wire, 'place_id') : null,
                name: address || null,
            });
        }
    }, [getWire, withAddress, withPlaceId]);

    const applyPlace = useCallback(
        (place) => {
            if (!place || place.lat == null || place.lng == null) return;
            const next = {
                lat: Number(place.lat),
                lng: Number(place.lng),
                label: place.label || place.name || `${place.lat}, ${place.lng}`,
                place_id: place.place_id || null,
                name: place.name || place.label || null,
            };
            setValue(next.label);
            setCoords({
                lat: next.lat,
                lng: next.lng,
                place_id: next.place_id,
                name: next.name,
            });
            writeWirePlace(getWire(), next, { withAddress, withPlaceId });
        },
        [getWire, withAddress, withPlaceId],
    );

    const pickSuggestion = useCallback(
        async (suggestion) => {
            if (!suggestion?.mapbox_id) return;
            const place = await retrieve(suggestion.mapbox_id);
            if (place) applyPlace(place);
            setMenuOpen(false);
            clear();
            setActiveIndex(-1);
        },
        [retrieve, applyPlace, clear],
    );

    const showMenu = menuOpen && (suggestions.length > 0 || loading);

    const onKeyDown = (e) => {
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
        } else if (e.key === 'Escape') {
            setMenuOpen(false);
        }
    };

    const initialPlace = useMemo(() => {
        if (!coords || !Number.isFinite(Number(coords.lat)) || !Number.isFinite(Number(coords.lng))) return null;
        return {
            label: value,
            lat: Number(coords.lat),
            lng: Number(coords.lng),
            place_id: coords.place_id || null,
            name: coords.name || value,
        };
    }, [coords, value]);

    return (
        <div ref={wrapRef} className="admin-mapbox-picker w-full">
            <label htmlFor={uid} className="mb-1.5 block text-sm font-medium text-gray-950 dark:text-white">
                {label}
            </label>
            <div className="flex items-center gap-1 rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-gray-950/10 dark:bg-white/5 dark:ring-white/20">
                <input
                    id={uid}
                    type="search"
                    value={value}
                    onChange={(e) => {
                        const next = e.target.value;
                        setValue(next);
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
                    onKeyDown={onKeyDown}
                    placeholder={placeholder || scopeConfig.searchHint}
                    autoComplete="off"
                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-gray-950 outline-none ring-0 placeholder:text-gray-400 focus:ring-0 dark:text-white"
                />
                <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    aria-label="Open Mapbox map to pin location"
                    title="Open map"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-[#5b0520] dark:text-gray-400 dark:hover:bg-white/10"
                >
                    {PinIcon}
                </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Type to search, or click the pin to open the Mapbox map (same as homepage).
            </p>

            {showMenu &&
                typeof document !== 'undefined' &&
                createPortal(
                    <ul
                        className="z-[220] m-0 max-h-72 list-none overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                        style={{
                            position: 'fixed',
                            left: wrapRef.current?.getBoundingClientRect().left ?? 0,
                            top: (wrapRef.current?.getBoundingClientRect().bottom ?? 0) + 8,
                            width: Math.max(wrapRef.current?.getBoundingClientRect().width ?? 280, 280),
                        }}
                        role="listbox"
                    >
                        {loading && suggestions.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-gray-500">Searching…</li>
                        ) : null}
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
                                        className={`flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                                            active ? 'bg-[#5b0520] text-white' : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="mt-0.5 shrink-0 opacity-70">{PinIcon}</span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate font-medium">{s.name}</span>
                                            {s.secondary ? (
                                                <span className={`mt-0.5 block truncate text-xs ${active ? 'text-white/75' : 'text-gray-500'}`}>
                                                    {s.secondary}
                                                </span>
                                            ) : null}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>,
                    document.body,
                )}

            <MapLocationModal
                open={pickerOpen}
                label={label}
                initialValue={value}
                initialPlace={initialPlace}
                searchScope={searchScope}
                onClose={() => setPickerOpen(false)}
                onSelect={(loc) => {
                    applyPlace(loc);
                    setPickerOpen(false);
                    setMenuOpen(false);
                    clear();
                }}
            />
        </div>
    );
}
