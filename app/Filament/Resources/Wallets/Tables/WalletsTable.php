<?php

namespace App\Filament\Resources\Wallets\Tables;

use App\Filament\Resources\Wallets\WalletResource;
use App\Enums\UserRole;
use App\Models\User;
use App\Models\Wallet;
use App\Services\Wallet\WalletService;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class WalletsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->striped()
            ->defaultSort('updated_at', 'desc')
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('user.role')
                    ->label('Role')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state instanceof UserRole
                        ? $state->label()
                        : (string) $state),
                TextColumn::make('balance')
                    ->money(fn (Wallet $record): string => $record->currency ?: 'QAR')
                    ->sortable(),
                TextColumn::make('currency'),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'frozen' => 'Frozen',
                    ]),
            ])
            ->headerActions([
                Action::make('creditUser')
                    ->label('Add funds')
                    ->icon('heroicon-o-plus-circle')
                    ->form([
                        Select::make('user_id')
                            ->label('Customer or partner')
                            ->options(
                                fn () => User::query()
                                    ->whereIn('role', [UserRole::Customer->value, UserRole::PartnerAdmin->value])
                                    ->orderBy('name')
                                    ->get()
                                    ->mapWithKeys(fn (User $u) => [
                                        $u->id => trim($u->name.' · '.$u->email.' ('.($u->role?->label() ?? $u->role).')'),
                                    ])
                                    ->all()
                            )
                            ->searchable()
                            ->required(),
                        TextInput::make('amount')
                            ->numeric()
                            ->required()
                            ->minValue(0.01)
                            ->step(0.01),
                        Textarea::make('note')
                            ->rows(2)
                            ->required()
                            ->helperText('Required for audit trail.'),
                    ])
                    ->action(function (array $data): void {
                        $user = User::query()->findOrFail($data['user_id']);
                        app(WalletService::class)->credit(
                            $user,
                            (float) $data['amount'],
                            auth()->user(),
                            (string) $data['note'],
                        );
                        Notification::make()
                            ->title('Wallet credited')
                            ->success()
                            ->send();
                    }),
            ])
            ->recordActions([
                Action::make('view')
                    ->url(fn (Wallet $record): string => WalletResource::getUrl('view', ['record' => $record])),
                Action::make('credit')
                    ->label('Add funds')
                    ->form([
                        TextInput::make('amount')
                            ->numeric()
                            ->required()
                            ->minValue(0.01)
                            ->step(0.01),
                        Textarea::make('note')
                            ->rows(2)
                            ->required(),
                    ])
                    ->action(function (Wallet $record, array $data): void {
                        app(WalletService::class)->credit(
                            $record->user,
                            (float) $data['amount'],
                            auth()->user(),
                            (string) $data['note'],
                        );
                        Notification::make()
                            ->title('Wallet credited')
                            ->success()
                            ->send();
                    }),
            ]);
    }
}
