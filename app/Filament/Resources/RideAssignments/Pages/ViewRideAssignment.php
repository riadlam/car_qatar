<?php

namespace App\Filament\Resources\RideAssignments\Pages;

use App\Filament\Resources\RideAssignments\RideAssignmentResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewRideAssignment extends ViewRecord
{
    protected static string $resource = RideAssignmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
