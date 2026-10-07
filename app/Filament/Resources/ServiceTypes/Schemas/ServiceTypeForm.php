<?php

namespace App\Filament\Resources\ServiceTypes\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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
                            ->live()
                            ->native(false),
                        Toggle::make('is_hourly')
                            ->label('Hourly pricing')
                            ->helperText('Uses hourly rates instead of distance/duration transfer rates.')
                            ->default(false),
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
                            ->native(false),
                    ]),
                Section::make('Booking requirements')
                    ->description('Flags used by the booking API and quote validation.')
                    ->columns(2)
                    ->schema([
                        Toggle::make('requires_dropoff')
                            ->label('Requires drop-off')
                            ->default(true),
                        Toggle::make('allows_multi_stops')
                            ->label('Allows multi stops')
                            ->live()
                            ->default(false),
                        TextInput::make('max_stops')
                            ->label('Max stops')
                            ->numeric()
                            ->minValue(0)
                            ->default(null)
                            ->visible(fn (callable $get): bool => (bool) $get('allows_multi_stops')),
                        Toggle::make('requires_flight')
                            ->label('Requires flight details')
                            ->default(false),
                        Toggle::make('requires_gulf_destination')
                            ->label('Requires Gulf destination')
                            ->default(false),
                        Toggle::make('requires_school_term')
                            ->label('Requires school term')
                            ->default(false),
                        Toggle::make('requires_passengers')
                            ->label('Requires passenger count')
                            ->default(true),
                        Toggle::make('requires_students')
                            ->label('Requires student count')
                            ->default(false),
                    ]),
            ]);
    }
}
