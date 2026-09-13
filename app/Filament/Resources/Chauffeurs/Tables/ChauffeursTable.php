<?php

namespace App\Filament\Resources\Chauffeurs\Tables;

use App\Models\Chauffeur;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ChauffeursTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->striped()
            ->columns([
                TextColumn::make('user.name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('user.phone')
                    ->label('Phone')
                    ->searchable(),
                TextColumn::make('partner.id')
                    ->label('Partner')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('license_number')
                    ->searchable(),
                TextColumn::make('license_country')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('license_expires_at')
                    ->date()
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('status')
                    ->badge()
                    ->searchable()
                    ->sortable(),
                TextColumn::make('rating')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('ratings_count')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('completed_rides')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('current_latitude')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('current_longitude')
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('last_location_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->label('Submitted')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'declined' => 'Declined',
                        'inactive' => 'Inactive',
                        'available' => 'Available',
                        'busy' => 'Busy',
                        'offline' => 'Offline',
                    ]),
                TrashedFilter::make(),
            ])
            ->recordActions([
                Action::make('accept')
                    ->label('Accept')
                    ->color('success')
                    ->icon('heroicon-o-check')
                    ->requiresConfirmation()
                    ->modalHeading('Accept chauffeur')
                    ->modalDescription('This person will be able to sign in as a chauffeur.')
                    ->visible(fn (Chauffeur $record): bool => $record->status === 'pending')
                    ->action(function (Chauffeur $record): void {
                        $record->forceFill(['status' => 'active'])->save();
                        $record->user?->forceFill(['status' => 'active'])->save();

                        Notification::make()
                            ->title('Application accepted')
                            ->success()
                            ->send();
                    }),
                Action::make('decline')
                    ->label('Decline')
                    ->color('danger')
                    ->icon('heroicon-o-x-mark')
                    ->requiresConfirmation()
                    ->modalHeading('Decline chauffeur')
                    ->modalDescription('This application will be closed. They will not be able to sign in.')
                    ->visible(fn (Chauffeur $record): bool => $record->status === 'pending')
                    ->action(function (Chauffeur $record): void {
                        $record->forceFill(['status' => 'declined'])->save();
                        $record->user?->forceFill(['status' => 'declined'])->save();

                        Notification::make()
                            ->title('Application declined')
                            ->success()
                            ->send();
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
