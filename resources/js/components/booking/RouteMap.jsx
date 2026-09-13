import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { addCompactAttribution, fetchMapConfig, hasMapboxToken, mapInitOptions } from '../../maps/mapboxClient';
import { frameRoute } from '../../maps/frameRoute';
import { createHtmlElement, dropMarkerHtml, pinMarkerHtml } from '../../maps/markers';
import { fetchMapboxDirections, setRouteGeoJson } from '../../maps/useMapboxDirections';

/**
 * Mobile checkout route map — Mapbox Directions polyline A→B.
 */
export default function RouteMap({
    pickupLabel = 'Pickup',
    dropoffLabel = 'Drop-off',
    lat = 25.2854,
    lng = 51.531,
    dropLat,
    dropLng,
    waypoints = [],
    className = '',
}) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({ a: null, b: null });
    const waypointKey = waypoints.map((w) => `${w.lng},${w.lat}`).join('|');

    useEffect(() => {
        if (!containerRef.current) return undefined;

        let cancelled = false;
        let map;

        const endLat = dropLat ?? lat + 0.022;
        const endLng = dropLng ?? lng + 0.028;

        fetchMapConfig().then(async (config) => {
            if (cancelled || !containerRef.current) return;
            if (!hasMapboxToken()) return;
            const color = config.marker_color || '#5b0520';
            map = addCompactAttribution(new mapboxgl.Map(
                mapInitOptions(containerRef.current, config, {
                    lat: (lat + endLat) / 2,
                    lng: (lng + endLng) / 2,
                    zoom: 11,
                }),
            ));
            map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
            mapRef.current = map;

            map.on('load', async () => {
                markersRef.current.a = new mapboxgl.Marker({
                    element: createHtmlElement(pinMarkerHtml(pickupLabel, color)),
                    anchor: 'bottom',
                })
                    .setLngLat([lng, lat])
                    .addTo(map);

                markersRef.current.b = new mapboxgl.Marker({
                    element: createHtmlElement(dropMarkerHtml(dropoffLabel)),
                    anchor: 'bottom',
                })
                    .setLngLat([endLng, endLat])
                    .addTo(map);

                let coordinates;
                try {
                    const route = await fetchMapboxDirections(
                        { lat, lng },
                        { lat: endLat, lng: endLng },
                        waypoints,
                    );
                    coordinates = route?.coordinates;
                } catch {
                    coordinates = null;
                }
                if (!coordinates?.length) {
                    coordinates = [
                        [lng, lat],
                        [endLng, endLat],
                    ];
                }
                if (cancelled) return;
                setRouteGeoJson(map, coordinates, color);
                const framePoints = [
                    ...coordinates,
                    [lng, lat],
                    [endLng, endLat],
                ];
                const frame = () => frameRoute(map, framePoints);
                frame();
                window.requestAnimationFrame(frame);
                const observer = new ResizeObserver(frame);
                if (containerRef.current) observer.observe(containerRef.current);
                map.__routeFrameObserver = observer;
            });
        });

        return () => {
            cancelled = true;
            markersRef.current = { a: null, b: null };
            if (mapRef.current?.__routeFrameObserver) {
                mapRef.current.__routeFrameObserver.disconnect();
            }
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lat, lng, dropLat, dropLng, pickupLabel, dropoffLabel, waypointKey]);

    return (
        <div className={`relative isolate overflow-hidden bg-[#e8e6e1] ${className}`}>
            <div ref={containerRef} className="almajd-mb-map absolute inset-0 h-full w-full" />
        </div>
    );
}
