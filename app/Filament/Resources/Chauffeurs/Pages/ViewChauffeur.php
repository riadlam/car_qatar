<?php

namespace App\Filament\Resources\Chauffeurs\Pages;

use App\Filament\Resources\Chauffeurs\ChauffeurResource;
use App\Models\Chauffeur;
use App\Services\Dispatch\DispatchService;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Contracts\Support\Htmlable;

class ViewChauffeur extends ViewRecord
{
    protected static string $resource = ChauffeurResource::class;

    public function getHeading(): string|Htmlable
    {
        /** @var Chauffeur $record */
        $record = $this->getRecord();

        return $record->user?->name ?: 'Chauffeur #'.$record->getKey();
    }

    public function getSubheading(): string|Htmlable|null
    {
        /** @var Chauffeur $record */
        $record = $this->getRecord();

        $bits = array_filter([
            $record->status ? ucfirst(str_replace('_', ' ', (string) $record->status)) : null,
        ]);

        return $bits !== [] ? implode(' · ', $bits) : null;
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('pause')
                ->label('Pause')
                ->color('warning')
                ->icon('heroicon-o-pause-circle')
                ->requiresConfirmation()
                ->modalHeading('Pause chauffeur')
                ->modalDescription('They stay signed in but cannot receive or accept ride offers. Open offers will be withdrawn.')
                ->visible(fn (): bool => $this->getRecord()->status === 'active')
                ->action(function (): void {
                    /** @var Chauffeur $record */
                    $record = $this->getRecord();
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
                ->visible(fn (): bool => $this->getRecord()->status === 'paused')
                ->action(function (): void {
                    /** @var Chauffeur $record */
                    $record = $this->getRecord();
                    $record->forceFill(['status' => 'active'])->save();

                    Notification::make()
                        ->title('Chauffeur resumed')
                        ->success()
                        ->send();
                }),
            EditAction::make(),
        ];
    }
}
