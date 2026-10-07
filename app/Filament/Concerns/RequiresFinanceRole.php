<?php

namespace App\Filament\Concerns;

use Illuminate\Support\Facades\Auth;

trait RequiresFinanceRole
{
    public static function canAccess(): bool
    {
        return Auth::user()?->canManageFinance() ?? false;
    }

    public static function shouldRegisterNavigation(): bool
    {
        return static::canAccess();
    }
}
