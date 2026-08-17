import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DOHA = [25.2854, 51.531];
const NOMINATIM = 'https://nominatim.openstreetmap.org';
/** Qatar first, then the GCC countries served by gulf trips */
const COUNTRY_CODES = 'qa,ae,sa,om,kw,bh';

function pinIcon() {
    return L.divIcon({
        className: 'almajd-map-marker',
        iconSize: [26, 34],
        iconAnchor: [13, 30],
        html: `<svg width="26" height="34" viewBox="0 0 23 32" fill="none" aria-hidden="true">
            <circle cx="11.29" cy="11.29" r="11.29" fill="#f0c5d2"/>
            <line x1="11.5" y1="20.4" x2="11.5" y2="29.6" stroke="#5b0520" stroke-width="3" stroke-linecap="round"/>
            <circle cx="11.29" cy="11.29" r="9.4" fill="#5b0520"/>
            <circle cx="11.29" cy="11.29" r="4.7" fill="#FBF8F2"/>
          </svg>`,
    });
}

function shortLabel(displayName) {
    return String(displayName || '')
        .split(',')
        .slice(0, 3)
        .join(',')
        .trim();
}

/**
 * Map selection sheet for pickup / drop-off fields.
 * Same Leaflet + Carto basemap and pin styling as the trip route map.
 */
export default function MapLocationModal({ open, label = 'location', initialValue = '', onClose, onSelect }) {
    const mapEl = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const initialValueRef = useRef(initialValue);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selected, setSelected] = useState(null);
    const [message, setMessage] = useState('');

    initialValueRef.current = initialValue;

    const place = useCallback(async (lat, lng, presetLabel) => {
        const map = mapRef.current;
        if (map) {
            if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
            else {
                markerRef.current = L.marker([lat, lng], { icon: pinIcon(), interactive: false }).addTo(map);
            }
            map.setView([lat, lng], Math.max(map.getZoom(), 14), { animate: true });
        }

        if (presetLabel) {
            setSelected({ label: presetLabel, lat, lng });
            return;
        }

        setSelected({ label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng });
        try {
            const res = await fetch(`${NOMINATIM}/reverse?format=jsonv2&zoom=18&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data?.display_name) setSelected({ label: shortLabel(data.display_name), lat, lng });
        } catch {
            setMessage('Address lookup unavailable — coordinates will be used.');
        }
    }, []);

    useEffect(() => {
        if (!open) return undefined;

        setQuery(initialValueRef.current || '');
        setResults([]);
        setSelected(null);
        setMessage('');

        const el = mapEl.current;
        if (!el) return undefined;

        const map = L.map(el, { attributionControl: false }).setView(DOHA, 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd',
        }).addTo(map);
        map.on('click', (e) => place(e.latlng.lat, e.latlng.lng));
        mapRef.current = map;
        requestAnimationFrame(() => map.invalidateSize());

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, [open, place]);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') return null;

    const runSearch = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const q = query.trim();
        if (!q) return;

        setSearching(true);
        setMessage('');
        try {
            const res = await fetch(
                `${NOMINATIM}/search?format=jsonv2&limit=6&countrycodes=${COUNTRY_CODES}&q=${encodeURIComponent(q)}`,
            );
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            setResults(list);
            if (list.length) {
                place(Number(list[0].lat), Number(list[0].lon), shortLabel(list[0].display_name));
            } else {
                setMessage('No places found — tap the map to drop a pin.');
            }
        } catch {
            setMessage('Search unavailable — tap the map to drop a pin.');
        } finally {
            setSearching(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[210] flex items-end justify-center sm:items-center sm:p-4">
            <button type="button" className="absolute inset-0 border-0 bg-ink/50" aria-label="Close" onClick={onClose} />
            <div className="relative z-[1] flex max-h-[min(92dvh,760px)] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
                <div className="flex items-center justify-between border-b border-[#eef1f3] px-5 py-4">
                    <h2 className="font-fragment m-0 text-[22px] font-400 text-ink-text">Select {label.toLowerCase()}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-2xl text-muted hover:bg-page"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                    <form onSubmit={runSearch} className="flex items-center gap-2">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="font-geist w-full rounded-lg border border-[#d8d8dc] bg-white px-4 py-3 text-[16px] leading-6 text-ink-text outline-none transition focus:border-wine-700"
                            placeholder="Search address, airport, hotel, ..."
                            aria-label="Search for a place"
                        />
                        <button
                            type="submit"
                            disabled={searching}
                            className="font-geist shrink-0 cursor-pointer rounded-full bg-wine-700 px-5 py-3 text-[15px] font-500 text-white transition hover:bg-wine-600 disabled:opacity-60"
                        >
                            {searching ? 'Searching' : 'Search'}
                        </button>
                    </form>

                    {results.length > 0 && (
                        <ul className="mt-3 m-0 list-none space-y-1 p-0">
                            {results.map((r) => (
                                <li key={`${r.place_id}`}>
                                    <button
                                        type="button"
                                        onClick={() => place(Number(r.lat), Number(r.lon), shortLabel(r.display_name))}
                                        className="font-geist block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-[15px] leading-5 text-ink-text transition hover:bg-page"
                                    >
                                        {shortLabel(r.display_name)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div
                        ref={mapEl}
                        className="almajd-route-map mt-4 h-[300px] w-full overflow-hidden rounded-lg border border-[#e0ddd6] bg-[#e8e6e1]"
                    />

                    <p className="font-geist mt-3 m-0 text-[14px] leading-5 text-muted">
                        {message || 'Tap anywhere on the map to move the pin.'}
                    </p>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#eef1f3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-geist m-0 min-w-0 truncate text-[15px] leading-6 text-ink-text">
                        {selected?.label || 'No location selected yet'}
                    </p>
                    <button
                        type="button"
                        disabled={!selected}
                        onClick={() => selected && onSelect?.(selected)}
                        className="font-geist shrink-0 cursor-pointer rounded-full bg-wine-700 px-6 py-2.5 text-[16px] font-500 text-white transition hover:bg-wine-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Confirm location
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
