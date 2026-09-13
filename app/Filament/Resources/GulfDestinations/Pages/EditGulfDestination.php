<?php

namespace App\Filament\Resources\GulfDestinations\Pages;

use App\Filament\Resources\GulfDestinations\GulfDestinationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditGulfDestination extends EditRecord
{
    protected static string $resource = GulfDestinationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
