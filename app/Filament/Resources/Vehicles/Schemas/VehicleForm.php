<?php

namespace App\Filament\Resources\Vehicles\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VehicleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Ownership')
                    ->columns(2)
                    ->schema([
                        Select::make('partner_id')
                            ->relationship('partner', 'display_name')
                            ->searchable()
                            ->required(),
                        Select::make('vehicle_class_id')
                            ->relationship(
                                'vehicleClass',
                                'name',
                                fn ($query) => $query->where('status', 'active')->orderBy('sort_order'),
                            )
                            ->required(),
                        TextInput::make('status')
                            ->required()
                            ->default('active'),
                    ]),
                Section::make('Specs')
                    ->columns(2)
                    ->schema([
                        TextInput::make('manufacturer')
                            ->default(null),
                        TextInput::make('model')
                            ->default(null),
                        TextInput::make('year')
                            ->numeric()
                            ->default(null),
                        TextInput::make('color')
                            ->default(null),
                        TextInput::make('license_plate')
                            ->required(),
                        TextInput::make('vin')
                            ->default(null),
                    ]),
                Section::make('Capacity')
                    ->columns(2)
                    ->schema([
                        TextInput::make('passengers')
                            ->numeric()
                            ->default(null),
                        TextInput::make('luggage')
                            ->numeric()
                            ->default(null),
                    ]),
            ]);
    }
}
