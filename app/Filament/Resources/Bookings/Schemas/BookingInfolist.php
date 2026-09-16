<?php

namespace App\Filament\Resources\Bookings\Schemas;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BookingInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Overview')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('booking_number')
                            ->label('Booking'),
                        TextEntry::make('user.name')
                            ->label('Customer')
                            ->placeholder('—'),
                        TextEntry::make('serviceType.name')
                            ->label('Service')
                            ->placeholder('—'),
                        TextEntry::make('vehicleClass.name')
                            ->label('Vehicle class')
                            ->placeholder('—'),
                        TextEntry::make('status')
                            ->badge()
                            ->formatStateUsing(fn (BookingStatus | string | null $state): string => self::statusLabel($state))
                            ->color(fn (BookingStatus | string | null $state): string => self::statusColor($state)),
                        TextEntry::make('payment_status')
                            ->label('Payment')
                            ->badge()
                            ->formatStateUsing(fn (PaymentStatus | string | null $state): string => self::paymentLabel($state))
                            ->color(fn (PaymentStatus | string | null $state): string => self::paymentColor($state)),
                        TextEntry::make('pickup_at')
                            ->label('Pickup time')
                            ->dateTime('M j, Y H:i'),
                        TextEntry::make('timezone')
                            ->placeholder('—'),
                        TextEntry::make('quote.quote_number')
                            ->label('Quote')
                            ->placeholder('—'),
                    ]),
                Section::make('Route')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('pickupLocation.name')
                            ->label('Pickup')
                            ->placeholder('—')
                            ->columnSpanFull(),
                        TextEntry::make('dropoffLocation.name')
                            ->label('Drop-off')
                            ->placeholder('—')
                            ->columnSpanFull(),
                        TextEntry::make('passenger_count')
                            ->label('Passengers')
                            ->numeric(),
                        TextEntry::make('luggage_count')
                            ->label('Luggage')
                            ->numeric()
                            ->placeholder('—'),
                        TextEntry::make('seatAddon.label')
                            ->label('Seat addon')
                            ->placeholder('—'),
                    ]),
                Section::make('Pricing')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('currency')
                            ->placeholder('QAR'),
                        TextEntry::make('subtotal')
                            ->money(fn (Booking $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('tax_amount')
                            ->label('Tax')
                            ->money(fn (Booking $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('fees')
                            ->money(fn (Booking $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('discount')
                            ->money(fn (Booking $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('total_amount')
                            ->label('Total')
                            ->money(fn (Booking $record): string => $record->currency ?: 'QAR')
                            ->size('lg')
                            ->weight('bold'),
                    ]),
                Section::make('Notes & references')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
                        TextEntry::make('customer_notes')
                            ->placeholder('—')
                            ->columnSpanFull(),
                        TextEntry::make('chauffeur_notes')
                            ->placeholder('—')
                            ->columnSpanFull(),
                        TextEntry::make('pickup_sign')
                            ->placeholder('—'),
                        TextEntry::make('customer_reference')
                            ->placeholder('—'),
                        TextEntry::make('preferred_language')
                            ->label('Preferred language')
                            ->placeholder('—'),
                        TextEntry::make('billing')
                            ->placeholder('—')
                            ->formatStateUsing(fn ($state): string => self::formatBilling($state))
                            ->columnSpanFull(),
                    ]),
                Section::make('Cancellation')
                    ->columns(2)
                    ->visible(fn (Booking $record): bool => $record->status === BookingStatus::Cancelled || $record->cancelled_at !== null)
                    ->schema([
                        TextEntry::make('cancelled_at')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('cancel_step')
                            ->label('Cancel step')
                            ->placeholder('—')
                            ->state(fn (Booking $record): ?string => self::cancelLine($record, 'step')),
                        TextEntry::make('cancel_distance')
                            ->label('Distance to pickup')
                            ->placeholder('—')
                            ->state(fn (Booking $record): ?string => self::cancelLine($record, 'distance')),
                        TextEntry::make('cancel_chauffeur')
                            ->label('Chauffeur at cancel')
                            ->placeholder('—')
                            ->state(fn (Booking $record): ?string => self::cancelLine($record, 'chauffeur')),
                    ]),
                Section::make('Timeline')
                    ->columns(3)
                    ->collapsed()
                    ->schema([
                        TextEntry::make('completed_at')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('created_at')
                            ->label('Created')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('updated_at')
                            ->label('Updated')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                    ]),
            ]);
    }

    private static function statusLabel(BookingStatus | string | null $state): string
    {
        $enum = $state instanceof BookingStatus ? $state : BookingStatus::tryFrom((string) $state);

        return $enum?->label() ?? ucfirst((string) $state);
    }

    private static function statusColor(BookingStatus | string | null $state): string
    {
        $enum = $state instanceof BookingStatus ? $state : BookingStatus::tryFrom((string) $state);

        return match ($enum) {
            BookingStatus::Completed => 'success',
            BookingStatus::InProgress, BookingStatus::ChauffeurAssigned => 'primary',
            BookingStatus::Confirmed => 'info',
            BookingStatus::PendingPayment => 'warning',
            BookingStatus::Cancelled => 'danger',
            default => 'gray',
        };
    }

    private static function paymentLabel(PaymentStatus | string | null $state): string
    {
        $enum = $state instanceof PaymentStatus ? $state : PaymentStatus::tryFrom((string) $state);

        return $enum?->label() ?? ucfirst((string) $state);
    }

    private static function paymentColor(PaymentStatus | string | null $state): string
    {
        $enum = $state instanceof PaymentStatus ? $state : PaymentStatus::tryFrom((string) $state);

        return match ($enum) {
            PaymentStatus::Paid => 'success',
            PaymentStatus::Authorized => 'info',
            PaymentStatus::Pending => 'warning',
            PaymentStatus::Failed => 'danger',
            PaymentStatus::Refunded, PaymentStatus::PartiallyRefunded => 'gray',
            default => 'gray',
        };
    }

    private static function formatBilling(mixed $state): string
    {
        if ($state === null || $state === '') {
            return '—';
        }
        if (is_string($state)) {
            return $state;
        }
        if (is_array($state)) {
            $bits = array_filter([
                $state['name'] ?? null,
                $state['email'] ?? null,
                $state['phone'] ?? null,
                $state['company'] ?? $state['company_name'] ?? null,
            ]);

            return $bits !== [] ? implode(' · ', $bits) : json_encode($state, JSON_UNESCAPED_UNICODE);
        }

        return (string) $state;
    }

    private static function cancelLine(Booking $record, string $part): ?string
    {
        $row = $record->cancellations()->with('chauffeur.user')->latest('id')->first();
        if (! $row) {
            return null;
        }

        if ($part === 'step') {
            $label = match ($row->trip_step) {
                'waiting' => 'Before assignment',
                'to_pickup' => 'On the way to pickup',
                'to_dropoff' => 'After reaching pickup',
                default => $row->trip_step,
            };
            $service = $row->service_type ? " · {$row->service_type}" : '';

            return $label ? $label.$service : null;
        }

        if ($part === 'distance') {
            return $row->distance_to_pickup_m !== null
                ? $row->distance_to_pickup_m.' m'
                : null;
        }

        $user = $row->chauffeur?->user;
        $name = $user?->name ?: trim(collect([$user?->first_name, $user?->last_name])->filter()->implode(' '));

        return $name !== '' ? $name : null;
    }
}
