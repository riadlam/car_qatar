<?php

namespace App\Filament\Resources\Chauffeurs\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ChauffeurInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identity')
                    ->columns(3)
                    ->schema([
                        TextEntry::make('user.name')
                            ->label('Name'),
                        TextEntry::make('user.email')
                            ->label('Email')
                            ->copyable(),
                        TextEntry::make('user.phone')
                            ->label('Phone')
                            ->copyable()
                            ->placeholder('—'),
                        TextEntry::make('gender')
                            ->badge()
                            ->formatStateUsing(fn (?string $state): string => match ($state) {
                                'male' => 'Male',
                                'female' => 'Female',
                                default => '—',
                            }),
                        TextEntry::make('status')
                            ->badge()
                            ->color(fn (?string $state): string => match ($state) {
                                'active' => 'success',
                                'pending' => 'warning',
                                'declined', 'suspended' => 'danger',
                                'inactive' => 'gray',
                                default => 'gray',
                            }),
                        TextEntry::make('partner.display_name')
                            ->label('Partner')
                            ->placeholder('—'),
                    ]),
                Section::make('Work metrics')
                    ->columns(3)
                    ->schema([
                        TextEntry::make('rating')
                            ->numeric(decimalPlaces: 2)
                            ->placeholder('—'),
                        TextEntry::make('ratings_count')
                            ->label('Ratings')
                            ->numeric(),
                        TextEntry::make('completed_rides')
                            ->label('Completed rides')
                            ->numeric()
                            ->weight('bold'),
                    ]),
                Section::make('License')
                    ->columns(3)
                    ->schema([
                        TextEntry::make('license_number')
                            ->placeholder('—'),
                        TextEntry::make('license_country')
                            ->placeholder('—'),
                        TextEntry::make('license_expires_at')
                            ->date()
                            ->placeholder('—'),
                    ]),
                Section::make('Last known location')
                    ->columns(3)
                    ->collapsed()
                    ->schema([
                        TextEntry::make('current_latitude')
                            ->placeholder('—'),
                        TextEntry::make('current_longitude')
                            ->placeholder('—'),
                        TextEntry::make('last_location_at')
                            ->dateTime()
                            ->placeholder('—'),
                    ]),
            ]);
    }
}
