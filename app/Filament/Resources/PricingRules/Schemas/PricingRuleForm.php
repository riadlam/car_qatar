<?php

namespace App\Filament\Resources\PricingRules\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PricingRuleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('service_type_id')
                    ->relationship('serviceType', 'name')
                    ->required(),
                Select::make('vehicle_class_id')
                    ->relationship(
                        'vehicleClass',
                        'name',
                        fn ($query) => $query->where('status', 'active')->orderBy('sort_order'),
                    )
                    ->required(),
                Select::make('city_id')
                    ->relationship('city', 'name')
                    ->default(null),
                TextInput::make('currency')
                    ->required()
                    ->default('USD'),
                TextInput::make('base_price')
                    ->required()
                    ->numeric()
                    ->default(0.0)
                    ->prefix('$'),
                TextInput::make('per_km')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('per_minute')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('minimum_price')
                    ->required()
                    ->numeric()
                    ->default(0.0)
                    ->prefix('$'),
                TextInput::make('hourly_price')
                    ->numeric()
                    ->default(null)
                    ->prefix('$'),
                TextInput::make('included_km_per_hour')
                    ->numeric()
                    ->default(null),
                TextInput::make('extra_km_price')
                    ->numeric()
                    ->default(null)
                    ->prefix('$'),
                TextInput::make('extra_minute_price')
                    ->numeric()
                    ->default(null)
                    ->prefix('$'),
                TextInput::make('waiting_price')
                    ->numeric()
                    ->default(null)
                    ->prefix('$'),
                TextInput::make('tax_rate')
                    ->label('Tax rate (%)')
                    ->helperText('Set to 0 to hide tax on /booking.')
                    ->numeric()
                    ->minValue(0)
                    ->suffix('%')
                    ->default(15.25),
                DateTimePicker::make('starts_at'),
                DateTimePicker::make('ends_at'),
                TextInput::make('priority')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('status')
                    ->required()
                    ->default('active'),
            ]);
    }
}
