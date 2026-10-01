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
        if ($user->isStaff()) {
            return true;
        }

        if ((int) $booking->user_id === (int) $user->id) {
            return true;
        }

        if ($booking->partner_id && $user->partners()->where('partners.id', $booking->partner_id)->exists()) {
            return true;
        }

        return false;
    }

    public function update(User $user, Booking $booking): bool
    {
        return (int) $booking->user_id === (int) $user->id
            || (int) $booking->booked_by_user_id === (int) $user->id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return (int) $booking->user_id === (int) $user->id
            || (int) $booking->booked_by_user_id === (int) $user->id;
    }
}
