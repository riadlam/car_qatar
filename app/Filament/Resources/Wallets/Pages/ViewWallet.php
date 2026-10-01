<?php

namespace App\Filament\Resources\Wallets\Pages;

use App\Filament\Resources\Wallets\WalletResource;
use App\Models\Wallet;
use App\Services\Wallet\WalletService;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewWallet extends ViewRecord
{
    protected static string $resource = WalletResource::class;

    protected function getHeaderActions(): array
    {
        return [
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
                ->action(function (array $data): void {
                    /** @var Wallet $wallet */
                    $wallet = $this->getRecord();
                    app(WalletService::class)->credit(
                        $wallet->user,
                        (float) $data['amount'],
                        auth()->user(),
                        (string) $data['note'],
                    );
                    Notification::make()->title('Wallet credited')->success()->send();
                    $this->refreshFormData(['balance', 'updated_at']);
                }),
            Action::make('freeze')
                ->label(fn (): string => $this->getRecord()->status === 'frozen' ? 'Unfreeze' : 'Freeze')
                ->color('warning')
                ->requiresConfirmation()
                ->action(function (): void {
                    /** @var Wallet $wallet */
                    $wallet = $this->getRecord();
                    $wallet->forceFill([
                        'status' => $wallet->status === 'frozen' ? 'active' : 'frozen',
                    ])->save();
                    Notification::make()->title('Wallet status updated')->success()->send();
                }),
        ];
    }
}
