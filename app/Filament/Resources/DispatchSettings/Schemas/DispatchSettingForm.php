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
                    ->description('When enabled, chauffeurs only see open bookings whose pickup is within the driving radius of their live location. Offers are sorted nearest-first.')
                    ->schema([
                        Toggle::make('radius_matching_enabled')
                            ->label('Limit offers by pickup radius')
                            ->helperText('Recommended on. Chauffeurs need a fresh GPS location to receive nearby offers.')
                            ->default(true),
                        TextInput::make('offer_radius_km')
                            ->label('Offer radius (km)')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(100)
                            ->required()
                            ->default(15)
                            ->helperText('Driving distance from chauffeur to pickup. 1–100 km.'),
                    ]),
            ]);
    }
}
