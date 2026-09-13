<?php

namespace App\Filament\Resources\SavedGuests\Pages;

use App\Filament\Resources\SavedGuests\SavedGuestResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSavedGuest extends EditRecord
{
    protected static string $resource = SavedGuestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
