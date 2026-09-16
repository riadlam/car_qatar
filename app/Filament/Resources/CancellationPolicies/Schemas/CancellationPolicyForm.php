<?php

namespace App\Filament\Resources\CancellationPolicies\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CancellationPolicyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Policy')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        Select::make('service_type_id')
                            ->relationship('serviceType', 'name')
                            ->default(null),
                        TextInput::make('status')
                            ->required()
                            ->default('active'),
                        Textarea::make('description')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
                Section::make('Timing')
                    ->columns(2)
                    ->schema([
                        TextInput::make('free_cancel_hours')
                            ->required()
                            ->numeric()
                            ->default(24),
                    ]),
                Section::make('Fees')
                    ->columns(2)
                    ->schema([
                        TextInput::make('fee_type')
                            ->required()
                            ->default('percent'),
                        TextInput::make('fee_value')
                            ->required()
                            ->numeric()
                            ->default(0.0),
                        TextInput::make('currency')
                            ->default(null),
                    ]),
            ]);
    }
}
