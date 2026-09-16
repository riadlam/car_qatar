<?php

namespace App\Filament\Resources\Surcharges\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SurchargeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Rule')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('code')
                            ->default(null),
                        Select::make('service_type_id')
                            ->relationship('serviceType', 'name')
                            ->default(null),
                        Select::make('city_id')
                            ->relationship('city', 'name')
                            ->default(null),
                        TextInput::make('applies_to')
                            ->default(null),
                        TextInput::make('status')
                            ->required()
                            ->default('active'),
                    ]),
                Section::make('Amount')
                    ->columns(2)
                    ->schema([
                        TextInput::make('type')
                            ->required()
                            ->default('fixed'),
                        TextInput::make('value')
                            ->required()
                            ->numeric()
                            ->default(0.0),
                        TextInput::make('currency')
                            ->default(null),
                    ]),
                Section::make('Validity')
                    ->columns(2)
                    ->schema([
                        DateTimePicker::make('starts_at'),
                        DateTimePicker::make('ends_at'),
                        Textarea::make('metadata')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
