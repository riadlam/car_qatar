<?php

namespace App\Filament\Resources\Bookings\Schemas;

use App\Models\Booking;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class BookingInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('booking_number'),
                TextEntry::make('user.name')
                    ->label('User'),
                TextEntry::make('quote.id')
                    ->label('Quote')
                    ->placeholder('-'),
                TextEntry::make('serviceType.name')
                    ->label('Service type'),
                TextEntry::make('status')
                    ->badge(),
                TextEntry::make('payment_status')
                    ->badge(),
                TextEntry::make('pickupLocation.name')
                    ->label('Pickup location'),
                TextEntry::make('dropoffLocation.name')
                    ->label('Dropoff location')
                    ->placeholder('-'),
                TextEntry::make('pickup_at')
                    ->dateTime(),
                TextEntry::make('timezone'),
                TextEntry::make('passenger_count')
                    ->numeric(),
                TextEntry::make('luggage_count')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('vehicleClass.name')
                    ->label('Vehicle class'),
                TextEntry::make('currency'),
                TextEntry::make('subtotal')
                    ->numeric(),
                TextEntry::make('tax_amount')
                    ->numeric(),
                TextEntry::make('fees')
                    ->numeric(),
                TextEntry::make('discount')
                    ->numeric(),
                TextEntry::make('total_amount')
                    ->numeric(),
                TextEntry::make('customer_notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('chauffeur_notes')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('pickup_sign')
                    ->placeholder('-'),
                TextEntry::make('customer_reference')
                    ->placeholder('-'),
                TextEntry::make('cost_center_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('seatAddon.id')
                    ->label('Seat addon')
                    ->placeholder('-'),
                TextEntry::make('preferred_language')
                    ->placeholder('-'),
                TextEntry::make('billing')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('cancelled_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('cancel_step')
                    ->label('Cancel step')
                    ->placeholder('-')
                    ->state(fn (Booking $record): ?string => self::cancelLine($record, 'step')),
                TextEntry::make('cancel_distance')
                    ->label('Distance to pickup at cancel')
                    ->placeholder('-')
                    ->state(fn (Booking $record): ?string => self::cancelLine($record, 'distance')),
                TextEntry::make('cancel_chauffeur')
                    ->label('Chauffeur at cancel')
                    ->placeholder('-')
                    ->state(fn (Booking $record): ?string => self::cancelLine($record, 'chauffeur')),
                TextEntry::make('completed_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
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
