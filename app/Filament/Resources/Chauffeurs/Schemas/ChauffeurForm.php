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
                    ->description('Linked login user cannot be changed here. Edit status, gender, and partner as needed.')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('linked_user')
                            ->label('Chauffeur')
                            ->content(fn ($record) => $record?->user?->name ?: '—'),
                        Placeholder::make('applicant_email')
                            ->label('Email')
                            ->content(fn ($record) => $record?->user?->email ?: '—'),
                        Placeholder::make('applicant_phone')
                            ->label('Phone')
                            ->content(fn ($record) => $record?->user?->phone ?: '—'),
                        Select::make('partner_id')
                            ->relationship('partner', 'display_name')
                            ->searchable()
                            ->default(null),
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'paused' => 'Paused',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false)
                            ->helperText('Paused chauffeurs stay signed in but cannot receive or accept offers.'),
                        Select::make('gender')
                            ->options([
                                'male' => 'Male',
                                'female' => 'Female',
                            ])
                            ->required()
                            ->native(false),
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
                    ->description('Updated by the system from completed rides and ratings.')
                    ->columns(3)
                    ->schema([
                        TextInput::make('rating')
                            ->numeric()
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('ratings_count')
                            ->numeric()
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('completed_rides')
                            ->numeric()
                            ->disabled()
                            ->dehydrated(false),
                    ]),
                Section::make('Location')
                    ->description('Live GPS from the chauffeur app — read-only.')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
                        TextInput::make('current_latitude')
                            ->numeric()
                            ->disabled()
                            ->dehydrated(false),
                        TextInput::make('current_longitude')
                            ->numeric()
                            ->disabled()
                            ->dehydrated(false),
                        DateTimePicker::make('last_location_at')
                            ->disabled()
                            ->dehydrated(false),
                    ]),
            ]);
    }
}
