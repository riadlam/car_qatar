<?php

namespace App\Filament\Resources\Partners\Pages;

use App\Filament\Pages\CreatePartnerAccount;
use App\Filament\Resources\Partners\PartnerResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;

class ListPartners extends ListRecords
{
    protected static string $resource = PartnerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('createPartnerAccount')
                ->label('Create Partner')
                ->icon(Heroicon::OutlinedBuildingOffice2)
                ->url(CreatePartnerAccount::getUrl())
                ->visible(fn (): bool => auth()->user()?->canManagePartners() ?? false),
        ];
    }
}
