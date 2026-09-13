<?php

namespace App\Filament\Resources\Countries\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CountryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('iso2')
                    ->required(),
                TextInput::make('iso3')
                    ->required(),
                TextInput::make('phone_code')
                    ->tel()
                    ->default(null),
                TextInput::make('default_currency')
                    ->required()
                    ->default('USD'),
                TextInput::make('timezone')
                    ->default(null),
                TextInput::make('status')
                    ->required()
                    ->default('active'),
            ]);
    }
}
