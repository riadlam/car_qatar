<?php

namespace App\Filament\Resources\Chauffeurs\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ChauffeurForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Account')
                    ->columns(2)
                    ->schema([
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->required(),
                        Select::make('partner_id')
                            ->relationship('partner', 'display_name')
                            ->searchable()
                            ->default(null),
                        Placeholder::make('applicant_email')
                            ->label('Email')
                            ->content(fn ($record) => $record?->user?->email ?: '—'),
                        Placeholder::make('applicant_phone')
                            ->label('Phone')
                            ->content(fn ($record) => $record?->user?->phone ?: '—'),
                        TextInput::make('status')
                            ->required()
                            ->default('pending'),
                    ]),
                Section::make('License')
                    ->columns(2)
                    ->schema([
                        TextInput::make('license_number')
                            ->default(null),
                        TextInput::make('license_country')
                            ->default(null),
                        DatePicker::make('license_expires_at'),
                    ]),
                Section::make('Performance')
                    ->columns(2)
                    ->schema([
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
                    ]),
                Section::make('Location')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
                        TextInput::make('current_latitude')
                            ->numeric()
                            ->default(null),
                        TextInput::make('current_longitude')
                            ->numeric()
                            ->default(null),
                        DateTimePicker::make('last_location_at'),
                    ]),
            ]);
    }
}
