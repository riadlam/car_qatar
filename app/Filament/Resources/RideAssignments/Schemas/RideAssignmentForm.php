<?php

namespace App\Filament\Resources\RideAssignments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RideAssignmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Assignment')
                    ->columns(2)
                    ->schema([
                        Select::make('booking_id')
                            ->relationship('booking', 'booking_number')
                            ->searchable()
                            ->required(),
                        TextInput::make('status')
                            ->required()
                            ->default('assigned'),
                        Select::make('chauffeur_id')
                            ->relationship('chauffeur', 'id')
                            ->getOptionLabelFromRecordUsing(fn ($record) => $record->user?->name ?: 'Chauffeur #'.$record->id)
                            ->searchable()
                            ->required(),
                        Select::make('vehicle_id')
                            ->relationship('vehicle', 'license_plate')
                            ->searchable()
                            ->default(null),
                        Select::make('ride_offer_id')
                            ->relationship('rideOffer', 'id')
                            ->default(null),
                    ]),
                Section::make('Timeline')
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('assigned_at'),
                        DateTimePicker::make('started_at'),
                        DateTimePicker::make('completed_at'),
                    ]),
            ]);
    }
}
