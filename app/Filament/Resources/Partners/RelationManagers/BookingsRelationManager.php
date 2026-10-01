<?php

namespace App\Filament\Resources\Partners\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class BookingsRelationManager extends RelationManager
{
    protected static string $relationship = 'bookings';

    protected static ?string $title = 'Partner bookings';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('booking_number')
            ->defaultSort('pickup_at', 'desc')
            ->columns([
                TextColumn::make('booking_number')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('guest.first_name')
                    ->label('Guest')
                    ->formatStateUsing(function ($state, $record) {
                        $g = $record->guest;
                        return $g ? trim($g->first_name.' '.$g->last_name) : '—';
                    }),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('total_amount')
                    ->money(fn ($record) => $record->currency ?: 'QAR')
                    ->label('Guest total'),
                TextColumn::make('partner_commission_amount')
                    ->label('Partner fee')
                    ->money(fn ($record) => $record->currency ?: 'QAR'),
                TextColumn::make('partner_commission_status')
                    ->label('Fee status')
                    ->badge(),
                TextColumn::make('pickup_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->emptyStateHeading('No bookings yet');
    }
}
