<?php

namespace App\Filament\Resources\Quotes\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class QuoteInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('quote_number'),
                TextEntry::make('user.name')
                    ->label('User')
                    ->placeholder('-'),
                TextEntry::make('serviceType.name')
                    ->label('Service type'),
                TextEntry::make('vehicleClass.name')
                    ->label('Vehicle class')
                    ->placeholder('-'),
                TextEntry::make('pickupLocation.name')
                    ->label('Pickup location'),
                TextEntry::make('dropoffLocation.name')
                    ->label('Dropoff location')
                    ->placeholder('-'),
                TextEntry::make('pickup_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('timezone'),
                TextEntry::make('duration_minutes')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('passenger_count')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('student_count')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('school_term')
                    ->placeholder('-'),
                TextEntry::make('gulfDestination.name')
                    ->label('Gulf destination')
                    ->placeholder('-'),
                TextEntry::make('currency'),
                TextEntry::make('subtotal')
                    ->numeric(),
                TextEntry::make('tax_amount')
                    ->numeric(),
                TextEntry::make('fees')
                    ->numeric(),
                TextEntry::make('discount')
                    ->numeric(),
                TextEntry::make('total')
                    ->numeric(),
                TextEntry::make('expires_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('status')
                    ->badge(),
                TextEntry::make('metadata')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
