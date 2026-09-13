<?php

namespace App\Filament\Resources\ExplorePlaces;

use App\Filament\Resources\ExplorePlaces\Pages\CreateExplorePlace;
use App\Filament\Resources\ExplorePlaces\Pages\EditExplorePlace;
use App\Filament\Resources\ExplorePlaces\Pages\ListExplorePlaces;
use App\Filament\Resources\ExplorePlaces\Schemas\ExplorePlaceForm;
use App\Filament\Resources\ExplorePlaces\Tables\ExplorePlacesTable;
use App\Models\ExplorePlace;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ExplorePlaceResource extends Resource
{
    protected static ?string $model = ExplorePlace::class;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 0;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMap;

    protected static ?string $navigationLabel = 'Explore places';

    protected static ?string $slug = 'explore-places';

    protected static bool $shouldRegisterNavigation = true;

    protected static ?string $modelLabel = 'Explore place';

    protected static ?string $pluralModelLabel = 'Explore places';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return ExplorePlaceForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ExplorePlacesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExplorePlaces::route('/'),
            'create' => CreateExplorePlace::route('/create'),
            'edit' => EditExplorePlace::route('/{record}/edit'),
        ];
    }
}
