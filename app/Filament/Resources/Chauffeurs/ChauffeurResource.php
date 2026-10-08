<?php

namespace App\Filament\Resources\Chauffeurs;

use App\Filament\Resources\Chauffeurs\Pages\CreateChauffeur;
use App\Filament\Resources\Chauffeurs\Pages\EditChauffeur;
use App\Filament\Resources\Chauffeurs\Pages\ListChauffeurs;
use App\Filament\Resources\Chauffeurs\Pages\ViewChauffeur;
use App\Filament\Resources\Chauffeurs\RelationManagers\RideAssignmentsRelationManager;
use App\Filament\Resources\Chauffeurs\RelationManagers\RideOffersRelationManager;
use App\Filament\Resources\Chauffeurs\Schemas\ChauffeurForm;
use App\Filament\Resources\Chauffeurs\Schemas\ChauffeurInfolist;
use App\Filament\Resources\Chauffeurs\Tables\ChauffeursTable;
use App\Models\Chauffeur;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class ChauffeurResource extends Resource
{
    protected static ?string $model = Chauffeur::class;

    protected static string|UnitEnum|null $navigationGroup = 'People';

    protected static ?int $navigationSort = 12;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedIdentification;

    protected static ?string $navigationLabel = 'Chauffeurs';

    protected static ?string $modelLabel = 'Chauffeur';

    protected static ?string $pluralModelLabel = 'Chauffeurs';

    protected static ?string $recordTitleAttribute = null;

    public static function getRecordTitle(?Model $record): string|null
    {
        if (! $record instanceof Chauffeur) {
            return null;
        }

        return $record->user?->name ?: 'Chauffeur #'.$record->getKey();
    }

    public static function canAccess(): bool
    {
        return auth()->user()?->canManageChauffeurs() ?? false;
    }

    public static function canViewAny(): bool
    {
        return static::canAccess();
    }

    public static function getNavigationBadge(): ?string
    {
        if (! static::canAccess()) {
            return null;
        }

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

    public static function infolist(Schema $schema): Schema
    {
        return ChauffeurInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ChauffeursTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            RideAssignmentsRelationManager::class,
            RideOffersRelationManager::class,
        ];
    }

    public static function canCreate(): bool
    {
        // Use People → Create Chauffeur (creates login user + active chauffeur profile).
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => ListChauffeurs::route('/'),
            'create' => CreateChauffeur::route('/create'),
            'view' => ViewChauffeur::route('/{record}'),
            'edit' => EditChauffeur::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['user', 'partner']);
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
