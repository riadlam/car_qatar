import '@vitejs/plugin-react/preamble';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../../css/app.css';
import AdminMapboxField from './AdminMapboxField';

/** @type {WeakMap<Element, import('react-dom/client').Root>} */
const roots = new WeakMap();

function findLivewireWire(el) {
    const host = el.closest('[wire\\:id]');
    const id = host?.getAttribute('wire:id');
    if (!id || !window.Livewire?.find) return null;
    try {
        return window.Livewire.find(id);
    } catch {
        return null;
    }
}

function parseBool(value) {
    return value === '1' || value === 'true' || value === true;
}

function readPickerConfig(host) {
    const el = host.closest('[data-admin-mapbox-picker]') || host;
    return {
        label: el.dataset.label || 'Search Mapbox',
        placeholder: el.dataset.placeholder || 'Search…',
        searchScope: el.dataset.scope || 'qatar',
        withAddress: parseBool(el.dataset.withAddress),
        withPlaceId: parseBool(el.dataset.withPlaceId),
        getWire: () => findLivewireWire(el),
    };
}

function mountTarget(el) {
    if (!el) return null;
    if (el.matches?.('[data-admin-mapbox-picker-root]')) return el;
    return el.querySelector?.('[data-admin-mapbox-picker-root]') || el;
}

export function mountAdminMapboxPicker(hostOrRoot) {
    const el = mountTarget(hostOrRoot);
    if (!el) return;

    const props = readPickerConfig(el);
    const existing = roots.get(el);
    if (existing) {
        existing.render(createElement(AdminMapboxField, props));
        el.dataset.mapboxMounted = '1';
        return;
    }

    const root = createRoot(el);
    root.render(createElement(AdminMapboxField, props));
    roots.set(el, root);
    el.dataset.mapboxMounted = '1';
}

export function unmountAdminMapboxPicker(hostOrRoot) {
    const el = mountTarget(hostOrRoot);
    if (!el) return;
    const root = roots.get(el);
    if (root) {
        root.unmount();
        roots.delete(el);
    }
    delete el.dataset.mapboxMounted;
}

function scan(root = document) {
    root.querySelectorAll?.('[data-admin-mapbox-picker]')?.forEach((host) => {
        mountAdminMapboxPicker(host);
    });
}

function remountAll() {
    document.querySelectorAll('[data-admin-mapbox-picker]').forEach((host) => {
        unmountAdminMapboxPicker(host);
    });
    scan();
}

function boot() {
    scan();

    document.addEventListener('livewire:navigated', () => {
        remountAll();
    });

    document.addEventListener('livewire:init', () => {
        if (!window.Livewire?.hook) return;
        window.Livewire.hook('morph.updated', ({ el }) => {
            if (!el) return;
            if (el.matches?.('[data-admin-mapbox-picker]') || el.matches?.('[data-admin-mapbox-picker-root]')) {
                // Same DOM node still has a root — re-render, never createRoot again
                mountAdminMapboxPicker(el);
                return;
            }
            if (el.querySelectorAll) {
                el.querySelectorAll('[data-admin-mapbox-picker]').forEach((host) => {
                    mountAdminMapboxPicker(host);
                });
            }
        });
    });

    // One delayed pass for late Livewire hydrate (root-safe via reuse)
    setTimeout(scan, 200);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

window.mountAdminMapboxPicker = mountAdminMapboxPicker;
window.unmountAdminMapboxPicker = unmountAdminMapboxPicker;
