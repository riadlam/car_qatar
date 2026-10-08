<?php

namespace App\Filament\Resources\DispatchSettings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DispatchSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Dispatch settings')
                    ->description('When enabled, chauffeurs only see open bookings whose pickup is within this radius of their live GPS. Offers outside the radius are hidden and withdrawn. Sorted nearest-first.')
                    ->schema([
                        Toggle::make('radius_matching_enabled')
                            ->label('Limit offers by pickup radius')
                            ->helperText('Keep ON in production. When off, every active chauffeur sees every open booking (legacy always-show). Chauffeurs need fresh GPS while this is on.')
                            ->default(true),
                        TextInput::make('offer_radius_km')
                            ->label('Offer radius (km)')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(100)
                            ->required()
                            ->default(15)
                            ->helperText('Straight-line distance from chauffeur GPS to pickup (Mapbox driving distance also applied when available). 1–100 km. Saved value is enforced on every offers poll.'),
                    ]),
            ]);
    }
}
