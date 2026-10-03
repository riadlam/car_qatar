import{k as i,s as c}from"./useMapboxSearch-C_GuZ70P.js";function r(l,a="#5b0520"){return`<div class="almajd-mb-pin-wrap">
      <span class="almajd-mb-pin-label">${i(c(l))}</span>
      <svg width="26" height="34" viewBox="0 0 23 32" fill="none" aria-hidden="true">
        <circle cx="11.29" cy="11.29" r="11.29" fill="#e5dfd8"/>
        <line x1="11.5" y1="20.4" x2="11.5" y2="29.6" stroke="${i(a)}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="11.29" cy="11.29" r="9.4" fill="${i(a)}"/>
        <circle cx="11.29" cy="11.29" r="4.7" fill="#FBF8F2"/>
      </svg>
    </div>`}function s(l){return`<div class="almajd-mb-pin-wrap">
      <span class="almajd-mb-pin-label">${i(c(l))}</span>
      <span class="almajd-mb-pin-b"><span class="almajd-mb-pin-b-dot"></span></span>
    </div>`}function n(l="#5b0520"){return`<div class="almajd-mb-simple-pin">
      <svg width="26" height="34" viewBox="0 0 23 32" fill="none" aria-hidden="true">
        <circle cx="11.29" cy="11.29" r="11.29" fill="#e5dfd8"/>
        <line x1="11.5" y1="20.4" x2="11.5" y2="29.6" stroke="${i(l)}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="11.29" cy="11.29" r="9.4" fill="${i(l)}"/>
        <circle cx="11.29" cy="11.29" r="4.7" fill="#FBF8F2"/>
      </svg>
    </div>`}function t(){return`<div class="almajd-mb-car-wrap">
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
    </div>`}function d(l){const a=document.createElement("div");return a.className="almajd-mb-marker",a.innerHTML=l,a}export{d as c,s as d,r as p,n as s,t as v};
