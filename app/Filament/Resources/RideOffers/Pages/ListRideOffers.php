<?php

namespace App\Filament\Resources\RideOffers\Pages;

use App\Filament\Resources\RideOffers\RideOfferResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRideOffers extends ListRecords
{
    protected static string $resource = RideOfferResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
