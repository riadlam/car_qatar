<?php

namespace App\Filament\Resources\Chauffeurs\Pages;

use App\Filament\Resources\Chauffeurs\ChauffeurResource;
use App\Models\Chauffeur;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Contracts\Support\Htmlable;

class EditChauffeur extends EditRecord
{
    protected static string $resource = ChauffeurResource::class;

    public function getHeading(): string|Htmlable
    {
        /** @var Chauffeur $record */
        $record = $this->getRecord();

        return 'Edit · '.($record->user?->name ?: 'Chauffeur #'.$record->getKey());
    }

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
