<?php

namespace App\Filament\Resources\Countries\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CountryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identity')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('iso2')
                            ->label('ISO2')
                            ->required()
                            ->maxLength(2)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, callable $set, callable $get): void {
                                if (filled($get('iso3')) || blank($state)) {
                                    return;
                                }

                                $iso2 = strtoupper((string) $state);
                                $set('iso3', strlen($iso2) === 2 ? $iso2.'X' : null);
                            }),
                        TextInput::make('iso3')
                            ->maxLength(3)
                            ->required()
                            ->dehydrated()
                            ->hidden(),
                        TextInput::make('timezone')
                            ->default(null),
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false),
                    ]),
            ]);
    }
}
