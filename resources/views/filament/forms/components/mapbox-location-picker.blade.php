@php
    $scope = $scope ?? 'qatar';
    $withAddress = $withAddress ?? true;
    $withPlaceId = $withPlaceId ?? true;
    $searchLabel = $searchLabel ?? 'Search Mapbox';
    $placeholder = $placeholder ?? 'Search address…';
@endphp

{{-- React island: hero MapLocationModal via Vite adminMapboxPicker.jsx --}}
{{-- Outer: Livewire ignore + config. Inner: stable React createRoot host. --}}
<div
    wire:ignore
    data-admin-mapbox-picker
    data-scope="{{ $scope }}"
    data-with-address="{{ $withAddress ? '1' : '0' }}"
    data-with-place-id="{{ $withPlaceId ? '1' : '0' }}"
    data-label="{{ $searchLabel }}"
    data-placeholder="{{ $placeholder }}"
    class="min-h-[4.5rem] w-full"
>
    <div data-admin-mapbox-picker-root class="w-full"></div>
</div>
