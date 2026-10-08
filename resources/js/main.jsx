import '../css/app.css';
import './i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * After a deploy, a cached entry chunk can request an old hashed asset that no
 * longer exists. Nginx used to return the SPA HTML for that URL, which crashes
 * the app (MIME type text/html). Recover with a one-time hard reload.
 */
const CHUNK_RELOAD_KEY = 'almajd_chunk_reload';

function isChunkLoadError(error) {
    const msg = String(error?.message || error || '');
    return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk|MIME type of "text\/html"/i.test(
        msg,
    );
}

function recoverFromStaleChunk() {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
    window.location.reload();
}

window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    recoverFromStaleChunk();
});

window.addEventListener('unhandledrejection', (event) => {
    if (!isChunkLoadError(event.reason)) return;
    event.preventDefault();
    recoverFromStaleChunk();
});

window.addEventListener('load', () => {
    // Clear the one-shot flag after a successful boot so later deploys can recover again.
    window.setTimeout(() => sessionStorage.removeItem(CHUNK_RELOAD_KEY), 2500);
});

createRoot(document.getElementById('app')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
