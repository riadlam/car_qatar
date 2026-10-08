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
                Section::make('Partner commission')
                    ->columns(2)
                    ->visible(fn (Booking $record): bool => $record->partner_id !== null)
                    ->schema([
                        TextEntry::make('partner.display_name')
                            ->label('Partner')
                            ->placeholder('—'),
                        TextEntry::make('bookedBy.name')
                            ->label('Booked by')
                            ->placeholder('—'),
                        TextEntry::make('partner_commission_type')
                            ->label('Fee type')
                            ->placeholder('—'),
                        TextEntry::make('partner_commission_value')
                            ->label('Fee value')
                            ->placeholder('—'),
                        TextEntry::make('partner_commission_amount')
                            ->label('Fee amount')
                            ->money(fn (Booking $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('partner_commission_status')
                            ->label('Fee status')
                            ->badge()
                            ->placeholder('—'),
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
                        TextEntry::make('preferred_chauffeur_gender')
                            ->label('Preferred chauffeur')
                            ->formatStateUsing(fn (?string $state): string => match ($state) {
                                'male' => 'Male chauffeur',
                                'female' => 'Female chauffeur',
                                default => '—',
                            })
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
                    ->description('When the chauffeur tapped each status button in the app — use gaps to spot delays or misuse.')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('created_at')
                            ->label('Booking created')
                            ->dateTime('M j, Y H:i:s')
                            ->placeholder('—'),
                        TextEntry::make('rideAssignment.assigned_at')
                            ->label('Offer accepted')
                            ->dateTime('M j, Y H:i:s')
                            ->placeholder('—'),
                        TextEntry::make('tap_en_route')
                            ->label('En route (tap)')
                            ->placeholder('—')
                            ->state(fn (Booking $record): ?string => self::eventTime($record, 'en_route')),
                        TextEntry::make('tap_arrived')
                            ->label('Arrived at pickup (tap)')
                            ->placeholder('—')
                            ->state(fn (Booking $record): ?string => self::eventTime($record, 'arrived')),
                        TextEntry::make('tap_in_progress')
                            ->label('Trip started (tap)')
                            ->placeholder('—')
                            ->state(fn (Booking $record): ?string => self::eventTime($record, 'in_progress')),
                        TextEntry::make('tap_completed')
                            ->label('Completed (tap)')
                            ->placeholder('—')
                            ->state(fn (Booking $record): ?string => self::eventTime($record, 'completed')),
                        TextEntry::make('completed_at')
                            ->label('Booking completed_at')
                            ->dateTime('M j, Y H:i:s')
                            ->placeholder('—'),
                        TextEntry::make('cancelled_at')
                            ->label('Canceled at')
                            ->dateTime('M j, Y H:i:s')
                            ->placeholder('—')
                            ->visible(fn (Booking $record): bool => $record->cancelled_at !== null),
                        TextEntry::make('tap_gaps')
                            ->label('Gaps between taps')
                            ->placeholder('—')
                            ->columnSpanFull()
                            ->state(fn (Booking $record): ?string => self::eventGaps($record)),
                    ]),
            ]);
    }

    private static function eventTime(Booking $record, string $type): ?string
    {
        $at = self::eventMoment($record, $type);
        if (! $at) {
            return null;
        }

        return $at->timezone(config('app.timezone'))->format('M j, Y H:i:s');
    }

    private static function eventMoment(Booking $record, string $type): ?\Carbon\CarbonInterface
    {
        $events = $record->relationLoaded('rideEvents')
            ? $record->rideEvents
            : $record->rideEvents()->orderBy('recorded_at')->get();

        $row = $events->firstWhere('event_type', $type);
        if (! $row?->recorded_at) {
            // Fallbacks from assignment columns when older rows lack a matching event.
            $assignment = $record->relationLoaded('rideAssignment')
                ? $record->rideAssignment
                : $record->rideAssignment()->first();

            return match ($type) {
                'en_route' => $assignment?->started_at ?? $assignment?->assigned_at,
                'completed' => $assignment?->completed_at ?? $record->completed_at,
                default => null,
            };
        }

        return $row->recorded_at;
    }

    private static function eventGaps(Booking $record): ?string
    {
        $steps = [
            'en_route' => 'En route',
            'arrived' => 'Arrived',
            'in_progress' => 'Trip started',
            'completed' => 'Completed',
        ];

        $times = [];
        foreach ($steps as $type => $label) {
            $at = self::eventMoment($record, $type);
            if ($at) {
                $times[] = [$label, $at];
            }
        }

        if (count($times) < 2) {
            return null;
        }

        $bits = [];
        for ($i = 1; $i < count($times); $i++) {
            [$fromLabel, $from] = $times[$i - 1];
            [$toLabel, $to] = $times[$i];
            $seconds = max(0, $from->diffInSeconds($to));
            $bits[] = "{$fromLabel} → {$toLabel}: ".self::humanDuration($seconds);
        }

        return implode(' · ', $bits);
    }

    private static function humanDuration(int $seconds): string
    {
        if ($seconds < 60) {
            return $seconds.'s';
        }
        $minutes = intdiv($seconds, 60);
        $rem = $seconds % 60;
        if ($minutes < 60) {
            return $rem > 0 ? "{$minutes}m {$rem}s" : "{$minutes}m";
        }
        $hours = intdiv($minutes, 60);
        $mins = $minutes % 60;

        return $mins > 0 ? "{$hours}h {$mins}m" : "{$hours}h";
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
