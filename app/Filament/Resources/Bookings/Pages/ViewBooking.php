<?php

namespace App\Filament\Resources\Bookings\Pages;

use App\Enums\BookingStatus;
use App\Filament\Resources\Bookings\BookingResource;
use App\Models\Booking;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Contracts\Support\Htmlable;

class ViewBooking extends ViewRecord
{
    protected static string $resource = BookingResource::class;

    public function getHeading(): string | Htmlable
    {
        /** @var Booking $record */
        $record = $this->getRecord();

        return $record->booking_number ?: 'Booking';
    }

    public function getSubheading(): string | Htmlable | null
    {
        /** @var Booking $record */
        $record = $this->getRecord();
        $status = $record->status instanceof BookingStatus
            ? $record->status->label()
            : BookingStatus::tryFrom((string) $record->status)?->label() ?? (string) $record->status;

        $bits = array_filter([
            $status,
            $record->serviceType?->name,
            $record->pickup_at?->timezone($record->timezone ?: config('app.timezone'))->format('M j, Y H:i'),
        ]);

        return $bits !== [] ? implode(' · ', $bits) : null;
    }

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
