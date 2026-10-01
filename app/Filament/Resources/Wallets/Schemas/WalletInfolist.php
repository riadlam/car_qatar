<?php

namespace App\Filament\Resources\Wallets\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class WalletInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Wallet')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('user.name')
                            ->label('Account'),
                        TextEntry::make('user.email')
                            ->label('Email')
                            ->copyable(),
                        TextEntry::make('user.role')
                            ->badge()
                            ->formatStateUsing(fn ($state) => is_object($state) && method_exists($state, 'label')
                                ? $state->label()
                                : (string) $state),
                        TextEntry::make('balance')
                            ->money(fn ($record) => $record->currency ?: 'QAR')
                            ->size('lg')
                            ->weight('bold'),
                        TextEntry::make('currency'),
                        TextEntry::make('status')
                            ->badge(),
                        TextEntry::make('updated_at')
                            ->dateTime()
                            ->label('Last updated'),
                    ]),
            ]);
    }
}
