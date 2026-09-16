<?php

namespace App\Filament\Resources\Partners\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PartnerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identity')
                    ->columns(2)
                    ->schema([
                        TextInput::make('legal_name')
                            ->required(),
                        TextInput::make('display_name')
                            ->required(),
                        TextInput::make('tax_number')
                            ->default(null),
                        TextInput::make('registration_number')
                            ->default(null),
                        TextInput::make('status')
                            ->required()
                            ->default('pending'),
                    ]),
                Section::make('Contact')
                    ->columns(2)
                    ->schema([
                        TextInput::make('email')
                            ->label('Email address')
                            ->email()
                            ->default(null),
                        TextInput::make('phone')
                            ->tel()
                            ->default(null),
                        Select::make('country_id')
                            ->relationship('country', 'name')
                            ->default(null),
                        Select::make('city_id')
                            ->relationship('city', 'name')
                            ->default(null),
                        TextInput::make('address')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
                Section::make('Commercial')
                    ->columns(2)
                    ->schema([
                        TextInput::make('commission_type')
                            ->required()
                            ->default('percent'),
                        TextInput::make('commission_value')
                            ->required()
                            ->numeric()
                            ->default(0.0),
                    ]),
                Section::make('Approval')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
                        DateTimePicker::make('approved_at'),
                        TextInput::make('approved_by')
                            ->numeric()
                            ->default(null),
                    ]),
            ]);
    }
}
