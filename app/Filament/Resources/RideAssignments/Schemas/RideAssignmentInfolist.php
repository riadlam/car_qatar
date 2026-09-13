<?php

namespace App\Filament\Resources\RideAssignments\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class RideAssignmentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('booking.id')
                    ->label('Booking'),
                TextEntry::make('chauffeur.id')
                    ->label('Chauffeur'),
                TextEntry::make('vehicle.id')
                    ->label('Vehicle')
                    ->placeholder('-'),
                TextEntry::make('rideOffer.id')
                    ->label('Ride offer')
                    ->placeholder('-'),
                TextEntry::make('status'),
                TextEntry::make('assigned_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('started_at')
                    ->dateTime()
                    ->placeholder('-'),
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
}
