<?php

namespace App\Filament\Resources\Surcharges\Pages;

use App\Filament\Resources\Surcharges\SurchargeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSurcharge extends EditRecord
{
    protected static string $resource = SurchargeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
