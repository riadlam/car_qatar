<?php

namespace App\Filament\Resources\Bookings\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class StopsRelationManager extends RelationManager
{
    protected static string $relationship = 'stops';

    protected static ?string $title = 'Stops';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('sequence')
                    ->numeric()
                    ->required()
                    ->minValue(1),
                Select::make('location_id')
                    ->label('Location')
                    ->relationship('location', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Textarea::make('notes')
                    ->rows(2)
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('sequence')
            ->columns([
                TextColumn::make('sequence')
                    ->label('#')
                    ->sortable()
                    ->width('4rem'),
                TextColumn::make('location.name')
                    ->label('Location')
                    ->searchable()
                    ->placeholder('—')
                    ->wrap(),
                TextColumn::make('notes')
                    ->placeholder('—')
                    ->limit(40)
                    ->toggleable(),
            ])
            ->defaultSort('sequence')
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No stops')
            ->emptyStateDescription('Multi-stop waypoints for this trip will appear here.');
    }
}
