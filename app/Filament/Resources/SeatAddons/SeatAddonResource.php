<?php

namespace App\Filament\Resources\SeatAddons;

use App\Filament\Resources\SeatAddons\Pages\CreateSeatAddon;
use App\Filament\Resources\SeatAddons\Pages\EditSeatAddon;
use App\Filament\Resources\SeatAddons\Pages\ListSeatAddons;
use App\Filament\Resources\SeatAddons\Schemas\SeatAddonForm;
use App\Filament\Resources\SeatAddons\Tables\SeatAddonsTable;
use App\Models\SeatAddon;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SeatAddonResource extends Resource
{
    protected static ?string $model = SeatAddon::class;

    protected static string|UnitEnum|null $navigationGroup = 'Pricing';

    protected static ?int $navigationSort = 41;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCube;

    protected static ?string $navigationLabel = 'Child and baby seats';

    protected static ?string $modelLabel = 'Child or baby seat';

    protected static ?string $pluralModelLabel = 'Child and baby seats';

    public static function form(Schema $schema): Schema
    {
        return SeatAddonForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SeatAddonsTable::configure($table);
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
            'index' => ListSeatAddons::route('/'),
            'create' => CreateSeatAddon::route('/create'),
            'edit' => EditSeatAddon::route('/{record}/edit'),
        ];
    }
}
