<?php

namespace App\Filament\Resources\PartnerPayouts\Pages;

use App\Filament\Resources\PartnerPayouts\PartnerPayoutResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePartnerPayout extends CreateRecord
{
    protected static string $resource = PartnerPayoutResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['created_by'] = auth()->id();
        if (($data['status'] ?? '') === 'paid' && empty($data['paid_at'])) {
            $data['paid_at'] = now();
        }

        return $data;
    }
}
