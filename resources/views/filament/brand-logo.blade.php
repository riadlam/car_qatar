@php
    $height = $height ?? 44;
@endphp
<div class="fi-logo flex items-center gap-3" style="height: {{ $height }}px;">
    <span class="inline-flex h-11 w-auto shrink-0 items-center justify-center" aria-hidden="true">
        <img
            src="{{ asset('images/brand/al-majd-mark.png') }}"
            alt=""
            class="h-full w-auto object-contain"
            draggable="false"
        />
    </span>
    <div class="flex min-w-0 flex-col leading-none">
        <span class="text-base font-semibold tracking-[0.08em] text-[#5b0520]">AL&nbsp;MAJD</span>
        <span class="mt-0.5 hidden text-[9px] font-medium tracking-[0.18em] text-[#6e6e73] uppercase sm:block">
            Chauffeur ops
        </span>
    </div>
</div>
