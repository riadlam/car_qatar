<?php

namespace App\Filament\Forms;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ViewField;
use Filament\Schemas\Components\Utilities\Get;
use Illuminate\Support\HtmlString;

/**
 * Shared Mapbox search + pin-modal fields for Filament admin forms.
 * UI is a Vite React island reusing the homepage MapLocationModal.
 */
class MapboxLocationFields
{
    /**
     * @param  'qatar'|'gulf'  $scope
     * @return array<int, mixed>
     */
    public static function schema(
        string $scope = 'qatar',
        bool $withAddress = true,
        bool $withPlaceId = true,
        bool $coordsRequired = true,
        bool $showOpenMapButton = false,
    ): array {
        $searchLabel = $scope === 'gulf'
            ? 'Search Mapbox (Gulf)'
            : 'Search Mapbox (Qatar)';
        $placeholder = $scope === 'gulf'
            ? 'e.g. Dubai Marina, Riyadh…'
            : 'e.g. Four Seasons Hotel Doha';

        $fields = [
            ViewField::make('mapbox_location_ui')
                ->hiddenLabel()
                ->dehydrated(false)
                ->view('filament.forms.components.mapbox-location-picker')
                ->viewData([
                    'scope' => $scope,
                    'withAddress' => $withAddress,
                    'withPlaceId' => $withPlaceId,
                    'searchLabel' => $searchLabel,
                    'placeholder' => $placeholder,
                ])
                ->columnSpanFull(),
        ];

        if ($withAddress) {
            $fields[] = TextInput::make('formatted_address')
                ->label('Formatted address')
                ->helperText('Filled from Mapbox. Guests see this as the place label when booking.')
                ->columnSpanFull();
        }

        $fields[] = TextInput::make('latitude')
            ->numeric()
            ->step('any')
            ->required($coordsRequired)
            ->helperText('Saved pin latitude.');

        $fields[] = TextInput::make('longitude')
            ->numeric()
            ->step('any')
            ->required($coordsRequired)
            ->helperText('Saved pin longitude.');

        if ($withPlaceId) {
            $fields[] = TextInput::make('place_id')
                ->label('Mapbox place id')
                ->disabled()
                ->dehydrated();
            $fields[] = TextInput::make('provider')
                ->default('mapbox')
                ->disabled()
                ->dehydrated();
        }

        return $fields;
    }

    public static function statusPlaceholder(Get $get, bool $withAddress = true): HtmlString
    {
        $lat = $get('latitude');
        $lng = $get('longitude');
        $address = $withAddress ? $get('formatted_address') : null;
        if ($lat === null || $lat === '' || $lng === null || $lng === '') {
            return new HtmlString(
                '<div class="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">'
                .'<strong>Not linked yet.</strong> Search Mapbox or click the pin icon to open the map.'
                .'</div>',
            );
        }

        $label = $address ?: 'Pin set';

        return new HtmlString(
            '<div class="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100">'
            .'<strong>Linked (Mapbox).</strong> '
            .e((string) $label)
            .'<br><span class="opacity-80">'.e(number_format((float) $lat, 6).', '.number_format((float) $lng, 6)).'</span>'
            .'</div>',
        );
    }
}
