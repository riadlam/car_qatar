<?php

namespace App\Filament\Resources\RideOffers\Pages;

use App\Filament\Resources\RideOffers\RideOfferResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditRideOffer extends EditRecord
{
    protected static string $resource = RideOfferResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
