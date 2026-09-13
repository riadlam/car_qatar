<?php

namespace App\Filament\Resources\DispatchSettings\Pages;

use App\Enums\BookingStatus;
use App\Filament\Resources\DispatchSettings\DispatchSettingResource;
use App\Models\Booking;
use App\Models\DispatchSetting;
use App\Services\Dispatch\DispatchService;
use Filament\Resources\Pages\EditRecord;

class EditDispatchSetting extends EditRecord
{
    protected static string $resource = DispatchSettingResource::class;

    protected static ?string $title = 'Dispatch settings';

    public function mount(int|string $record = null): void
    {
        $settings = DispatchSetting::current();
        parent::mount($settings->getKey());
    }

    protected function getHeaderActions(): array
    {
        return [];
    }

    protected function getRedirectUrl(): ?string
    {
        return DispatchSettingResource::getUrl('index');
    }

    protected function afterSave(): void
    {
        Booking::query()
            ->where('status', BookingStatus::Confirmed)
            ->whereDoesntHave('rideAssignment')
            ->get()
            ->each(fn (Booking $booking) => app(DispatchService::class)->syncBooking($booking));
    }
}
