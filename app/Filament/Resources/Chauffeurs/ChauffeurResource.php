<?php

namespace App\Filament\Resources\Chauffeurs;

use App\Filament\Resources\Chauffeurs\Pages\CreateChauffeur;
use App\Filament\Resources\Chauffeurs\Pages\EditChauffeur;
use App\Filament\Resources\Chauffeurs\Pages\ListChauffeurs;
use App\Filament\Resources\Chauffeurs\Schemas\ChauffeurForm;
use App\Filament\Resources\Chauffeurs\Tables\ChauffeursTable;
use App\Models\Chauffeur;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ChauffeurResource extends Resource
{
    protected static ?string $model = Chauffeur::class;

    protected static string|UnitEnum|null $navigationGroup = 'Fleet';

    protected static ?int $navigationSort = 21;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedIdentification;

    protected static ?string $navigationLabel = 'Chauffeurs';

    protected static ?string $modelLabel = 'Chauffeur';

    protected static ?string $pluralModelLabel = 'Chauffeurs';

    public static function getNavigationBadge(): ?string
    {
        $count = Chauffeur::query()->where('status', 'pending')->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return ChauffeurForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ChauffeursTable::configure($table);
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
            'index' => ListChauffeurs::route('/'),
            'create' => CreateChauffeur::route('/create'),
            'edit' => EditChauffeur::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
