<?php

namespace App\Filament\Resources\ServiceTypes\Pages;

use App\Filament\Resources\ServiceTypes\ServiceTypeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListServiceTypes extends ListRecords
{
    protected static string $resource = ServiceTypeResource::class;

    protected ?string $heading = 'Booking services';

    protected ?string $subheading = 'These tabs power the homepage hero. Open a service to add or remove duration and passenger/student dropdown items. Gulf destinations and school terms are under Catalog.';

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Add service'),
        ];
    }
}
