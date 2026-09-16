<?php

namespace App\Filament\Resources\RideAssignments\Pages;

use App\Filament\Resources\RideAssignments\RideAssignmentResource;
use App\Models\RideAssignment;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Contracts\Support\Htmlable;

class ViewRideAssignment extends ViewRecord
{
    protected static string $resource = RideAssignmentResource::class;

    public function getHeading(): string | Htmlable
    {
        /** @var RideAssignment $record */
        $record = $this->getRecord();
        $booking = $record->booking?->booking_number;

        return $booking ? "Assignment · {$booking}" : 'Ride assignment #'.$record->getKey();
    }

    public function getSubheading(): string | Htmlable | null
    {
        /** @var RideAssignment $record */
        $record = $this->getRecord();
        $bits = array_filter([
            $record->status ? ucfirst(str_replace('_', ' ', (string) $record->status)) : null,
            $record->chauffeur?->user?->name,
            $record->vehicle?->license_plate,
        ]);

        return $bits !== [] ? implode(' · ', $bits) : null;
    }

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
