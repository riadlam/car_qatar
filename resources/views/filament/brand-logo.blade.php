@php
    $height = $height ?? 32;
@endphp
<div class="fi-logo flex items-center gap-2.5" style="height: {{ $height }}px;">
    <svg viewBox="0 0 48 48" class="h-8 w-8 shrink-0" aria-hidden="true">
        <path
            d="M24 2l19 11v22L24 46 5 35V13L24 2z"
            fill="none"
            stroke="#5b0520"
            stroke-width="1.5"
        />
        <path
            d="M24 12l7 24h-3.4l-1.3-4.6h-4.6L20.4 36H17l7-24zm-1.6 12.4h3.2L24 18.9l-1.6 5.5z"
            fill="#5b0520"
        />
    </svg>
    <div class="flex min-w-0 flex-col leading-none">
        <span class="text-base font-semibold tracking-[0.08em] text-[#5b0520]">AL&nbsp;MAJD</span>
        <span class="mt-0.5 hidden text-[9px] font-medium tracking-[0.18em] text-[#6e6e73] uppercase sm:block">
            Chauffeur ops
        </span>
    </div>
</div>
