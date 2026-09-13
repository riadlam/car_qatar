<?php

namespace App\Filament\Resources\Bookings\Schemas;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Booking')
                    ->columns(2)
                    ->schema([
                        TextInput::make('booking_number')
                            ->required()
                            ->disabledOn('edit')
                            ->dehydrated(),
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->required(),
                        Select::make('quote_id')
                            ->relationship('quote', 'quote_number')
                            ->searchable()
                            ->default(null),
                        Select::make('service_type_id')
                            ->relationship('serviceType', 'name')
                            ->required(),
                        Select::make('status')
                            ->options(BookingStatus::class)
                            ->default('pending')
                            ->required(),
                        Select::make('payment_status')
                            ->options(PaymentStatus::class)
                            ->default('pending')
                            ->required(),
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
                        DateTimePicker::make('pickup_at')
                            ->required(),
                        TextInput::make('timezone')
                            ->required()
                            ->default('UTC'),
                        TextInput::make('passenger_count')
                            ->required()
                            ->numeric()
                            ->default(1),
                        TextInput::make('luggage_count')
                            ->numeric()
                            ->default(null),
                        Select::make('vehicle_class_id')
                            ->relationship(
                                'vehicleClass',
                                'name',
                                fn ($query) => $query->where('status', 'active')->orderBy('sort_order'),
                            )
                            ->required(),
                        Select::make('seat_addon_id')
                            ->relationship('seatAddon', 'label')
                            ->default(null),
                    ]),
                Section::make('Pricing snapshot')
                    ->description('Amounts are calculated at quote/booking time and are read-only.')
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
                        TextInput::make('total_amount')
                            ->numeric()
                            ->default(0.0)
                            ->disabled()
                            ->dehydrated(false),
                    ]),
                Section::make('Notes & references')
                    ->columns(2)
                    ->schema([
                        Textarea::make('customer_notes')
                            ->default(null)
                            ->columnSpanFull(),
                        Textarea::make('chauffeur_notes')
                            ->default(null)
                            ->columnSpanFull(),
                        TextInput::make('pickup_sign')
                            ->default(null),
                        TextInput::make('customer_reference')
                            ->default(null),
                        TextInput::make('cost_center_id')
                            ->numeric()
                            ->default(null),
                        TextInput::make('preferred_language')
                            ->default(null),
                        Textarea::make('billing')
                            ->default(null)
                            ->columnSpanFull(),
                        DateTimePicker::make('cancelled_at'),
                        DateTimePicker::make('completed_at'),
                    ]),
            ]);
    }
}
