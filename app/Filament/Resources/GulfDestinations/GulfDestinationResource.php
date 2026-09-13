<?php

namespace App\Filament\Resources\GulfDestinations;

use App\Filament\Resources\GulfDestinations\Pages\CreateGulfDestination;
use App\Filament\Resources\GulfDestinations\Pages\EditGulfDestination;
use App\Filament\Resources\GulfDestinations\Pages\ListGulfDestinations;
use App\Filament\Resources\GulfDestinations\Schemas\GulfDestinationForm;
use App\Filament\Resources\GulfDestinations\Tables\GulfDestinationsTable;
use App\Models\GulfDestination;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class GulfDestinationResource extends Resource
{
    protected static ?string $model = GulfDestination::class;

    protected static string|UnitEnum|null $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 14;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMapPin;

    protected static ?string $navigationLabel = 'Gulf Destinations';

    protected static ?string $modelLabel = 'Gulf Destination';

    protected static ?string $pluralModelLabel = 'Gulf Destinations';

    public static function form(Schema $schema): Schema
    {
        return GulfDestinationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return GulfDestinationsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListGulfDestinations::route('/'),
            'create' => CreateGulfDestination::route('/create'),
            'edit' => EditGulfDestination::route('/{record}/edit'),
        ];
    }
}
