<?php

namespace App\Filament\Resources\SavedGuests\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SavedGuestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Guest')
                    ->columns(2)
                    ->schema([
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->required(),
                        TextInput::make('title')
                            ->default(null),
                        TextInput::make('first_name')
                            ->required(),
                        TextInput::make('last_name')
                            ->required(),
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
                    ]),
            ]);
    }
}
