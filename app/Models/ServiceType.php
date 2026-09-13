<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'mode',
        'requires_dropoff',
        'allows_multi_stops',
        'max_stops',
        'is_hourly',
        'requires_flight',
        'requires_gulf_destination',
        'requires_school_term',
        'requires_passengers',
        'requires_students',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'requires_dropoff' => 'boolean',
            'allows_multi_stops' => 'boolean',
            'is_hourly' => 'boolean',
            'requires_flight' => 'boolean',
            'requires_gulf_destination' => 'boolean',
            'requires_school_term' => 'boolean',
            'requires_passengers' => 'boolean',
            'requires_students' => 'boolean',
        ];
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

    public function cancellationPolicies(): HasMany
    {
        return $this->hasMany(CancellationPolicy::class);
    }

    public function surcharges(): HasMany
    {
        return $this->hasMany(Surcharge::class);
    }

    public function durationOptions(): HasMany
    {
        return $this->hasMany(ServiceDurationOption::class)->orderBy('sort_order');
    }

    public function countOptions(): HasMany
    {
        return $this->hasMany(ServiceCountOption::class)->orderBy('sort_order');
    }
}
