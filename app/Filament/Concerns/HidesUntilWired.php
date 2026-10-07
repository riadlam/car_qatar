<?php

namespace App\Filament\Concerns;

/**
 * Fully disables a Filament resource until business logic uses it.
 */
trait HidesUntilWired
{
    public static function canAccess(): bool
    {
        return false;
    }

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }
}
