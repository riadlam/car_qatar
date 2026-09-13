<?php

namespace App\Filament\Resources\ServiceTypes\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ServiceTypeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Hero & dropdown label')
                    ->description('Name and order control what guests see on the homepage booking tabs. Edit durations, passenger/student counts on the tabs below; Gulf destinations and school terms live under Catalog.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->label('Display name')
                            ->placeholder('e.g. One way')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, callable $set, callable $get): void {
                                if (filled($get('slug'))) {
                                    return;
                                }

                                $set('slug', Str::slug((string) $state, '_'));
                            })
                            ->helperText('Shown on the hero service tabs.'),
                        TextInput::make('slug')
                            ->label('URL key')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Stable id used by the booking flow (e.g. one_way). Avoid changing after go-live.'),
                        Textarea::make('description')
                            ->rows(2)
                            ->columnSpanFull(),
                        Select::make('mode')
                            ->options([
                                'transfer' => 'Transfer (point to point)',
                                'hourly' => 'Hourly / duration based',
                            ])
                            ->required()
                            ->native(false),
                        TextInput::make('sort_order')
                            ->label('Tab order')
                            ->numeric()
                            ->required()
                            ->default(0)
                            ->helperText('Lower numbers appear first on the hero.'),
                        Select::make('status')
                            ->options([
                                'active' => 'Active — show on site',
                                'inactive' => 'Inactive — hide from site',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
