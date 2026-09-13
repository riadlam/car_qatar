<?php

namespace App\Filament\Resources\Chauffeurs\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ChauffeurForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Placeholder::make('applicant_email')
                    ->label('Email')
                    ->content(fn ($record) => $record?->user?->email ?: '—'),
                Placeholder::make('applicant_phone')
                    ->label('Phone')
                    ->content(fn ($record) => $record?->user?->phone ?: '—'),
                Select::make('partner_id')
                    ->relationship('partner', 'id')
                    ->default(null),
                TextInput::make('license_number')
                    ->default(null),
                TextInput::make('license_country')
                    ->default(null),
                DatePicker::make('license_expires_at'),
                TextInput::make('rating')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('ratings_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('completed_rides')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('current_latitude')
                    ->numeric()
                    ->default(null),
                TextInput::make('current_longitude')
                    ->numeric()
                    ->default(null),
                DateTimePicker::make('last_location_at'),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
            ]);
    }
}
