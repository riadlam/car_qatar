import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { addCompactAttribution, fetchMapConfig, hasMapboxToken, mapInitOptions } from '../../maps/mapboxClient';
import { createHtmlElement, simplePinHtml } from '../../maps/markers';

/**
 * Booking / checkout map preview — Mapbox GL with pickup pin + chip overlay.
 */
export default function BookingMap({
    pickupLabel = 'Pickup location',
    pickupTime = '10:15',
    pickupPeriod = 'pm',
    lat = 25.2854,
    lng = 51.531,
}) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return undefined;

        let cancelled = false;
        let map;

        fetchMapConfig().then((config) => {
            if (cancelled || !containerRef.current) return;
            if (!hasMapboxToken()) return;
            map = addCompactAttribution(new mapboxgl.Map(
                mapInitOptions(containerRef.current, config, { lat, lng, zoom: 13 }),
            ));
            map.dragPan.disable();
            map.scrollZoom.disable();
            map.doubleClickZoom.disable();
            mapRef.current = map;

            map.on('load', () => {
                markerRef.current = new mapboxgl.Marker({
                    element: createHtmlElement(simplePinHtml(config.marker_color || '#5b0520')),
                    anchor: 'bottom',
                })
                    .setLngLat([lng, lat])
                    .addTo(map);
                map.resize();
            });
        });

        return () => {
            cancelled = true;
            markerRef.current = null;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
        // Recreate when coords change meaningfully
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lat, lng]);

    return (
        <div className="booking-map relative h-[220px] w-full overflow-hidden bg-[#e5e3df] lg:h-[280px]">
            <div ref={containerRef} className="almajd-mb-map absolute inset-0 h-full w-full" />
            <div className="absolute left-1/2 top-2.5 z-10 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-stretch gap-0 overflow-hidden rounded-lg bg-white shadow-[0_2px_12px_rgba(15,19,25,0.12)]">
                <div className="min-w-0 px-3 py-2">
                    <div className="font-geist text-[12px] leading-4 text-muted">Pick up</div>
                    <div className="font-geist truncate text-[14px] leading-5 font-500 text-ink-text">
                        {pickupLabel}
                    </div>
                </div>
                <div className="flex shrink-0 items-center border-l border-[#eef1f3] bg-page px-3 py-2">
                    <div className="text-center">
                        <div className="font-geist text-[14px] leading-5 font-500 text-ink-text">{pickupTime}</div>
                        <div className="font-geist text-[12px] leading-4 text-muted">{pickupPeriod}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
