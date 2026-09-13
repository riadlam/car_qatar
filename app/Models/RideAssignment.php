<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RideAssignment extends Model
{
    protected $fillable = [
        'booking_id',
        'chauffeur_id',
        'vehicle_id',
        'ride_offer_id',
        'status',
        'assigned_at',
        'started_at',
        'completed_at',
        'eta_minutes',
        'eta_at',
    ];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'eta_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Chauffeur::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function rideOffer(): BelongsTo
    {
        return $this->belongsTo(RideOffer::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(RideEvent::class);
    }
}
