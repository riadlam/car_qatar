<?php

namespace App\Filament\Resources\Chauffeurs\Schemas;

use Filament\Forms\Components\DatePicker;
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
                    ->description('Linked login user cannot be changed here. Edit status and gender as needed.')
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
            ]);
    }
}
