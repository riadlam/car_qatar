import { useEffect, useRef, useState } from 'react';
import { postChauffeurLocation } from '../api/bookings';

const POSITION_OPTIONS = {
    enableHighAccuracy: false,
    timeout: 20000,
    maximumAge: 60000,
};

function coordsPayload(position) {
    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        recorded_at: new Date(position.timestamp).toISOString(),
    };
}

function queryPermission() {
    if (!navigator.permissions?.query) return Promise.resolve(null);
    return navigator.permissions.query({ name: 'geolocation' }).catch(() => null);
}

/**
 * Blocks journeys and chauffeur pages until the browser location prompt is granted.
 * The grant is not used for dispatch. Chauffeur pages still post coordinates to the API.
 */
export default function LocationRequired({ children, report = false }) {
    const secure = window.isSecureContext;
    const [phase, setPhase] = useState(secure ? 'needed' : 'insecure');
    const [asking, setAsking] = useState(false);
    const [note, setNote] = useState('');
    const lastPost = useRef(0);
    const requestId = useRef(0);

    const publish = (position) => {
        if (!report || !position) return;
        const now = Date.now();
        if (now - lastPost.current < 8000) return;
        lastPost.current = now;
        postChauffeurLocation(coordsPayload(position)).catch(() => {});
    };

    const ask = () => {
        if (!navigator.geolocation) {
            setPhase('unsupported');
            return;
        }

        const id = requestId.current + 1;
        requestId.current = id;
        setAsking(true);
        setNote('Allow the prompt at the top of the browser if it appears.');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (requestId.current !== id) return;
                setAsking(false);
                setPhase('granted');
                publish(position);
            },
            (error) => {
                if (requestId.current !== id) return;
                setAsking(false);

                if (!window.isSecureContext) {
                    setPhase('insecure');
                    return;
                }

                queryPermission().then((permission) => {
                    if (requestId.current !== id) return;
                    if (permission?.state === 'granted') {
                        setPhase('granted');
                        return;
                    }
                    if (error?.code === 1 && permission?.state === 'denied') {
                        setPhase('denied');
                        setNote('');
                        return;
                    }
                    if (error?.code === 1) {
                        setPhase('needed');
                        setNote('The prompt was dismissed. Press Enable location to ask again.');
                        return;
                    }
                    setPhase('needed');
                    setNote('This device did not return a position. Press Enable location to try again.');
                });
            },
            POSITION_OPTIONS,
        );
    };

    useEffect(() => {
        if (!secure) return undefined;

        let permission;
        let onChange;
        queryPermission().then((result) => {
            permission = result;
            if (!result) return;
            if (result.state === 'granted') setPhase('granted');
            if (result.state === 'denied') setPhase('denied');
            onChange = () => {
                if (result.state === 'granted') setPhase('granted');
                if (result.state === 'denied') setPhase('denied');
                if (result.state === 'prompt') setPhase('needed');
            };
            result.addEventListener('change', onChange);
        });

        return () => {
            if (permission && onChange) permission.removeEventListener('change', onChange);
        };
    }, [secure]);

    useEffect(() => {
        if (phase !== 'granted' || !report || !navigator.geolocation) return undefined;

        const watchId = navigator.geolocation.watchPosition(
            (position) => publish(position),
            () => {},
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [phase, report]);

    if (phase === 'granted') return children;

    const localhostHref = `http://localhost:${window.location.port || '8000'}${window.location.pathname}${window.location.search}`;

    return (
        <div className="flex min-h-screen items-center justify-center bg-page px-5 text-ink-text">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="location-required-title"
                className="w-full max-w-md rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                        />
                        <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                </div>
                <h1 id="location-required-title" className="font-fragment mt-5 m-0 text-[28px] font-400">
                    {phase === 'insecure' ? 'Open this page on localhost' : 'Location must be enabled'}
                </h1>
                <p className="font-geist mt-3 m-0 text-[15px] leading-relaxed text-muted">
                    {phase === 'insecure'
                        ? `Browsers will not show a location prompt on ${window.location.host} because the address is not secure. On this computer, open the same page at localhost, then press Enable location.`
                        : phase === 'denied'
                          ? 'Location is blocked for this site. Click the lock icon in the address bar, set Location to Allow, then come back to this page.'
                          : phase === 'unsupported'
                            ? 'This browser cannot share location. Use a current version of Chrome, Edge, or Safari.'
                            : 'Journeys and the chauffeur portal need your location before they can be used.'}
                </p>
                {note ? <p className="font-geist mt-3 m-0 text-[14px] text-ink-text">{note}</p> : null}
                <div className="mt-6 flex flex-wrap gap-3">
                    {phase === 'insecure' ? (
                        <a
                            href={localhostHref}
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-5 text-[14px] font-500 text-white transition hover:bg-wine-600"
                        >
                            Open on localhost
                        </a>
                    ) : phase === 'unsupported' ? null : (
                        <button
                            type="button"
                            onClick={ask}
                            disabled={asking}
                            className="font-geist inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-wine-700 px-5 text-[14px] font-500 text-white transition hover:bg-wine-600 disabled:cursor-wait disabled:opacity-70"
                        >
                            {asking ? 'Waiting for the browser…' : 'Enable location'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
