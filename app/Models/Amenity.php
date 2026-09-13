<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Amenity extends Model
{
    protected $fillable = [
        'slug',
        'label',
        'icon',
        'sort_order',
        'status',
    ];

    public function vehicleClasses(): BelongsToMany
    {
        return $this->belongsToMany(VehicleClass::class, 'vehicle_class_amenity')
            ->withTimestamps();
    }
}
