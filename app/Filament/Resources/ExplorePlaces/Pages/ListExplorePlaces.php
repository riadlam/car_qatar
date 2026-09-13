<?php

namespace App\Filament\Resources\ExplorePlaces\Pages;

use App\Filament\Resources\ExplorePlaces\ExplorePlaceResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListExplorePlaces extends ListRecords
{
    protected static string $resource = ExplorePlaceResource::class;

    protected ?string $heading = 'Explore places';

    protected ?string $subheading = 'Cards and schedule destinations for Hotels, Beaches, Malls, Restaurants, and Iconic places. Attach a Mapbox location so card clicks fill the picker.';

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Add place'),
        ];
    }
}
