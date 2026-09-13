<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Booking $booking): bool
    {
        return $user->isStaff() || (int) $booking->user_id === (int) $user->id;
    }

    public function update(User $user, Booking $booking): bool
    {
        return (int) $booking->user_id === (int) $user->id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return (int) $booking->user_id === (int) $user->id;
    }
}
