<?php

namespace App\Filament\Resources\Surcharges;

use App\Filament\Resources\Surcharges\Pages\CreateSurcharge;
use App\Filament\Resources\Surcharges\Pages\EditSurcharge;
use App\Filament\Resources\Surcharges\Pages\ListSurcharges;
use App\Filament\Resources\Surcharges\Schemas\SurchargeForm;
use App\Filament\Resources\Surcharges\Tables\SurchargesTable;
use App\Models\Surcharge;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SurchargeResource extends Resource
{
    protected static ?string $model = Surcharge::class;

    protected static string|UnitEnum|null $navigationGroup = 'Pricing';

    protected static ?int $navigationSort = 41;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPlusCircle;

    protected static ?string $navigationLabel = 'Surcharges';

    protected static ?string $modelLabel = 'Surcharge';

    protected static ?string $pluralModelLabel = 'Surcharges';

    public static function form(Schema $schema): Schema
    {
        return SurchargeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SurchargesTable::configure($table);
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
            'index' => ListSurcharges::route('/'),
            'create' => CreateSurcharge::route('/create'),
            'edit' => EditSurcharge::route('/{record}/edit'),
        ];
    }
}
