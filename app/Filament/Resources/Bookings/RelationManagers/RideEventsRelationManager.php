<?php

namespace App\Filament\Resources\Bookings\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RideEventsRelationManager extends RelationManager
{
    protected static string $relationship = 'rideEvents';

    protected static ?string $title = 'Chauffeur taps';

    protected static ?string $recordTitleAttribute = 'event_type';

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('recorded_at', 'asc')
            ->paginated(false)
            ->columns([
                TextColumn::make('recorded_at')
                    ->label('Tapped at')
                    ->dateTime('M j, Y H:i:s')
                    ->sortable(),
                TextColumn::make('event_type')
                    ->label('Button / event')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'en_route' => 'En route',
                        'arrived' => 'Arrived at pickup',
                        'in_progress' => 'Trip started',
                        'completed' => 'Completed',
                        'cancelled', 'canceled' => 'Canceled',
                        'assigned' => 'Assigned',
                        default => ucfirst(str_replace('_', ' ', (string) $state)),
                    })
                    ->color(fn (?string $state): string => match ($state) {
                        'completed' => 'success',
                        'cancelled', 'canceled' => 'danger',
                        'arrived', 'in_progress' => 'primary',
                        'en_route' => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('latitude')
                    ->label('Lat')
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('longitude')
                    ->label('Lng')
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->label('Logged')
                    ->dateTime('M j, Y H:i:s')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->headerActions([])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
