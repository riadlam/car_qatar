<?php

namespace App\Filament\Resources\CancellationReasons;

use App\Filament\Resources\CancellationReasons\Pages\CreateCancellationReason;
use App\Filament\Resources\CancellationReasons\Pages\EditCancellationReason;
use App\Filament\Resources\CancellationReasons\Pages\ListCancellationReasons;
use App\Filament\Resources\CancellationReasons\Schemas\CancellationReasonForm;
use App\Filament\Resources\CancellationReasons\Tables\CancellationReasonsTable;
use App\Models\CancellationReason;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class CancellationReasonResource extends Resource
{
    protected static ?string $model = CancellationReason::class;

    protected static string|UnitEnum|null $navigationGroup = 'Operations';

    protected static ?int $navigationSort = 4;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedXCircle;

    protected static ?string $navigationLabel = 'Cancel reasons';

    protected static ?string $modelLabel = 'Cancel reason';

    protected static ?string $pluralModelLabel = 'Cancel reasons';

    protected static ?string $slug = 'cancel-reasons';

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return CancellationReasonForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CancellationReasonsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCancellationReasons::route('/'),
            'create' => CreateCancellationReason::route('/create'),
            'edit' => EditCancellationReason::route('/{record}/edit'),
        ];
    }
}
