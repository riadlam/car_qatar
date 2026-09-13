<?php

namespace App\Filament\Resources\GulfDestinations\Pages;

use App\Filament\Resources\GulfDestinations\GulfDestinationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListGulfDestinations extends ListRecords
{
    protected static string $resource = GulfDestinationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
