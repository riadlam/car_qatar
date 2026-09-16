<?php

namespace App\Filament\Resources\Bookings\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PriceItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'priceItems';

    protected static ?string $title = 'Price items';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('item_type')
                    ->label('Type')
                    ->maxLength(100),
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Textarea::make('description')
                    ->rows(2)
                    ->columnSpanFull(),
                TextInput::make('quantity')
                    ->numeric()
                    ->default(1),
                TextInput::make('unit_price')
                    ->numeric()
                    ->prefix(fn (): string => (string) ($this->getOwnerRecord()->currency ?? 'QAR')),
                TextInput::make('total_price')
                    ->numeric()
                    ->prefix(fn (): string => (string) ($this->getOwnerRecord()->currency ?? 'QAR')),
            ]);
    }

    public function table(Table $table): Table
    {
        $currency = (string) ($this->getOwnerRecord()->currency ?? 'QAR');

        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->wrap(),
                TextColumn::make('item_type')
                    ->label('Type')
                    ->badge()
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('quantity')
                    ->numeric()
                    ->alignEnd()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('total_price')
                    ->label('Amount')
                    ->money($currency)
                    ->alignEnd()
                    ->sortable(),
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
            ->emptyStateHeading('No price items')
            ->emptyStateDescription('Line items that make up the booking total will appear here.');
    }
}
