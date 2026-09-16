<?php

namespace App\Filament\Resources\Payments\Schemas;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PaymentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Payment')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('booking.booking_number')
                            ->label('Booking')
                            ->placeholder('—'),
                        TextEntry::make('user.name')
                            ->label('Customer')
                            ->placeholder('—'),
                        TextEntry::make('amount')
                            ->money(fn (Payment $record): string => $record->currency ?: 'QAR')
                            ->size('lg')
                            ->weight('bold'),
                        TextEntry::make('currency')
                            ->placeholder('QAR'),
                        TextEntry::make('status')
                            ->badge()
                            ->formatStateUsing(fn (PaymentStatus | string | null $state): string => self::statusLabel($state)),
                        TextEntry::make('method')
                            ->placeholder('—'),
                    ]),
                Section::make('Provider')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('provider')
                            ->placeholder('—'),
                        TextEntry::make('provider_payment_id')
                            ->label('Provider payment ID')
                            ->placeholder('—'),
                        TextEntry::make('metadata')
                            ->placeholder('—')
                            ->formatStateUsing(fn ($state): string => self::formatJson($state))
                            ->columnSpanFull(),
                    ]),
                Section::make('Timeline')
                    ->columns(3)
                    ->collapsed()
                    ->schema([
                        TextEntry::make('paid_at')
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

    private static function statusLabel(PaymentStatus | string | null $state): string
    {
        $enum = $state instanceof PaymentStatus ? $state : PaymentStatus::tryFrom((string) $state);

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
