<?php

use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chauffeur.{id}', function (User $user, string $id) {
    $chauffeur = $user->chauffeur;

    return $user->role === UserRole::Chauffeur
        && $chauffeur !== null
        && $chauffeur->status === 'active'
        && (int) $chauffeur->id === (int) $id;
});

Broadcast::channel('booking.{id}', function (User $user, string $id) {
    return Booking::query()
        ->whereKey($id)
        ->where('user_id', $user->id)
        ->exists();
});
