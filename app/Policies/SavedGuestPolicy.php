<?php

namespace App\Policies;

use App\Models\SavedGuest;
use App\Models\User;

class SavedGuestPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, SavedGuest $savedGuest): bool
    {
        return (int) $savedGuest->user_id === (int) $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, SavedGuest $savedGuest): bool
    {
        return (int) $savedGuest->user_id === (int) $user->id;
    }

    public function delete(User $user, SavedGuest $savedGuest): bool
    {
        return (int) $savedGuest->user_id === (int) $user->id;
    }
}
