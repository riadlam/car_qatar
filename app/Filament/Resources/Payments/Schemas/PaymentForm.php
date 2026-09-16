<?php

namespace App\Filament\Resources\Payments\Schemas;

use App\Enums\PaymentStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PaymentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Payment')
                    ->columns(2)
                    ->schema([
                        Select::make('booking_id')
                            ->relationship('booking', 'booking_number')
                            ->searchable()
                            ->required(),
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->default(null),
                        TextInput::make('amount')
                            ->required()
                            ->numeric(),
                        TextInput::make('currency')
                            ->required()
                            ->default('QAR'),
                        Select::make('status')
                            ->options(PaymentStatus::class)
                            ->default('pending')
                            ->required(),
                        TextInput::make('method')
                            ->default(null),
                    ]),
                Section::make('Provider')
                    ->columns(2)
                    ->schema([
                        TextInput::make('provider')
                            ->default(null),
                        TextInput::make('provider_payment_id')
                            ->label('Provider payment ID')
                            ->default(null),
                        Textarea::make('metadata')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
                Section::make('Timeline')
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('paid_at'),
                    ]),
            ]);
    }
}
