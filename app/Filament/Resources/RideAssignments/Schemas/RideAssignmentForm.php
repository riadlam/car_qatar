<?php

namespace App\Filament\Resources\RideAssignments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RideAssignmentForm
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
                Select::make('ride_offer_id')
                    ->relationship('rideOffer', 'id')
                    ->default(null),
                TextInput::make('status')
                    ->required()
                    ->default('assigned'),
                DateTimePicker::make('assigned_at'),
                DateTimePicker::make('started_at'),
                DateTimePicker::make('completed_at'),
            ]);
    }
}
