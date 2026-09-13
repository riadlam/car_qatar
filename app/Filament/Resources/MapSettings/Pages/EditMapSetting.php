<?php

namespace App\Filament\Resources\MapSettings\Pages;

use App\Filament\Resources\MapSettings\MapSettingResource;
use App\Models\MapSetting;
use Filament\Resources\Pages\EditRecord;

class EditMapSetting extends EditRecord
{
    protected static string $resource = MapSettingResource::class;

    protected static ?string $title = 'Map settings';

    public function mount(int|string $record = null): void
    {
        $settings = MapSetting::current();
        parent::mount($settings->getKey());
    }

    protected function getHeaderActions(): array
    {
        return [];
    }

    protected function getRedirectUrl(): ?string
    {
        return MapSettingResource::getUrl('index');
    }
}
