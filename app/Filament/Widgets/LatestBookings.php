<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Bookings\BookingResource;
use App\Models\Booking;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestBookings extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Latest bookings';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                fn (): Builder => Booking::query()
                    ->with(['user', 'serviceType', 'vehicleClass'])
                    ->latest()
                    ->limit(8)
            )
            ->striped()
            ->paginated(false)
            ->columns([
                TextColumn::make('booking_number')
                    ->label('Booking')
                    ->searchable()
                    ->weight('medium'),
                TextColumn::make('user.name')
                    ->label('Customer')
                    ->toggleable(),
                TextColumn::make('serviceType.name')
                    ->label('Service')
                    ->toggleable()
                    ->hiddenFrom('md'),
                TextColumn::make('vehicleClass.name')
                    ->label('Class')
                    ->toggleable()
                    ->hiddenFrom('md'),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('payment_status')
                    ->label('Payment')
                    ->badge()
                    ->hiddenFrom('sm'),
                TextColumn::make('pickup_at')
                    ->dateTime('M j, H:i')
                    ->sortable(),
                TextColumn::make('total_amount')
                    ->label('Total')
                    ->money(fn (Booking $record): string => $record->currency ?: 'USD'),
            ])
            ->recordActions([
                Action::make('view')
                    ->label('Open')
                    ->url(fn (Booking $record): string => BookingResource::getUrl('view', ['record' => $record])),
            ]);
    }
}
