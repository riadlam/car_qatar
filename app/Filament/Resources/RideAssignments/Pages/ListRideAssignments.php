<?php

namespace App\Filament\Resources\RideAssignments\Pages;

use App\Filament\Resources\RideAssignments\RideAssignmentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRideAssignments extends ListRecords
{
    protected static string $resource = RideAssignmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
