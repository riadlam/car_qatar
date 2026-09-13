<?php

namespace App\Filament\Resources\RideOffers\Pages;

use App\Filament\Resources\RideOffers\RideOfferResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewRideOffer extends ViewRecord
{
    protected static string $resource = RideOfferResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
