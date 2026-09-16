<?php

namespace App\Filament\Widgets;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Filament\Resources\Bookings\BookingResource;
use App\Models\Booking;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestBookings extends TableWidget
{
    protected static ?int $sort = 6;

    protected int | string | array $columnSpan = 'full';

    protected static ?string $heading = 'Latest bookings';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                fn (): Builder => Booking::query()
                    ->with(['user', 'serviceType', 'vehicleClass'])
                    ->latest()
                    ->limit(10)
            )
            ->description('Most recent reservations across the platform')
            ->striped()
            ->paginated(false)
            ->emptyStateHeading('No bookings yet')
            ->emptyStateDescription('New reservations will show up here.')
            ->columns([
                TextColumn::make('booking_number')
                    ->label('Booking')
                    ->searchable()
                    ->weight('medium'),
                TextColumn::make('user.name')
                    ->label('Customer')
                    ->toggleable()
                    ->placeholder('—'),
                TextColumn::make('serviceType.name')
                    ->label('Service')
                    ->toggleable()
                    ->hiddenFrom('md')
                    ->placeholder('—'),
                TextColumn::make('vehicleClass.name')
                    ->label('Class')
                    ->toggleable()
                    ->hiddenFrom('md')
                    ->placeholder('—'),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (BookingStatus | string | null $state): string => $state instanceof BookingStatus
                        ? $state->label()
                        : (BookingStatus::tryFrom((string) $state)?->label() ?? ucfirst((string) $state)))
                    ->color(fn (BookingStatus | string | null $state): string => match ($state instanceof BookingStatus ? $state : BookingStatus::tryFrom((string) $state)) {
                        BookingStatus::Completed => 'success',
                        BookingStatus::InProgress, BookingStatus::ChauffeurAssigned => 'primary',
                        BookingStatus::Confirmed => 'info',
                        BookingStatus::PendingPayment => 'warning',
                        BookingStatus::Cancelled => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('payment_status')
                    ->label('Payment')
                    ->badge()
                    ->hiddenFrom('sm')
                    ->formatStateUsing(fn (PaymentStatus | string | null $state): string => $state instanceof PaymentStatus
                        ? $state->label()
                        : (PaymentStatus::tryFrom((string) $state)?->label() ?? ucfirst((string) $state)))
                    ->color(fn (PaymentStatus | string | null $state): string => match ($state instanceof PaymentStatus ? $state : PaymentStatus::tryFrom((string) $state)) {
                        PaymentStatus::Paid => 'success',
                        PaymentStatus::Authorized => 'info',
                        PaymentStatus::Pending => 'warning',
                        PaymentStatus::Failed => 'danger',
                        PaymentStatus::Refunded, PaymentStatus::PartiallyRefunded => 'gray',
                        default => 'gray',
                    }),
                TextColumn::make('pickup_at')
                    ->dateTime('M j, H:i')
                    ->sortable()
                    ->placeholder('—'),
                TextColumn::make('total_amount')
                    ->label('Total')
                    ->money(fn (Booking $record): string => $record->currency ?: 'QAR'),
            ])
            ->recordActions([
                Action::make('view')
                    ->label('Open')
                    ->url(fn (Booking $record): string => BookingResource::getUrl('view', ['record' => $record])),
            ]);
    }
}
