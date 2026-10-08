<?php

namespace App\Filament\Resources\Chauffeurs\RelationManagers;

use App\Filament\Resources\Bookings\BookingResource;
use Filament\Actions\Action;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RideOffersRelationManager extends RelationManager
{
    protected static string $relationship = 'rideOffers';

    protected static ?string $title = 'Offers';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('offered_at', 'desc')
            ->columns([
                TextColumn::make('booking.booking_number')
                    ->label('Booking')
                    ->searchable()
                    ->sortable()
                    ->placeholder('—'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'accepted' => 'success',
                        'offered', 'pending' => 'warning',
                        'rejected', 'expired', 'withdrawn' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('offered_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable()
                    ->placeholder('—'),
                TextColumn::make('responded_at')
                    ->dateTime()
                    ->sortable()
                    ->placeholder('—'),
                TextColumn::make('notes')
                    ->limit(40)
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->placeholder('—'),
            ])
            ->recordActions([
                Action::make('openBooking')
                    ->label('Booking')
                    ->url(fn ($record): ?string => $record->booking_id
                        ? BookingResource::getUrl('view', ['record' => $record->booking_id])
                        : null)
                    ->visible(fn ($record): bool => filled($record->booking_id)),
            ])
            ->emptyStateHeading('No offers yet')
            ->emptyStateDescription('Dispatch offers sent to this chauffeur will appear here.');
    }
}
