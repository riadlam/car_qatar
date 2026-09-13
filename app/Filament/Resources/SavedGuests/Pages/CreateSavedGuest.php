<?php

namespace App\Filament\Resources\SavedGuests\Pages;

use App\Filament\Resources\SavedGuests\SavedGuestResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSavedGuest extends CreateRecord
{
    protected static string $resource = SavedGuestResource::class;
}
