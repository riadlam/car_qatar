<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chauffeur extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'partner_id',
        'license_number',
        'license_country',
        'license_expires_at',
        'rating',
        'ratings_count',
        'completed_rides',
        'current_latitude',
        'current_longitude',
        'last_location_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'license_expires_at' => 'date',
            'rating' => 'decimal:2',
            'current_latitude' => 'decimal:7',
            'current_longitude' => 'decimal:7',
            'last_location_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function rideOffers(): HasMany
    {
        return $this->hasMany(RideOffer::class);
    }

    public function rideAssignments(): HasMany
    {
        return $this->hasMany(RideAssignment::class);
    }

    public function rideEvents(): HasMany
    {
        return $this->hasMany(RideEvent::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(ChauffeurLocation::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ChauffeurDocument::class);
    }

    public function vehicleAssignments(): HasMany
    {
        return $this->hasMany(ChauffeurVehicleAssignment::class);
    }
}
