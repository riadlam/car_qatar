<?php

namespace App\Filament\Resources\Locations\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LocationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Place')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->default(null),
                        TextInput::make('type')
                            ->required(),
                        TextInput::make('formatted_address')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
                Section::make('Address')
                    ->columns(2)
                    ->schema([
                        TextInput::make('address_line1')
                            ->default(null),
                        TextInput::make('address_line2')
                            ->default(null),
                        TextInput::make('postal_code')
                            ->default(null),
                        Select::make('city_id')
                            ->relationship('city', 'name')
                            ->searchable()
                            ->default(null),
                        Select::make('country_id')
                            ->relationship('country', 'name')
                            ->searchable()
                            ->default(null),
                    ]),
                Section::make('Coordinates')
                    ->columns(2)
                    ->schema([
                        TextInput::make('latitude')
                            ->numeric()
                            ->default(null),
                        TextInput::make('longitude')
                            ->numeric()
                            ->default(null),
                    ]),
                Section::make('Provider')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
                        TextInput::make('provider')
                            ->default(null),
                        TextInput::make('place_id')
                            ->default(null),
                        Textarea::make('metadata')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
