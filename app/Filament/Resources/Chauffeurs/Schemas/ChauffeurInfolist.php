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
                                'paused' => 'warning',
                                default => 'gray',
                            }),
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
            ]);
    }
}
