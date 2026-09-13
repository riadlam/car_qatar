<?php

namespace App\Filament\Resources\Vehicles\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class VehicleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('partner_id')
                    ->relationship('partner', 'id')
                    ->required(),
                Select::make('vehicle_class_id')
                    ->relationship(
                        'vehicleClass',
                        'name',
                        fn ($query) => $query->where('status', 'active')->orderBy('sort_order'),
                    )
                    ->required(),
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
                TextInput::make('passengers')
                    ->numeric()
                    ->default(null),
                TextInput::make('luggage')
                    ->numeric()
                    ->default(null),
                TextInput::make('status')
                    ->required()
                    ->default('active'),
            ]);
    }
}
