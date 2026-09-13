<?php

namespace App\Filament\Resources\ExplorePlaces\Schemas;

use App\Models\ExplorePlace;
use App\Services\Maps\MapboxGeocodingService;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class ExplorePlaceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Content')
                    ->description('Shown on Explore Qatar pages (Hotels, Beaches, Malls, Restaurants, Iconic places).')
                    ->columns(2)
                    ->schema([
                        Select::make('category')
                            ->options([
                                'hotel' => 'Hotels',
                                'beach' => 'Beaches & resorts',
                                'mall' => 'Malls & shopping',
                                'restaurant' => 'Restaurants & lunch',
                                'iconic' => 'Iconic places',
                            ])
                            ->required()
                            ->native(false),
                        TextInput::make('slug')
                            ->required()
                            ->helperText('Unique within the category (e.g. four-seasons).'),
                        TextInput::make('title')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, Set $set, callable $get): void {
                                if (blank($get('slug')) && filled($state)) {
                                    $set('slug', Str::slug($state));
                                }
                                if (blank($get('label')) && filled($state)) {
                                    $set('label', $state);
                                }
                            }),
                        TextInput::make('label')
                            ->label('Scheduler label')
                            ->required()
                            ->helperText('Name shown in the schedule picker dropdown.'),
                        TextInput::make('area')
                            ->helperText('Secondary line (e.g. West Bay).'),
                        Textarea::make('body')
                            ->label('Description')
                            ->rows(3)
                            ->columnSpanFull(),
                        Placeholder::make('image_preview')
                            ->label('Image preview')
                            ->content(function (Get $get): HtmlString {
                                $url = ExplorePlace::absoluteImageUrl($get('image_path'));
                                if (! $url) {
                                    return new HtmlString(
                                        '<span class="text-sm text-gray-500 dark:text-gray-400">No image yet — upload below or set a path.</span>',
                                    );
                                }

                                return new HtmlString(
                                    '<img src="'.e($url).'" alt="" class="h-40 w-auto max-w-full rounded-lg object-cover border border-gray-200 dark:border-gray-700" />',
                                );
                            })
                            ->columnSpanFull(),
                        FileUpload::make('image_upload')
                            ->label('Upload card image')
                            ->image()
                            ->disk('public')
                            ->directory('explore-places')
                            ->visibility('public')
                            ->imagePreviewHeight('160')
                            ->dehydrated(false)
                            ->live()
                            ->afterStateUpdated(function ($state, Set $set): void {
                                if (blank($state)) {
                                    return;
                                }
                                $path = is_array($state) ? ($state[0] ?? null) : $state;
                                if (filled($path)) {
                                    $set('image_path', $path);
                                }
                            })
                            ->helperText('Uploads to storage. Existing seeded photos use /images/… paths.')
                            ->columnSpanFull(),
                        TextInput::make('image_path')
                            ->label('Image path')
                            ->live(onBlur: true)
                            ->helperText('Stored value: /images/hotels/… or explore-places/…. Preview updates after blur.')
                            ->columnSpanFull(),
                        Toggle::make('show_in_carousel')
                            ->label('Show in carousel')
                            ->default(true),
                        Toggle::make('show_in_scheduler')
                            ->label('Show in schedule picker')
                            ->default(true),
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

                Section::make('Map location')
                    ->description('Search Mapbox (Qatar). When a guest clicks this card, this place loads into the schedule picker.')
                    ->columns(2)
                    ->schema([
                        Select::make('mapbox_pick')
                            ->label('Search place on Mapbox')
                            ->searchable()
                            ->dehydrated(false)
                            ->placeholder('Type a hotel, beach, mall…')
                            ->helperText('Requires MAPBOX_SECRET_TOKEN or public token in .env.')
                            ->getSearchResultsUsing(function (string $search): array {
                                if (strlen(trim($search)) < 2) {
                                    return [];
                                }

                                $features = app(MapboxGeocodingService::class)->search($search, 8);

                                $options = [];
                                foreach ($features as $feature) {
                                    $payload = base64_encode(json_encode([
                                        'place_id' => $feature['place_id'],
                                        'label' => $feature['label'],
                                        'latitude' => $feature['latitude'],
                                        'longitude' => $feature['longitude'],
                                    ], JSON_THROW_ON_ERROR));
                                    $options[$payload] = $feature['label'];
                                }

                                return $options;
                            })
                            ->afterStateUpdated(function (?string $state, Set $set): void {
                                if (! filled($state)) {
                                    return;
                                }

                                try {
                                    $decoded = json_decode(base64_decode($state, true) ?: '', true, 512, JSON_THROW_ON_ERROR);
                                } catch (\Throwable) {
                                    return;
                                }

                                $set('formatted_address', $decoded['label'] ?? null);
                                $set('latitude', $decoded['latitude'] ?? null);
                                $set('longitude', $decoded['longitude'] ?? null);
                                $set('place_id', $decoded['place_id'] ?? null);
                                $set('provider', 'mapbox');
                            })
                            ->columnSpanFull(),
                        TextInput::make('formatted_address')
                            ->label('Formatted address')
                            ->columnSpanFull(),
                        TextInput::make('latitude')
                            ->numeric()
                            ->step('any'),
                        TextInput::make('longitude')
                            ->numeric()
                            ->step('any'),
                        TextInput::make('place_id')
                            ->label('Mapbox place id')
                            ->disabled()
                            ->dehydrated(),
                        TextInput::make('provider')
                            ->default('mapbox')
                            ->disabled()
                            ->dehydrated(),
                    ]),
            ]);
    }
}
