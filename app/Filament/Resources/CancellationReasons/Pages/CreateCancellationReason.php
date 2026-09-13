<?php

namespace App\Filament\Resources\CancellationReasons\Pages;

use App\Filament\Resources\CancellationReasons\CancellationReasonResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCancellationReason extends CreateRecord
{
    protected static string $resource = CancellationReasonResource::class;
}
