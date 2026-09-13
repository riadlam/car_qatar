<?php

namespace App\Filament\Resources\SchoolTerms\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SchoolTermForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('School term')
                    ->description('Shown in the School chauffeured duration dropdown on the homepage.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('label')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, callable $set, callable $get): void {
                                if (filled($get('value'))) {
                                    return;
                                }

                                $set('value', Str::slug((string) $state, '_'));
                            }),
                        TextInput::make('value')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Stable key stored on bookings (e.g. one_semester).'),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->required()
                            ->default(0),
                        Select::make('status')
                            ->options([
                                'active' => 'Active — show on site',
                                'inactive' => 'Inactive — hide from site',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false),
                    ]),
            ]);
    }
}
