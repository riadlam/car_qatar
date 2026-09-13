<?php

namespace App\Filament\Resources\Partners\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PartnerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('legal_name')
                    ->required(),
                TextInput::make('display_name')
                    ->required(),
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
                    ->default(null),
                TextInput::make('tax_number')
                    ->default(null),
                TextInput::make('registration_number')
                    ->default(null),
                TextInput::make('commission_type')
                    ->required()
                    ->default('percent'),
                TextInput::make('commission_value')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                DateTimePicker::make('approved_at'),
                TextInput::make('approved_by')
                    ->numeric()
                    ->default(null),
            ]);
    }
}
