<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleClassMedia extends Model
{
    protected $table = 'vehicle_class_media';

    protected $fillable = [
        'vehicle_class_id',
        'kind',
        'key',
        'label',
        'image_lg',
        'image_sm',
        'sort_order',
    ];

    public function vehicleClass(): BelongsTo
    {
        return $this->belongsTo(VehicleClass::class);
    }
}
