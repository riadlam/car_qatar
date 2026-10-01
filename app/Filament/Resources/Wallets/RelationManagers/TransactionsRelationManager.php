<?php

namespace App\Filament\Resources\Wallets\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TransactionsRelationManager extends RelationManager
{
    protected static string $relationship = 'transactions';

    protected static ?string $title = 'Ledger';

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('type')
                    ->badge()
                    ->color(fn (?string $state): string => $state === 'credit' ? 'success' : 'danger'),
                TextColumn::make('amount')
                    ->money(fn ($record) => $record->currency ?: 'QAR'),
                TextColumn::make('balance_after')
                    ->label('Balance after')
                    ->money(fn ($record) => $record->currency ?: 'QAR'),
                TextColumn::make('reason')
                    ->badge(),
                TextColumn::make('note')
                    ->limit(40)
                    ->placeholder('—'),
                TextColumn::make('createdBy.name')
                    ->label('By')
                    ->placeholder('—'),
            ])
            ->emptyStateHeading('No transactions yet');
    }
}
