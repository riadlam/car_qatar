<?php

namespace App\Policies;

use App\Models\Quote;
use App\Models\User;

class QuotePolicy
{
    public function view(User $user, Quote $quote): bool
    {
        if ($user->isStaff()) {
            return true;
        }

        return $quote->user_id !== null
            && (int) $quote->user_id === (int) $user->id;
    }
}
