<?php

namespace App\Filament\Resources\SeatAddons\Pages;

use App\Filament\Resources\SeatAddons\SeatAddonResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSeatAddon extends EditRecord
{
    protected static string $resource = SeatAddonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
