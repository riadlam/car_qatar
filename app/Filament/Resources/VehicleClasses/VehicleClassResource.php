<?php

namespace App\Filament\Resources\VehicleClasses;

use App\Filament\Resources\VehicleClasses\Pages\CreateVehicleClass;
use App\Filament\Resources\VehicleClasses\Pages\EditVehicleClass;
use App\Filament\Resources\VehicleClasses\Pages\ListVehicleClasses;
use App\Filament\Resources\VehicleClasses\Schemas\VehicleClassForm;
use App\Filament\Resources\VehicleClasses\Tables\VehicleClassesTable;
use App\Models\VehicleClass;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class VehicleClassResource extends Resource
{
    protected static ?string $model = VehicleClass::class;

    protected static string|UnitEnum|null $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 11;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTruck;

    protected static ?string $navigationLabel = 'Vehicle Classes';

    protected static bool $shouldRegisterNavigation = false;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    protected static ?string $modelLabel = 'Vehicle Class';

    protected static ?string $pluralModelLabel = 'Vehicle Classes';

    public static function form(Schema $schema): Schema
    {
        return VehicleClassForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VehicleClassesTable::configure($table);
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
            'index' => ListVehicleClasses::route('/'),
            'create' => CreateVehicleClass::route('/create'),
            'edit' => EditVehicleClass::route('/{record}/edit'),
        ];
    }
}
