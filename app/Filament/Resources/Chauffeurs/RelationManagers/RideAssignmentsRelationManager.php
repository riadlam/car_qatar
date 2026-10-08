<?php

namespace App\Filament\Resources\Chauffeurs\RelationManagers;

use App\Filament\Resources\Bookings\BookingResource;
use App\Filament\Resources\RideAssignments\RideAssignmentResource;
use Filament\Actions\Action;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RideAssignmentsRelationManager extends RelationManager
{
    protected static string $relationship = 'rideAssignments';

    protected static ?string $title = 'Trips & bookings';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('assigned_at', 'desc')
            ->columns([
                TextColumn::make('booking.booking_number')
                    ->label('Booking')
                    ->searchable()
                    ->sortable()
                    ->placeholder('—'),
                TextColumn::make('booking.status')
                    ->label('Booking status')
                    ->badge()
                    ->toggleable(),
                TextColumn::make('status')
                    ->label('Trip status')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'completed' => 'success',
                        'in_progress', 'en_route', 'arrived', 'started' => 'info',
                        'assigned', 'accepted' => 'warning',
                        'cancelled', 'failed' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('vehicle.license_plate')
                    ->label('Vehicle')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('assigned_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('started_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable()
                    ->placeholder('—'),
                TextColumn::make('completed_at')
                    ->dateTime()
                    ->sortable()
                    ->placeholder('—'),
            ])
            ->recordActions([
                Action::make('openAssignment')
                    ->label('Assignment')
                    ->url(fn ($record): string => RideAssignmentResource::getUrl('view', ['record' => $record]))
                    ->visible(fn ($record): bool => filled($record)),
                Action::make('openBooking')
                    ->label('Booking')
                    ->url(fn ($record): ?string => $record->booking_id
                        ? BookingResource::getUrl('view', ['record' => $record->booking_id])
                        : null)
                    ->visible(fn ($record): bool => filled($record->booking_id)),
            ])
            ->emptyStateHeading('No trips yet')
            ->emptyStateDescription('Assignments for this chauffeur will show here once they take rides.');
    }
}
