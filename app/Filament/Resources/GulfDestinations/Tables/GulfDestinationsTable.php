<?php

namespace App\Filament\Resources\GulfDestinations\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class GulfDestinationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->striped()
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('country.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('city.name')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('latitude')
                    ->label('Map pin')
                    ->formatStateUsing(fn ($state, $record) => $record->latitude && $record->longitude
                        ? number_format((float) $record->latitude, 4).', '.number_format((float) $record->longitude, 4)
                        : 'Not linked')
                    ->color(fn ($state, $record) => $record->latitude && $record->longitude ? 'success' : 'warning')
                    ->badge()
                    ->tooltip(fn ($record) => $record->latitude && $record->longitude
                        ? "{$record->latitude}, {$record->longitude}"
                        : 'Edit and link Mapbox coordinates'),
                TextColumn::make('status')
                    ->badge()
                    ->searchable()
                    ->sortable(),
                TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
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
