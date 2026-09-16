<?php

namespace App\Filament\Resources\Quotes\Pages;

use App\Enums\QuoteStatus;
use App\Filament\Resources\Quotes\QuoteResource;
use App\Models\Quote;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Contracts\Support\Htmlable;

class ViewQuote extends ViewRecord
{
    protected static string $resource = QuoteResource::class;

    public function getHeading(): string | Htmlable
    {
        /** @var Quote $record */
        $record = $this->getRecord();

        return $record->quote_number ?: 'Quote';
    }

    public function getSubheading(): string | Htmlable | null
    {
        /** @var Quote $record */
        $record = $this->getRecord();
        $status = $record->status instanceof QuoteStatus
            ? $record->status->label()
            : QuoteStatus::tryFrom((string) $record->status)?->label() ?? (string) $record->status;

        $bits = array_filter([
            $status,
            $record->serviceType?->name,
            $record->pickup_at?->format('M j, Y H:i'),
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
