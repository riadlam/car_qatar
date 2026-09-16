/**
 * Map API explore places into carousel cards + scheduler destinations.
 */
export function mapExplorePlaces(places = []) {
    const list = Array.isArray(places) ? places : [];

    const carousel = list
        .filter((p) => p.show_in_carousel)
        .map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            body: p.body || '',
            img: p.img,
            label: p.label || p.title,
            area: p.area || '',
            lat: p.lat ?? null,
            lng: p.lng ?? null,
            place_id: p.place_id || null,
            formatted_address: p.formatted_address || null,
            provider: p.provider || 'mapbox',
        }));

    const destinations = list
        .filter((p) => p.show_in_scheduler)
        .map((p) => ({
            id: p.slug || String(p.id),
            label: p.label || p.title,
            area: p.area || '',
            lat: p.lat ?? null,
            lng: p.lng ?? null,
            place_id: p.place_id || null,
            formatted_address: p.formatted_address || null,
            provider: p.provider || 'mapbox',
        }));

    return { carousel, destinations };
}

export function placeToDestinationOption(place) {
    if (!place) return null;
    return {
        value: place.slug || place.id || place.value,
        label: place.label || place.title,
        area: place.area || '',
        lat: place.lat ?? null,
        lng: place.lng ?? null,
        place_id: place.place_id || null,
        formatted_address: place.formatted_address || null,
        provider: place.provider || 'mapbox',
    };
}
