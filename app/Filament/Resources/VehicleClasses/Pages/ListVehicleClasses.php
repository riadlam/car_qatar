<?php

namespace App\Filament\Resources\VehicleClasses\Pages;

use App\Filament\Resources\VehicleClasses\VehicleClassResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListVehicleClasses extends ListRecords
{
    protected static string $resource = VehicleClassResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
