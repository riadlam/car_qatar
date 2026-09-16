<?php

namespace App\Filament\Resources\RideOffers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RideOfferForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Offer')
                    ->columns(2)
                    ->schema([
                        Select::make('booking_id')
                            ->relationship('booking', 'booking_number')
                            ->searchable()
                            ->required(),
                        TextInput::make('status')
                            ->required()
                            ->default('pending'),
                        Select::make('chauffeur_id')
                            ->relationship('chauffeur', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->user?->name ?: 'Chauffeur #'.$record->id)
                            ->searchable()
                            ->required(),
                        Select::make('vehicle_id')
                            ->relationship('vehicle', 'license_plate')
                            ->searchable()
                            ->default(null),
                    ]),
                Section::make('Timing')
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('offered_at'),
                        DateTimePicker::make('expires_at'),
                        DateTimePicker::make('responded_at'),
                        Textarea::make('notes')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
