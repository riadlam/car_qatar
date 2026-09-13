import api from '../bootstrap';

const DEFAULT_CONFIG = {
    style_uri: 'mapbox://styles/mapbox/standard',
    basemap_theme: 'faded',
    default_latitude: 25.2854,
    default_longitude: 51.531,
    default_zoom: 11,
    country_codes: ['qa', 'ae', 'sa', 'om', 'kw', 'bh'],
    language: 'en',
    directions_profile: 'mapbox/driving-traffic',
    show_traffic: true,
    marker_color: '#5b0520',
    status: 'active',
    has_public_token: false,
};

let cachedConfig = null;
let configPromise = null;
let runtimeToken = '';

export function getMapboxToken() {
    return runtimeToken;
}

export function hasMapboxToken() {
    return Boolean(getMapboxToken());
}

export async function fetchMapConfig() {
    if (cachedConfig) return cachedConfig;
    if (configPromise) return configPromise;

    configPromise = api
        .get('/map-config')
        .then(({ data }) => {
            cachedConfig = { ...DEFAULT_CONFIG, ...(data.data || data || {}) };
            const token = String(cachedConfig.access_token || '');
            if (token.startsWith('pk.')) runtimeToken = token;
            cachedConfig.access_token = undefined;
            cachedConfig.has_public_token = hasMapboxToken();
            return cachedConfig;
        })
        .catch(() => {
            cachedConfig = { ...DEFAULT_CONFIG, has_public_token: hasMapboxToken() };
            return cachedConfig;
        })
        .finally(() => {
            configPromise = null;
        });

    return configPromise;
}

export function mapInitOptions(container, config, overrides = {}) {
    const token = getMapboxToken();
    const center = [
        Number(overrides.lng ?? config.default_longitude),
        Number(overrides.lat ?? config.default_latitude),
    ];

    const options = {
        accessToken: token,
        container,
        style: config.style_uri || DEFAULT_CONFIG.style_uri,
        center,
        zoom: Number(overrides.zoom ?? config.default_zoom ?? 11),
        attributionControl: false,
        renderWorldCopies: overrides.renderWorldCopies ?? false,
        // Standard style defaults to globe — keep flat map for scoped pickers
        projection: overrides.projection || 'mercator',
    };

    if (overrides.minZoom != null) {
        options.minZoom = Number(overrides.minZoom);
    }
    if (overrides.maxZoom != null) {
        options.maxZoom = Number(overrides.maxZoom);
    }

    if (String(options.style).includes('standard')) {
        options.config = {
            basemap: {
                theme: config.basemap_theme || 'faded',
            },
        };
    }

    if (overrides.maxBounds) {
        options.maxBounds = overrides.maxBounds;
    } else if (overrides.bbox?.length === 4) {
        const [west, south, east, north] = overrides.bbox;
        options.maxBounds = [
            [west, south],
            [east, north],
        ];
    }

    // Initial camera framed to region (avoids flashing the whole planet)
    if (overrides.bounds) {
        options.bounds = overrides.bounds;
        options.fitBoundsOptions = overrides.fitBoundsOptions || { padding: 40 };
    }

    return options;
}

export function addCompactAttribution(map) {
    return map;
}

export function shortPlace(label) {
    if (!label) return 'STOP';
    const cleaned = String(label).replace(/,.*/, '').trim();
    return cleaned.length > 16 ? `${cleaned.slice(0, 14)}…` : cleaned;
}

export function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
