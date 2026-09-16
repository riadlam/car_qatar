<?php

namespace App\Filament\Resources\RideAssignments\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RideAssignmentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Assignment')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('booking.booking_number')
                            ->label('Booking')
                            ->placeholder('—'),
                        TextEntry::make('status')
                            ->badge()
                            ->formatStateUsing(fn (?string $state): string => ucfirst(str_replace('_', ' ', (string) $state))),
                        TextEntry::make('chauffeur.user.name')
                            ->label('Chauffeur')
                            ->placeholder('—'),
                        TextEntry::make('vehicle.license_plate')
                            ->label('Vehicle')
                            ->placeholder('—'),
                        TextEntry::make('rideOffer.id')
                            ->label('Ride offer')
                            ->placeholder('—'),
                    ]),
                Section::make('Timeline')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('assigned_at')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('started_at')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
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
}
