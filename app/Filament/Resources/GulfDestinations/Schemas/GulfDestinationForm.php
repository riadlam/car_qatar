<?php

namespace App\Filament\Resources\GulfDestinations\Schemas;

use App\Filament\Forms\MapboxLocationFields;
use Filament\Actions\Action;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class GulfDestinationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Destination')
                    ->description('Shown in the Arab Gulf trips dropdown on the homepage.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->label('Display name')
                            ->placeholder('e.g. Dubai')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, callable $set, callable $get): void {
                                if (filled($get('slug'))) {
                                    return;
                                }

                                $set('slug', Str::slug((string) $state));
                            }),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true),
                        Select::make('country_id')
                            ->relationship('country', 'name')
                            ->searchable()
                            ->preload()
                            ->default(null),
                        Select::make('city_id')
                            ->relationship('city', 'name')
                            ->searchable()
                            ->preload()
                            ->default(null),
                        TextInput::make('sort_order')
                            ->label('List order')
                            ->required()
                            ->numeric()
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

                Section::make('Map location (required for booking)')
                    ->description('Search Mapbox or click the pin icon on the search field to drop a pin on the map. Lat/lng power the Gulf trip booking map.')
                    ->columns(2)
                    ->headerActions([
                        Action::make('clearMapLocation')
                            ->label('Clear pin')
                            ->color('gray')
                            ->link()
                            ->action(function (Set $set): void {
                                $set('latitude', null);
                                $set('longitude', null);
                            }),
                    ])
                    ->schema([
                        Placeholder::make('map_link_status')
                            ->label('Booking pin')
                            ->content(fn (Get $get): HtmlString => MapboxLocationFields::statusPlaceholder($get, false))
                            ->columnSpanFull(),
                        ...MapboxLocationFields::schema(
                            scope: 'gulf',
                            withAddress: false,
                            withPlaceId: false,
                            coordsRequired: true,
                        ),
                    ]),
            ]);
    }
}
