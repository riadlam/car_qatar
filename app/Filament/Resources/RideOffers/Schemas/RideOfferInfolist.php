<?php

namespace App\Filament\Resources\RideOffers\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RideOfferInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Offer')
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
                    ]),
                Section::make('Timing')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('offered_at')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('expires_at')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('responded_at')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('notes')
                            ->placeholder('—')
                            ->columnSpanFull(),
                    ]),
                Section::make('Timeline')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
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
