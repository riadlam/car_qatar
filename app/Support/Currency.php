<?php

namespace App\Support;

final class Currency
{
    public const CODE = 'QAR';

    public static function code(?string $currency = null): string
    {
        $raw = strtoupper(trim((string) $currency));

        if ($raw === '' || $raw === 'USD' || $raw === 'US$' || $raw === '$') {
            return self::CODE;
        }

        return $raw;
    }
}
