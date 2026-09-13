<?php

namespace App\Filament\Resources\ServiceTypes\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ServiceTypesTable
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
                    ->sortable()
                    ->width('4rem'),
                TextColumn::make('name')
                    ->label('Tab label')
                    ->searchable()
                    ->sortable()
                    ->description(fn ($record) => $record->slug),
                TextColumn::make('mode')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'hourly' => 'Hourly',
                        'transfer' => 'Transfer',
                        default => (string) $state,
                    })
                    ->color(fn (?string $state): string => match ($state) {
                        'hourly' => 'info',
                        'transfer' => 'gray',
                        default => 'gray',
                    }),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => $state === 'active' ? 'On site' : 'Hidden')
                    ->color(fn (?string $state): string => $state === 'active' ? 'success' : 'danger')
                    ->sortable(),
                IconColumn::make('requires_dropoff')
                    ->label('Drop-off')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('allows_multi_stops')
                    ->label('Multi-stops')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('is_hourly')
                    ->label('Hourly')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('requires_gulf_destination')
                    ->label('Gulf')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('requires_school_term')
                    ->label('School')
                    ->boolean()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'active' => 'On site',
                        'inactive' => 'Hidden',
                    ]),
                SelectFilter::make('mode')
                    ->options([
                        'transfer' => 'Transfer',
                        'hourly' => 'Hourly',
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
