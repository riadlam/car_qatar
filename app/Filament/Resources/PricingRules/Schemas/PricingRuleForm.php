<?php

namespace App\Filament\Resources\PricingRules\Schemas;

use App\Models\ServiceType;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class PricingRuleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Scope')
                    ->description('Transfers: Starting fee + distance × per km + duration × per minute. Hourly: hours × price per hour. Tax applied after.')
                    ->columns(2)
                    ->schema([
                        Select::make('service_type_id')
                            ->relationship('serviceType', 'name')
                            ->required()
                            ->live(),
                        Select::make('vehicle_class_id')
                            ->relationship(
                                'vehicleClass',
                                'name',
                                fn ($query) => $query
                                    ->where('status', 'active')
                                    ->orderBy('sort_order'),
                            )
                            ->required(),
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
                        TextInput::make('tax_rate')
                            ->label('Tax rate (%)')
                            ->helperText('Set to 0 to hide tax on /booking.')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('%')
                            ->default(15.25),
                    ]),
                Section::make('Transfer rates')
                    ->description('Starting fee + distance × per km + duration × per minute. Used for One way, Multi stops, Arab Gulf trips, and School chauffeured.')
                    ->columns(2)
                    ->visible(fn (Get $get): bool => ! self::isHourlyService($get('service_type_id')))
                    ->schema([
                        TextInput::make('base_price')
                            ->label('Starting fee')
                            ->helperText('Charged once per trip.')
                            ->required()
                            ->numeric()
                            ->default(0.0),
                        TextInput::make('per_km')
                            ->label('Price per km')
                            ->helperText('Charged from estimated trip distance.')
                            ->required()
                            ->numeric()
                            ->default(0.0),
                        TextInput::make('per_minute')
                            ->label('Price per minute')
                            ->helperText('Charged from estimated trip duration (route minutes). Set 0 to charge distance only.')
                            ->required()
                            ->numeric()
                            ->default(0.0),
                    ]),
                Section::make('Hourly rate')
                    ->description('Used when the service is By the hour or City tour. Time is sold in hours — per-minute transfer rates do not apply.')
                    ->columns(2)
                    ->visible(fn (Get $get): bool => self::isHourlyService($get('service_type_id')))
                    ->schema([
                        TextInput::make('hourly_price')
                            ->label('Price per hour')
                            ->helperText('Falls back to Starting fee if left empty.')
                            ->numeric()
                            ->default(null),
                    ]),
            ]);
    }

    private static function isHourlyService(mixed $serviceTypeId): bool
    {
        if (! $serviceTypeId) {
            return false;
        }

        $service = ServiceType::query()->find($serviceTypeId);

        if (! $service) {
            return false;
        }

        return (bool) $service->is_hourly || $service->mode === 'hourly';
    }
}
