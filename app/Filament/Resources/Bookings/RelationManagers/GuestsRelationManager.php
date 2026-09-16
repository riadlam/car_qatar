<?php

namespace App\Filament\Resources\Bookings\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class GuestsRelationManager extends RelationManager
{
    protected static string $relationship = 'guests';

    protected static ?string $title = 'Guests';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->maxLength(50),
                TextInput::make('first_name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('last_name')
                    ->maxLength(255),
                TextInput::make('email')
                    ->email()
                    ->maxLength(255),
                TextInput::make('phone')
                    ->tel()
                    ->maxLength(50),
                Toggle::make('is_primary')
                    ->label('Primary guest'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('first_name')
            ->columns([
                TextColumn::make('first_name')
                    ->label('First name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('last_name')
                    ->label('Last name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('phone')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('email')
                    ->placeholder('—')
                    ->toggleable(),
                IconColumn::make('is_primary')
                    ->label('Primary')
                    ->boolean(),
            ])
            ->defaultSort('id')
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
            ->emptyStateHeading('No guests')
            ->emptyStateDescription('Passengers on this trip will appear here.');
    }
}
