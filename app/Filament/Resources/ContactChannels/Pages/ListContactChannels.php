<?php

namespace App\Filament\Resources\ContactChannels\Pages;

use App\Filament\Resources\ContactChannels\ContactChannelResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListContactChannels extends ListRecords
{
    protected static string $resource = ContactChannelResource::class;

    protected ?string $heading = 'Contact us';

    protected ?string $subheading = 'Items in the Contact us menu on the site header. Change labels, phone, WhatsApp, email, or links here.';

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Add contact item'),
        ];
    }
}
