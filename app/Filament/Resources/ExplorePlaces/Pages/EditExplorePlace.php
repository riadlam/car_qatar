<?php

namespace App\Filament\Resources\ExplorePlaces\Pages;

use App\Filament\Resources\ExplorePlaces\ExplorePlaceResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditExplorePlace extends EditRecord
{
    protected static string $resource = ExplorePlaceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
