import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { addCompactAttribution, fetchMapConfig, hasMapboxToken, mapInitOptions } from './mapboxClient';

/**
 * Base Mapbox GL map. Parent can use onReady(map, config) to add layers/markers.
 */
export default function MapboxMap({
    className = '',
    lat,
    lng,
    zoom,
    interactive = true,
    onReady,
    children,
}) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const [unavailable, setUnavailable] = useState(false);
    const [ready, setReady] = useState(false);
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return undefined;

        let cancelled = false;
        let map;

        fetchMapConfig().then((config) => {
            if (cancelled || !containerRef.current) return;
            if (!hasMapboxToken()) {
                setUnavailable(true);
                return;
            }

            map = addCompactAttribution(new mapboxgl.Map(
                mapInitOptions(containerRef.current, config, { lat, lng, zoom }),
            ));
            map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
            if (!interactive) {
                map.dragPan.disable();
                map.scrollZoom.disable();
                map.boxZoom.disable();
                map.doubleClickZoom.disable();
                map.touchZoomRotate.disable();
            }

            mapRef.current = map;
            map.on('load', () => {
                if (cancelled) return;
                setReady(true);
                onReadyRef.current?.(map, config);
            });
        });

        return () => {
            cancelled = true;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
        // Mount once; parents update via map instance from onReady
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (unavailable) {
        return (
            <div
                className={`flex items-center justify-center bg-[#e8e6e1] font-geist text-[14px] text-muted ${className}`}
            >
                Maps unavailable — add the Mapbox public token on the server.
            </div>
        );
    }

    return (
        <div className={`relative isolate overflow-hidden bg-[#e8e6e1] ${className}`}>
            <div ref={containerRef} className="almajd-mb-map absolute inset-0 h-full w-full" />
            {ready ? children : null}
        </div>
    );
}
