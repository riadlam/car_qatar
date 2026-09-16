<?php

namespace App\Filament\Resources\CancellationPolicies;

use App\Filament\Resources\CancellationPolicies\Pages\CreateCancellationPolicy;
use App\Filament\Resources\CancellationPolicies\Pages\EditCancellationPolicy;
use App\Filament\Resources\CancellationPolicies\Pages\ListCancellationPolicies;
use App\Filament\Resources\CancellationPolicies\Schemas\CancellationPolicyForm;
use App\Filament\Resources\CancellationPolicies\Tables\CancellationPoliciesTable;
use App\Models\CancellationPolicy;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CancellationPolicyResource extends Resource
{
    protected static ?string $model = CancellationPolicy::class;

    protected static string|UnitEnum|null $navigationGroup = 'Pricing';

    protected static ?int $navigationSort = 42;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNoSymbol;

    protected static ?string $navigationLabel = 'Cancellation Policies';

    protected static bool $shouldRegisterNavigation = false;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    protected static ?string $modelLabel = 'Cancellation Policy';

    protected static ?string $pluralModelLabel = 'Cancellation Policies';

    public static function form(Schema $schema): Schema
    {
        return CancellationPolicyForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CancellationPoliciesTable::configure($table);
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
            'index' => ListCancellationPolicies::route('/'),
            'create' => CreateCancellationPolicy::route('/create'),
            'edit' => EditCancellationPolicy::route('/{record}/edit'),
        ];
    }
}
