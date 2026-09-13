<?php

namespace App\Filament\Resources\RideOffers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class RideOfferForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('booking_id')
                    ->relationship('booking', 'id')
                    ->required(),
                Select::make('chauffeur_id')
                    ->relationship('chauffeur', 'id')
                    ->required(),
                Select::make('vehicle_id')
                    ->relationship('vehicle', 'id')
                    ->default(null),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                DateTimePicker::make('offered_at'),
                DateTimePicker::make('expires_at'),
                DateTimePicker::make('responded_at'),
                Textarea::make('notes')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
