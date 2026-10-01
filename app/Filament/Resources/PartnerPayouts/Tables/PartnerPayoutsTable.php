<?php

namespace App\Filament\Resources\PartnerPayouts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PartnerPayoutsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->striped()
            ->defaultSort('paid_at', 'desc')
            ->columns([
                TextColumn::make('partner.display_name')
                    ->label('Partner')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('amount')
                    ->money(fn ($record) => $record->currency ?: 'QAR')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (?string $state): string => $state === 'paid' ? 'success' : 'gray'),
                TextColumn::make('paid_at')
                    ->dateTime()
                    ->placeholder('—')
                    ->sortable(),
                TextColumn::make('note')
                    ->limit(40)
                    ->toggleable(),
                TextColumn::make('createdBy.name')
                    ->label('Recorded by')
                    ->placeholder('—'),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'paid' => 'Paid',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
