<?php

namespace App\Filament\Resources\DispatchSettings;

use App\Filament\Resources\DispatchSettings\Pages\EditDispatchSetting;
use App\Filament\Resources\DispatchSettings\Schemas\DispatchSettingForm;
use App\Models\DispatchSetting;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class DispatchSettingResource extends Resource
{
    protected static ?string $model = DispatchSetting::class;

    protected static string|UnitEnum|null $navigationGroup = 'Fleet';

    protected static ?int $navigationSort = 1;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMapPin;

    protected static ?string $navigationLabel = 'Dispatch settings';

    protected static ?string $modelLabel = 'Dispatch settings';

    protected static ?string $pluralModelLabel = 'Dispatch settings';

    protected static ?string $slug = 'dispatch-settings';

    public static function form(Schema $schema): Schema
    {
        return DispatchSettingForm::configure($schema);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => EditDispatchSetting::route('/'),
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
