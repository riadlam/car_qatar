<?php

namespace App\Filament\Resources\Payments\Pages;

use App\Enums\PaymentStatus;
use App\Filament\Resources\Payments\PaymentResource;
use App\Models\Payment;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Contracts\Support\Htmlable;

class ViewPayment extends ViewRecord
{
    protected static string $resource = PaymentResource::class;

    public function getHeading(): string | Htmlable
    {
        /** @var Payment $record */
        $record = $this->getRecord();
        $amount = number_format((float) $record->amount, 2);
        $currency = $record->currency ?: 'QAR';

        return "{$currency} {$amount}";
    }

    public function getSubheading(): string | Htmlable | null
    {
        /** @var Payment $record */
        $record = $this->getRecord();
        $status = $record->status instanceof PaymentStatus
            ? $record->status->label()
            : PaymentStatus::tryFrom((string) $record->status)?->label() ?? (string) $record->status;

        $bits = array_filter([
            $status,
            $record->booking?->booking_number,
            $record->method,
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
