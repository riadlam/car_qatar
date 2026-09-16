<?php

namespace App\Filament\Resources\MapSettings;

use App\Filament\Resources\MapSettings\Pages\EditMapSetting;
use App\Filament\Resources\MapSettings\Schemas\MapSettingForm;
use App\Models\MapSetting;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class MapSettingResource extends Resource
{
    protected static ?string $model = MapSetting::class;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 2;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMap;

    protected static ?string $navigationLabel = 'Map settings';

    protected static bool $shouldRegisterNavigation = false;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    protected static ?string $modelLabel = 'Map settings';

    protected static ?string $pluralModelLabel = 'Map settings';

    protected static ?string $slug = 'map-settings';

    public static function form(Schema $schema): Schema
    {
        return MapSettingForm::configure($schema);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => EditMapSetting::route('/'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }
}
