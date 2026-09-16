<?php

namespace App\Filament\Resources\Amenities\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AmenityForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Amenity')
                    ->columns(2)
                    ->schema([
                        TextInput::make('label')
                            ->required(),
                        TextInput::make('slug')
                            ->required(),
                        TextInput::make('icon')
                            ->default(null),
                        TextInput::make('sort_order')
                            ->required()
                            ->numeric()
                            ->default(0),
                        TextInput::make('status')
                            ->required()
                            ->default('active'),
                    ]),
            ]);
    }
}
