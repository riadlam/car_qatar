import { escapeHtml, shortPlace } from './mapboxClient';

export function pinMarkerHtml(label, color = '#5b0520') {
    return `<div class="almajd-mb-pin-wrap">
      <span class="almajd-mb-pin-label">${escapeHtml(shortPlace(label))}</span>
      <svg width="26" height="34" viewBox="0 0 23 32" fill="none" aria-hidden="true">
        <circle cx="11.29" cy="11.29" r="11.29" fill="#e5dfd8"/>
        <line x1="11.5" y1="20.4" x2="11.5" y2="29.6" stroke="${escapeHtml(color)}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="11.29" cy="11.29" r="9.4" fill="${escapeHtml(color)}"/>
        <circle cx="11.29" cy="11.29" r="4.7" fill="#FBF8F2"/>
      </svg>
    </div>`;
}

export function dropMarkerHtml(label) {
    return `<div class="almajd-mb-pin-wrap">
      <span class="almajd-mb-pin-label">${escapeHtml(shortPlace(label))}</span>
      <span class="almajd-mb-pin-b"><span class="almajd-mb-pin-b-dot"></span></span>
    </div>`;
}

export function simplePinHtml(color = '#5b0520') {
    return `<div class="almajd-mb-simple-pin">
      <svg width="26" height="34" viewBox="0 0 23 32" fill="none" aria-hidden="true">
        <circle cx="11.29" cy="11.29" r="11.29" fill="#e5dfd8"/>
        <line x1="11.5" y1="20.4" x2="11.5" y2="29.6" stroke="${escapeHtml(color)}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="11.29" cy="11.29" r="9.4" fill="${escapeHtml(color)}"/>
        <circle cx="11.29" cy="11.29" r="4.7" fill="#FBF8F2"/>
      </svg>
    </div>`;
}

export function vanMarkerHtml() {
    return `<div class="almajd-mb-car-wrap">
      <div class="almajd-mb-car-glow"></div>
      <div class="almajd-mb-car-rot">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <ellipse cx="22" cy="24" rx="10" ry="15" fill="rgba(15,19,25,0.16)"/>
          <path d="M14 8.5h16c1.4 0 2.5 1.1 2.5 2.5v16.2c0 1.6-1.2 2.8-2.8 2.8H14.3c-1.6 0-2.8-1.2-2.8-2.8V11c0-1.4 1.1-2.5 2.5-2.5Z" fill="#1a0a10"/>
          <path d="M15.2 10h13.6c.9 0 1.6.7 1.6 1.6v14.4c0 1-.8 1.8-1.8 1.8H15.4c-1 0-1.8-.8-1.8-1.8V11.6c0-.9.7-1.6 1.6-1.6Z" fill="#5b0520"/>
          <path d="M16.4 11.6h11.2c.5 0 .9.4.9.9v5.2c0 .5-.4.9-.9.9H16.4c-.5 0-.9-.4-.9-.9v-5.2c0-.5.4-.9.9-.9Z" fill="#f7d6e0"/>
          <rect x="16.2" y="20.4" width="11.6" height="5.2" rx="1" fill="#e5dfd8" fill-opacity="0.72"/>
          <circle cx="16.6" cy="28.6" r="1.5" fill="#0f1319"/>
          <circle cx="27.4" cy="28.6" r="1.5" fill="#0f1319"/>
          <path d="M20.2 8.8h3.6" stroke="#FBF8F2" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    </div>`;
}

export function carMarkerHtml() {
    return `<div class="almajd-mb-car-wrap">
      <div class="almajd-mb-car-glow"></div>
      <div class="almajd-mb-car-rot">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
          <ellipse cx="21" cy="24" rx="9.5" ry="15" fill="rgba(15,19,25,0.16)"/>
          <path d="M21 4.8c-2.35 0-4.25.7-5.45 2-1.3 1.45-2 3.65-2.1 6.3l-.35 9.2c-.06 1.55.32 2.75 1.2 3.6.8.8 2 1.25 3.45 1.35l3.25.22 3.25-.22c1.45-.1 2.65-.55 3.45-1.35.88-.85 1.26-2.05 1.2-3.6l-.35-9.2c-.1-2.65-.8-4.85-2.1-6.3C25.25 5.5 23.35 4.8 21 4.8Z" fill="#1a0a10"/>
          <path d="M21 6.2c-1.9 0-3.35.5-4.3 1.55-1 1.1-1.55 2.9-1.65 5.2l-.28 8.35c-.04 1.1.22 1.95.78 2.5.5.5 1.35.85 2.4.95l3.05.2 3.05-.2c1.05-.1 1.9-.45 2.4-.95.56-.55.82-1.4.78-2.5l-.28-8.35c-.1-2.3-.65-4.1-1.65-5.2C24.35 6.7 22.9 6.2 21 6.2Z" fill="#5b0520"/>
          <path d="M17.05 12.6c.4-1.85 1.5-2.85 3.95-2.85s3.55 1 3.95 2.85l.6 3.7c.1.6-.28 1.1-.82 1.15h-7.46c-.54-.05-.92-.55-.82-1.15l.6-3.7Z" fill="#f7d6e0"/>
          <path d="M16.85 24.8c.28 1.5 1.25 2.3 4.15 2.3s3.87-.8 4.15-2.3l.38-1.85c.08-.45-.22-.82-.65-.88h-7.76c-.43.06-.73.43-.65.88l.38 1.85Z" fill="#e5dfd8" fill-opacity="0.7"/>
          <rect x="14.7" y="18.2" width="2.35" height="3.7" rx="1.05" fill="#0f1319" fill-opacity="0.32"/>
          <rect x="24.95" y="18.2" width="2.35" height="3.7" rx="1.05" fill="#0f1319" fill-opacity="0.32"/>
          <path d="M19 8.35h4" stroke="#FBF8F2" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </div>
    </div>`;
}

export function createHtmlElement(html) {
    const el = document.createElement('div');
    el.className = 'almajd-mb-marker';
    el.innerHTML = html;
    return el;
}
