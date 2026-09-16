<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Bookings\BookingResource;
use App\Models\RideAssignment;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LiveTripsWidget extends TableWidget
{
    protected static ?int $sort = 4;

    protected int | string | array $columnSpan = 1;

    protected static ?string $heading = 'Live trips';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                fn (): Builder => RideAssignment::query()
                    ->with(['booking.user', 'chauffeur.user'])
                    ->whereIn('status', ['assigned', 'en_route', 'arrived', 'in_progress'])
                    ->latest('assigned_at')
                    ->limit(8)
            )
            ->description('Assigned chauffeurs currently on a trip')
            ->striped()
            ->paginated(false)
            ->emptyStateHeading('No live trips')
            ->emptyStateDescription('All clear — nothing in progress right now.')
            ->columns([
                TextColumn::make('booking.booking_number')
                    ->label('Booking')
                    ->weight('medium')
                    ->placeholder('—'),
                TextColumn::make('chauffeur.user.name')
                    ->label('Chauffeur')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'assigned' => 'Assigned',
                        'en_route' => 'En route',
                        'arrived' => 'Arrived',
                        'in_progress' => 'In progress',
                        default => ucfirst((string) $state),
                    })
                    ->color(fn (?string $state): string => match ($state) {
                        'assigned' => 'info',
                        'en_route' => 'warning',
                        'arrived' => 'primary',
                        'in_progress' => 'success',
                        default => 'gray',
                    }),
                TextColumn::make('booking.pickup_at')
                    ->label('Pickup')
                    ->dateTime('M j, H:i')
                    ->placeholder('—'),
                TextColumn::make('eta_minutes')
                    ->label('ETA')
                    ->formatStateUsing(fn ($state): string => $state !== null ? $state.' min' : '—')
                    ->toggleable(),
            ])
            ->recordActions([
                Action::make('open')
                    ->label('Open')
                    ->url(fn (RideAssignment $record): ?string => $record->booking
                        ? BookingResource::getUrl('view', ['record' => $record->booking])
                        : null),
            ]);
    }
}
