<?php

namespace App\Filament\Resources\RideAssignments\Pages;

use App\Filament\Resources\RideAssignments\RideAssignmentResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditRideAssignment extends EditRecord
{
    protected static string $resource = RideAssignmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
