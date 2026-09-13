<?php

namespace App\Filament\Resources\CancellationReasons\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CancellationReasonsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->striped()
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('sort_order')
                    ->label('#')
                    ->sortable(),
                TextColumn::make('audience')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => $state === 'chauffeur' ? 'Chauffeur' : 'Customer')
                    ->color(fn (?string $state): string => $state === 'chauffeur' ? 'warning' : 'info')
                    ->sortable(),
                TextColumn::make('label')
                    ->searchable()
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
            ])
            ->filters([
                SelectFilter::make('audience')
                    ->options([
                        'customer' => 'Customer',
                        'chauffeur' => 'Chauffeur',
                    ]),
                SelectFilter::make('is_active')
                    ->label('Active')
                    ->options([
                        '1' => 'Active',
                        '0' => 'Off',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
