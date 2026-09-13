<?php

namespace App\Filament\Resources\SavedGuests\Pages;

use App\Filament\Resources\SavedGuests\SavedGuestResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSavedGuests extends ListRecords
{
    protected static string $resource = SavedGuestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
