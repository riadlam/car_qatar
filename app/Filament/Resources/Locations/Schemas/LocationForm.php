<?php

namespace App\Filament\Resources\Locations\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class LocationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('type')
                    ->required(),
                TextInput::make('name')
                    ->default(null),
                TextInput::make('formatted_address')
                    ->default(null),
                TextInput::make('address_line1')
                    ->default(null),
                TextInput::make('address_line2')
                    ->default(null),
                TextInput::make('postal_code')
                    ->default(null),
                Select::make('city_id')
                    ->relationship('city', 'name')
                    ->default(null),
                Select::make('country_id')
                    ->relationship('country', 'name')
                    ->default(null),
                TextInput::make('latitude')
                    ->numeric()
                    ->default(null),
                TextInput::make('longitude')
                    ->numeric()
                    ->default(null),
                TextInput::make('provider')
                    ->default(null),
                TextInput::make('place_id')
                    ->default(null),
                Textarea::make('metadata')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
