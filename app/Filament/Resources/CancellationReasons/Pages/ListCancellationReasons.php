<?php

namespace App\Filament\Resources\CancellationReasons\Pages;

use App\Filament\Resources\CancellationReasons\CancellationReasonResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCancellationReasons extends ListRecords
{
    protected static string $resource = CancellationReasonResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
