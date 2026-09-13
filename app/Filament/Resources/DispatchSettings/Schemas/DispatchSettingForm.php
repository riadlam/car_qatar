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
                    ->description('Radius matching is off by default, so every active chauffeur sees every open booking. Turn it on to limit offers to chauffeurs whose Mapbox driving distance to the pickup is inside the radius.')
                    ->schema([
                        Toggle::make('radius_matching_enabled')
                            ->label('Limit offers by pickup radius')
                            ->helperText('Leave off on local. Turn on for the live server.')
                            ->default(false),
                        TextInput::make('offer_radius_km')
                            ->label('Offer radius (km)')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(100)
                            ->required()
                            ->default(10)
                            ->helperText('Used only when radius matching is on. 1–100 km driving distance from the pickup.'),
                    ]),
            ]);
    }
}
