<?php

namespace App\Filament\Resources\Chauffeurs\Tables;

use App\Filament\Resources\Chauffeurs\ChauffeurResource;
use App\Models\Chauffeur;
use App\Services\Dispatch\DispatchService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
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
            ->defaultSort('created_at', 'desc')
            ->recordUrl(fn (Chauffeur $record): string => ChauffeurResource::getUrl('view', ['record' => $record]))
            ->columns([
                TextColumn::make('user.name')
                    ->label('Name')
                    ->searchable()
                    ->sortable()
                    ->weight('medium'),
                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),
                TextColumn::make('user.phone')
                    ->label('Phone')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('gender')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'male' => 'Male',
                        'female' => 'Female',
                        default => '—',
                    })
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'active' => 'success',
                        'paused' => 'warning',
                        default => 'gray',
                    })
                    ->searchable()
                    ->sortable(),
                TextColumn::make('license_number')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
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
                        'active' => 'Active',
                        'paused' => 'Paused',
                    ]),
                SelectFilter::make('gender')
                    ->options([
                        'male' => 'Male',
                        'female' => 'Female',
                    ]),
                TrashedFilter::make(),
            ])
            ->recordActions([
                ViewAction::make(),
                Action::make('pause')
                    ->label('Pause')
                    ->color('warning')
                    ->icon('heroicon-o-pause-circle')
                    ->requiresConfirmation()
                    ->modalHeading('Pause chauffeur')
                    ->modalDescription('They stay signed in but cannot receive or accept ride offers. Open offers will be withdrawn.')
                    ->visible(fn (Chauffeur $record): bool => $record->status === 'active')
                    ->action(function (Chauffeur $record): void {
                        $record->forceFill(['status' => 'paused'])->save();
                        app(DispatchService::class)->withdrawChauffeurOffers($record);

                        Notification::make()
                            ->title('Chauffeur paused')
                            ->warning()
                            ->send();
                    }),
                Action::make('resume')
                    ->label('Resume')
                    ->color('success')
                    ->icon('heroicon-o-play-circle')
                    ->requiresConfirmation()
                    ->modalHeading('Resume chauffeur')
                    ->modalDescription('They will receive and accept ride offers again.')
                    ->visible(fn (Chauffeur $record): bool => $record->status === 'paused')
                    ->action(function (Chauffeur $record): void {
                        $record->forceFill(['status' => 'active'])->save();

                        Notification::make()
                            ->title('Chauffeur resumed')
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
