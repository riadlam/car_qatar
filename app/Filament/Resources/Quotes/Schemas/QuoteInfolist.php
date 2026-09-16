<?php

namespace App\Filament\Resources\Quotes\Schemas;

use App\Enums\QuoteStatus;
use App\Models\Quote;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class QuoteInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Overview')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('quote_number')
                            ->label('Quote'),
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
                            ->formatStateUsing(fn (QuoteStatus | string | null $state): string => self::statusLabel($state)),
                        TextEntry::make('expires_at')
                            ->dateTime('M j, Y H:i')
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
                        TextEntry::make('pickup_at')
                            ->label('Pickup time')
                            ->dateTime('M j, Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('timezone')
                            ->placeholder('—'),
                        TextEntry::make('duration_minutes')
                            ->label('Duration (min)')
                            ->numeric()
                            ->placeholder('—'),
                        TextEntry::make('passenger_count')
                            ->label('Passengers')
                            ->numeric()
                            ->placeholder('—'),
                        TextEntry::make('student_count')
                            ->label('Students')
                            ->numeric()
                            ->placeholder('—'),
                        TextEntry::make('school_term')
                            ->placeholder('—'),
                        TextEntry::make('gulfDestination.name')
                            ->label('Gulf destination')
                            ->placeholder('—'),
                    ]),
                Section::make('Pricing')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('currency')
                            ->placeholder('QAR'),
                        TextEntry::make('subtotal')
                            ->money(fn (Quote $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('tax_amount')
                            ->label('Tax')
                            ->money(fn (Quote $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('fees')
                            ->money(fn (Quote $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('discount')
                            ->money(fn (Quote $record): string => $record->currency ?: 'QAR'),
                        TextEntry::make('total')
                            ->money(fn (Quote $record): string => $record->currency ?: 'QAR')
                            ->size('lg')
                            ->weight('bold'),
                    ]),
                Section::make('Metadata')
                    ->collapsed()
                    ->schema([
                        TextEntry::make('metadata')
                            ->placeholder('—')
                            ->formatStateUsing(fn ($state): string => self::formatJson($state))
                            ->columnSpanFull(),
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

    private static function statusLabel(QuoteStatus | string | null $state): string
    {
        $enum = $state instanceof QuoteStatus ? $state : QuoteStatus::tryFrom((string) $state);

        return $enum?->label() ?? ucfirst((string) $state);
    }

    private static function formatJson(mixed $state): string
    {
        if ($state === null || $state === '') {
            return '—';
        }
        if (is_string($state)) {
            return $state;
        }
        if (is_array($state)) {
            return json_encode($state, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) ?: '—';
        }

        return (string) $state;
    }
}
