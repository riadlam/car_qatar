<?php

namespace App\Filament\Resources\SavedGuests;

use App\Filament\Resources\SavedGuests\Pages\CreateSavedGuest;
use App\Filament\Resources\SavedGuests\Pages\EditSavedGuest;
use App\Filament\Resources\SavedGuests\Pages\ListSavedGuests;
use App\Filament\Resources\SavedGuests\Schemas\SavedGuestForm;
use App\Filament\Resources\SavedGuests\Tables\SavedGuestsTable;
use App\Models\SavedGuest;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SavedGuestResource extends Resource
{
    protected static ?string $model = SavedGuest::class;

    protected static string|UnitEnum|null $navigationGroup = 'People';

    protected static ?int $navigationSort = 61;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    protected static ?string $navigationLabel = 'Saved Guests';

    protected static ?string $modelLabel = 'Saved Guest';

    protected static ?string $pluralModelLabel = 'Saved Guests';

    public static function form(Schema $schema): Schema
    {
        return SavedGuestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SavedGuestsTable::configure($table);
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
            'index' => ListSavedGuests::route('/'),
            'create' => CreateSavedGuest::route('/create'),
            'edit' => EditSavedGuest::route('/{record}/edit'),
        ];
    }
}
