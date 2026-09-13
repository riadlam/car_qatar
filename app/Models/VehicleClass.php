<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleClass extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'similar_label',
        'description',
        'passengers',
        'luggage',
        'image_lg',
        'image_sm',
        'sort_order',
        'status',
    ];

    public function media(): HasMany
    {
        return $this->hasMany(VehicleClassMedia::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'vehicle_class_amenity')
            ->withTimestamps();
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function pricingRules(): HasMany
    {
        return $this->hasMany(PricingRule::class);
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
