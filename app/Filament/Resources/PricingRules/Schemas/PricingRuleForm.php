<?php

namespace App\Filament\Resources\PricingRules\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PricingRuleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Scope')
                    ->description('Transfers: Starting fee + distance × price per km. Hourly: hours × price per hour. Tax applied after.')
                    ->columns(2)
                    ->schema([
                        Select::make('service_type_id')
                            ->relationship('serviceType', 'name')
                            ->required(),
                        Select::make('vehicle_class_id')
                            ->relationship(
                                'vehicleClass',
                                'name',
                                fn ($query) => $query
                                    ->where('slug', 'van')
                                    ->where('status', 'active')
                                    ->orderBy('sort_order'),
                            )
                            ->required(),
                        Select::make('city_id')
                            ->relationship('city', 'name')
                            ->default(null),
                        TextInput::make('currency')
                            ->required()
                            ->default('QAR'),
                        TextInput::make('priority')
                            ->numeric()
                            ->default(0)
                            ->helperText('Higher wins if two rules match the same service and class.'),
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                            ])
                            ->required()
                            ->default('active'),
                    ]),
                Section::make('Transfer rates')
                    ->description('Used for One way, Multi stops, Arab Gulf trips, and School chauffeured.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('base_price')
                            ->label('Starting fee')
                            ->helperText('Charged once per trip.')
                            ->required()
                            ->numeric()
                            ->default(0.0),
                        TextInput::make('per_km')
                            ->label('Price per km')
                            ->required()
                            ->numeric()
                            ->default(0.0),
                        TextInput::make('tax_rate')
                            ->label('Tax rate (%)')
                            ->helperText('Set to 0 to hide tax on /booking.')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('%')
                            ->default(15.25),
                    ]),
                Section::make('Hourly rate')
                    ->description('Used when the service is By the hour or City tour.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('hourly_price')
                            ->label('Price per hour')
                            ->helperText('Falls back to Starting fee if left empty.')
                            ->numeric()
                            ->default(null),
                    ]),
            ]);
    }
}
