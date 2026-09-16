<?php

namespace App\Filament\Resources\Countries\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CitiesRelationManager extends RelationManager
{
    protected static string $relationship = 'cities';

    protected static ?string $title = 'Cities';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255),
                TextInput::make('timezone')
                    ->maxLength(100),
                TextInput::make('latitude')
                    ->numeric(),
                TextInput::make('longitude')
                    ->numeric(),
                TextInput::make('status')
                    ->required()
                    ->default('active')
                    ->maxLength(50),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->toggleable(),
                TextColumn::make('timezone')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('status')
                    ->badge()
                    ->sortable(),
            ])
            ->defaultSort('name')
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
            ->emptyStateHeading('No cities')
            ->emptyStateDescription('Cities in this country will appear here.');
    }
}
