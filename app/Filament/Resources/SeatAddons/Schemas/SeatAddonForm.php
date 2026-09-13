<?php

namespace App\Filament\Resources\SeatAddons\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SeatAddonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Seat option')
                    ->description('Shown on the booking page when the price is greater than zero.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('label')
                            ->label('Name on the booking page')
                            ->required()
                            ->maxLength(120),
                        TextInput::make('slug')
                            ->helperText('Used by the booking radios. Do not change none, child_seat, or baby_seat.')
                            ->required()
                            ->maxLength(100)
                            ->disabled(fn ($record): bool => $record && in_array($record->slug, ['none', 'child_seat', 'baby_seat'], true))
                            ->dehydrated(),
                        TextInput::make('default_price')
                            ->label('Price')
                            ->helperText('Set to 0 to hide this option on /booking.')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0)
                            ->prefix('$')
                            ->columnSpanFull(),
                        TextInput::make('currency')
                            ->required()
                            ->default('USD')
                            ->maxLength(3),
                        TextInput::make('sort_order')
                            ->required()
                            ->numeric()
                            ->default(0),
                        Select::make('status')
                            ->options([
                                'active' => 'Active — available to price',
                                'inactive' => 'Inactive — hidden everywhere',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false),
                    ]),
            ]);
    }
}
