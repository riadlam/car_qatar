<?php

namespace App\Filament\Resources\Chauffeurs\Pages;

use App\Filament\Resources\Chauffeurs\ChauffeurResource;
use App\Models\Chauffeur;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Contracts\Support\Htmlable;

class ViewChauffeur extends ViewRecord
{
    protected static string $resource = ChauffeurResource::class;

    public function getHeading(): string|Htmlable
    {
        /** @var Chauffeur $record */
        $record = $this->getRecord();

        return $record->user?->name ?: 'Chauffeur #'.$record->getKey();
    }

    public function getSubheading(): string|Htmlable|null
    {
        /** @var Chauffeur $record */
        $record = $this->getRecord();

        $bits = array_filter([
            $record->status ? ucfirst(str_replace('_', ' ', (string) $record->status)) : null,
            $record->completed_rides !== null ? $record->completed_rides.' completed rides' : null,
            $record->rating !== null ? 'Rating '.$record->rating : null,
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
