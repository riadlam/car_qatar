<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PricingRule extends Model
{
    protected $fillable = [
        'service_type_id',
        'vehicle_class_id',
        'city_id',
        'currency',
        'base_price',
        'per_km',
        'per_minute',
        'minimum_price',
        'hourly_price',
        'included_km_per_hour',
        'extra_km_price',
        'extra_minute_price',
        'waiting_price',
        'tax_rate',
        'starts_at',
        'ends_at',
        'priority',
        'status',
    ];

    protected static function booted(): void
    {
        static::saving(function (PricingRule $rule): void {
            // Keep retired columns in sync so leftover data cannot affect anything.
            $rule->minimum_price = $rule->base_price;
            $rule->per_minute = 0;
        });
    }

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'per_km' => 'decimal:2',
            'per_minute' => 'decimal:2',
            'minimum_price' => 'decimal:2',
            'hourly_price' => 'decimal:2',
            'included_km_per_hour' => 'decimal:2',
            'extra_km_price' => 'decimal:2',
            'extra_minute_price' => 'decimal:2',
            'waiting_price' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function vehicleClass(): BelongsTo
    {
        return $this->belongsTo(VehicleClass::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
