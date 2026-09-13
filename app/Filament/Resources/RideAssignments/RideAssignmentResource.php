<?php

namespace App\Filament\Resources\RideAssignments;

use App\Filament\Resources\RideAssignments\Pages\CreateRideAssignment;
use App\Filament\Resources\RideAssignments\Pages\EditRideAssignment;
use App\Filament\Resources\RideAssignments\Pages\ListRideAssignments;
use App\Filament\Resources\RideAssignments\Pages\ViewRideAssignment;
use App\Filament\Resources\RideAssignments\Schemas\RideAssignmentForm;
use App\Filament\Resources\RideAssignments\Schemas\RideAssignmentInfolist;
use App\Filament\Resources\RideAssignments\Tables\RideAssignmentsTable;
use App\Models\RideAssignment;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RideAssignmentResource extends Resource
{
    protected static ?string $model = RideAssignment::class;

    protected static string|UnitEnum|null $navigationGroup = 'Operations';

    protected static ?int $navigationSort = 4;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserPlus;

    protected static ?string $navigationLabel = 'Ride Assignments';

    protected static ?string $modelLabel = 'Ride Assignment';

    protected static ?string $pluralModelLabel = 'Ride Assignments';

    public static function form(Schema $schema): Schema
    {
        return RideAssignmentForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return RideAssignmentInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RideAssignmentsTable::configure($table);
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
            'index' => ListRideAssignments::route('/'),
            'create' => CreateRideAssignment::route('/create'),
            'view' => ViewRideAssignment::route('/{record}'),
            'edit' => EditRideAssignment::route('/{record}/edit'),
        ];
    }
}
