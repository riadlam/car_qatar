<?php

namespace App\Filament\Resources\RideOffers\Pages;

use App\Filament\Resources\RideOffers\RideOfferResource;
use App\Models\RideOffer;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Contracts\Support\Htmlable;

class ViewRideOffer extends ViewRecord
{
    protected static string $resource = RideOfferResource::class;

    public function getHeading(): string | Htmlable
    {
        /** @var RideOffer $record */
        $record = $this->getRecord();
        $booking = $record->booking?->booking_number;

        return $booking ? "Offer · {$booking}" : 'Ride offer #'.$record->getKey();
    }

    public function getSubheading(): string | Htmlable | null
    {
        /** @var RideOffer $record */
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
