<?php

namespace App\Filament\Resources\Airports\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AirportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identity')
                    ->columns(2)
                    ->schema([
                        Select::make('city_id')
                            ->relationship('city', 'name')
                            ->searchable()
                            ->required(),
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('iata_code')
                            ->label('IATA')
                            ->required()
                            ->maxLength(3),
                        TextInput::make('timezone')
                            ->default(null),
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false),
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
            ]);
    }
}
