<?php

namespace App\Filament\Resources\SchoolTerms;

use App\Filament\Resources\SchoolTerms\Pages\CreateSchoolTerm;
use App\Filament\Resources\SchoolTerms\Pages\EditSchoolTerm;
use App\Filament\Resources\SchoolTerms\Pages\ListSchoolTerms;
use App\Filament\Resources\SchoolTerms\Schemas\SchoolTermForm;
use App\Filament\Resources\SchoolTerms\Tables\SchoolTermsTable;
use App\Models\SchoolTerm;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SchoolTermResource extends Resource
{
    protected static ?string $model = SchoolTerm::class;

    protected static string|UnitEnum|null $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 15;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAcademicCap;

    protected static ?string $navigationLabel = 'School terms';

    protected static bool $shouldRegisterNavigation = false;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    protected static ?string $modelLabel = 'School term';

    protected static ?string $pluralModelLabel = 'School terms';

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return SchoolTermForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SchoolTermsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSchoolTerms::route('/'),
            'create' => CreateSchoolTerm::route('/create'),
            'edit' => EditSchoolTerm::route('/{record}/edit'),
        ];
    }
}
