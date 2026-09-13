<?php

namespace App\Filament\Resources\Quotes\Schemas;

use App\Enums\QuoteStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class QuoteForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Quote')
                    ->columns(2)
                    ->schema([
                        TextInput::make('quote_number')
                            ->required()
                            ->disabledOn('edit')
                            ->dehydrated(),
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->default(null),
                        Select::make('service_type_id')
                            ->relationship('serviceType', 'name')
                            ->required(),
                        Select::make('vehicle_class_id')
                            ->relationship(
                                'vehicleClass',
                                'name',
                                fn ($query) => $query->where('status', 'active')->orderBy('sort_order'),
                            )
                            ->default(null),
                        Select::make('status')
                            ->options(QuoteStatus::class)
                            ->default('draft')
                            ->required(),
                        DateTimePicker::make('expires_at'),
                    ]),
                Section::make('Trip')
                    ->columns(2)
                    ->schema([
                        Select::make('pickup_location_id')
                            ->relationship('pickupLocation', 'name')
                            ->searchable()
                            ->required(),
                        Select::make('dropoff_location_id')
                            ->relationship('dropoffLocation', 'name')
                            ->searchable()
                            ->default(null),
                        DateTimePicker::make('pickup_at'),
                        TextInput::make('timezone')
                            ->required()
                            ->default('UTC'),
                        TextInput::make('duration_minutes')
                            ->numeric()
                            ->default(null),
                        TextInput::make('passenger_count')
                            ->numeric()
                            ->default(null),
                        TextInput::make('student_count')
                            ->numeric()
                            ->default(null),
                        TextInput::make('school_term')
                            ->default(null),
                        Select::make('gulf_destination_id')
                            ->relationship('gulfDestination', 'name')
                            ->default(null),
                    ]),
                Section::make('Pricing snapshot')
                    ->description('Amounts are calculated by pricing rules and are read-only.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('currency')
                            ->required()
                            ->default('USD')
                            ->disabled()
                            ->dehydrated(),
                        TextInput::make('subtotal')
                            ->numeric()
                            ->default(0.0)
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('tax_amount')
                            ->numeric()
                            ->default(0.0)
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('fees')
                            ->numeric()
                            ->default(0.0)
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('discount')
                            ->numeric()
                            ->default(0.0)
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('total')
                            ->numeric()
                            ->default(0.0)
                            ->disabled()
                            ->dehydrated(false),
                    ]),
                Section::make('Metadata')
                    ->schema([
                        Textarea::make('metadata')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
