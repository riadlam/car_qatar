<?php

namespace App\Enums;

enum QuoteStatus: string
{
    case Draft = 'draft';
    case Priced = 'priced';
    case Expired = 'expired';
    case Converted = 'converted';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Priced => 'Priced',
            self::Expired => 'Expired',
            self::Converted => 'Converted',
            self::Cancelled => 'Cancelled',
        };
    }
}
