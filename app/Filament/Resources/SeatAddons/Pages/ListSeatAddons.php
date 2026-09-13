<?php

namespace App\Filament\Resources\SeatAddons\Pages;

use App\Filament\Resources\SeatAddons\SeatAddonResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSeatAddons extends ListRecords
{
    protected static string $resource = SeatAddonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
