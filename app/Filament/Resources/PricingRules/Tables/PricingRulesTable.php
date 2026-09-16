<?php

namespace App\Filament\Resources\PricingRules\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PricingRulesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->striped()
            ->columns([
                TextColumn::make('serviceType.name')
                    ->label('Service')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('vehicleClass.name')
                    ->label('Vehicle class')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('base_price')
                    ->label('Starting fee')
                    ->money(fn ($record) => $record->currency ?? 'USD')
                    ->sortable(),
                TextColumn::make('per_km')
                    ->label('Per km')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('hourly_price')
                    ->label('Hourly')
                    ->money(fn ($record) => $record->currency ?? 'USD')
                    ->placeholder('—')
                    ->sortable(),
                TextColumn::make('tax_rate')
                    ->label('Tax %')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->searchable()
                    ->sortable(),
                TextColumn::make('currency')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('priority')
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
