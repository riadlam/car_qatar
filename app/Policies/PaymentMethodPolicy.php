<?php

namespace App\Policies;

use App\Models\PaymentMethod;
use App\Models\User;

class PaymentMethodPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function delete(User $user, PaymentMethod $paymentMethod): bool
    {
        return (int) $paymentMethod->user_id === (int) $user->id;
    }
}
