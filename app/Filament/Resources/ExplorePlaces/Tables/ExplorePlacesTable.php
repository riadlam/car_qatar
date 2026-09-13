<?php

namespace App\Filament\Resources\ExplorePlaces\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ExplorePlacesTable
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
                ImageColumn::make('image_path')
                    ->label('Image')
                    ->height(48)
                    ->square()
                    ->checkFileExistence(false)
                    ->getStateUsing(fn ($record) => $record->imageUrl()),
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->description(fn ($record) => $record->area),
                TextColumn::make('category')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'hotel' => 'Hotels',
                        'beach' => 'Beaches',
                        'mall' => 'Malls',
                        'restaurant' => 'Restaurants',
                        'iconic' => 'Iconic',
                        default => (string) $state,
                    }),
                IconColumn::make('show_in_carousel')
                    ->label('Card')
                    ->boolean(),
                IconColumn::make('show_in_scheduler')
                    ->label('Picker')
                    ->boolean(),
                TextColumn::make('latitude')
                    ->label('Map')
                    ->formatStateUsing(fn ($state, $record) => $record->latitude && $record->longitude ? 'Set' : '—'),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => $state === 'active' ? 'On site' : 'Hidden')
                    ->color(fn (?string $state): string => $state === 'active' ? 'success' : 'danger'),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->options([
                        'hotel' => 'Hotels',
                        'beach' => 'Beaches',
                        'mall' => 'Malls',
                        'restaurant' => 'Restaurants',
                        'iconic' => 'Iconic places',
                    ]),
                SelectFilter::make('status')
                    ->options([
                        'active' => 'On site',
                        'inactive' => 'Hidden',
                    ]),
                TernaryFilter::make('show_in_carousel')
                    ->label('In carousel'),
                TernaryFilter::make('show_in_scheduler')
                    ->label('In picker'),
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
