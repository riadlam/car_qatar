/**
 * Field-level Mapbox search scopes.
 * Field scope always wins over Filament country_codes for suggest / map bounds.
 */

/** [west, south, east, north] */
const QATAR_BBOX = [50.65, 24.4, 51.75, 26.25];
/** Broad GCC envelope covering QA, AE, SA, OM, KW, BH */
const GULF_BBOX = [34.4, 12.4, 60.0, 32.2];

const DOHA = { lng: 51.531, lat: 25.2854 };

/**
 * Flip to true to restore the Qatar (and school-in-Qatar) lock on the hero booking only.
 * Explore Qatar pages stay scoped even while this is false.
 */
export const HERO_QATAR_LIMIT = false;

const SCOPES = {
    qatar: {
        id: 'qatar',
        countries: ['qa'],
        bbox: QATAR_BBOX,
        proximity: DOHA,
        types: null,
        poiCategories: null,
        /** Prevent zooming out to the whole planet */
        minZoom: 8,
        fitMaxZoom: 11,
        outOfBoundsMessage: 'Select a location in Qatar.',
        searchHint: 'Search address, airport, hotel in Qatar…',
        mapHint: 'Tap the map to set a pin in Qatar.',
    },
    school: {
        id: 'school',
        countries: ['qa'],
        bbox: QATAR_BBOX,
        proximity: DOHA,
        types: ['poi'],
        poiCategories: ['school', 'university', 'college'],
        minZoom: 8,
        fitMaxZoom: 11,
        outOfBoundsMessage: 'Select a school or university in Qatar.',
        searchHint: 'Search for a school or university…',
        mapHint: 'Search for a school or university, or tap the map in Qatar.',
    },
    gulf: {
        id: 'gulf',
        countries: ['qa', 'ae', 'sa', 'om', 'kw', 'bh'],
        bbox: GULF_BBOX,
        proximity: DOHA,
        types: null,
        poiCategories: null,
        minZoom: 4,
        fitMaxZoom: 6,
        outOfBoundsMessage: 'Select a location in the Gulf (GCC).',
        searchHint: 'Search address in the Gulf…',
        mapHint: 'Tap the map to set a pin in the Gulf region.',
    },
    world: {
        id: 'world',
        countries: null,
        bbox: null,
        proximity: DOHA,
        types: null,
        poiCategories: null,
        minZoom: 2,
        fitMaxZoom: 11,
        outOfBoundsMessage: '',
        searchHint: 'Search address, airport, hotel…',
        mapHint: 'Tap the map to set a pin.',
    },
};

export function getSearchScope(id = 'qatar') {
    return SCOPES[id] || SCOPES.qatar;
}

/** Hero booking scope. Gulf stays Gulf; Qatar and school open worldwide while the flag is off. */
export function heroSearchScope(scope = 'qatar') {
    if (HERO_QATAR_LIMIT) return scope;
    if (scope === 'gulf') return 'gulf';
    return 'world';
}

/** bbox is [west, south, east, north] */
export function pointInBbox(lng, lat, bbox) {
    if (!bbox || bbox.length !== 4) return true;
    const [west, south, east, north] = bbox;
    return lng >= west && lng <= east && lat >= south && lat <= north;
}

/**
 * Expand bbox so Mapbox GL maxBounds still works when the container
 * is wider/taller than the country (tight bounds get ignored otherwise).
 */
export function expandBbox(bbox, factor = 0.35) {
    if (!bbox || bbox.length !== 4) return bbox;
    const [west, south, east, north] = bbox;
    const lngPad = Math.max((east - west) * factor, 0.15);
    const latPad = Math.max((north - south) * factor, 0.15);
    return [west - lngPad, south - latPad, east + lngPad, north + latPad];
}

/** Mapbox GL maxBounds / fitBounds: [[west, south], [east, north]] */
export function bboxToMaxBounds(bbox) {
    if (!bbox || bbox.length !== 4) return undefined;
    const [west, south, east, north] = bbox;
    return [
        [west, south],
        [east, north],
    ];
}
