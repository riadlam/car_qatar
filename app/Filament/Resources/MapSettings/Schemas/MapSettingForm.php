<?php

namespace App\Filament\Resources\MapSettings\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MapSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Map appearance')
                    ->description('Public Mapbox style and defaults shown on the website. Access tokens stay in .env (VITE_MAPBOX_ACCESS_TOKEN / MAPBOX_SECRET_TOKEN).')
                    ->columns(2)
                    ->schema([
                        TextInput::make('style_uri')
                            ->label('Style URI')
                            ->required()
                            ->helperText('e.g. mapbox://styles/mapbox/standard or a Studio style URL.'),
                        Select::make('basemap_theme')
                            ->label('Standard basemap theme')
                            ->options([
                                'default' => 'Default',
                                'faded' => 'Faded (recommended)',
                                'monochrome' => 'Monochrome',
                            ])
                            ->required()
                            ->native(false),
                        TextInput::make('marker_color')
                            ->label('Marker / route color')
                            ->required()
                            ->helperText('Hex color for pins and route lines.'),
                        TextInput::make('default_zoom')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(20)
                            ->required(),
                        TextInput::make('default_latitude')
                            ->numeric()
                            ->required(),
                        TextInput::make('default_longitude')
                            ->numeric()
                            ->required(),
                    ]),
                Section::make('Search & routing')
                    ->columns(2)
                    ->schema([
                        TextInput::make('country_codes')
                            ->label('Country codes')
                            ->required()
                            ->helperText('Comma-separated ISO2 codes for search bias (e.g. qa,ae,sa,om,kw,bh).')
                            ->columnSpanFull(),
                        TextInput::make('language')
                            ->required()
                            ->maxLength(16),
                        Select::make('directions_profile')
                            ->options([
                                'mapbox/driving-traffic' => 'Driving with traffic',
                                'mapbox/driving' => 'Driving',
                            ])
                            ->required()
                            ->native(false),
                        Toggle::make('show_traffic')
                            ->label('Prefer traffic-aware routes')
                            ->default(true),
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                            ])
                            ->required()
                            ->native(false),
                    ]),
            ]);
    }
}
