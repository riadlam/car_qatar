<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceDurationOption extends Model
{
    protected $fillable = [
        'service_type_id',
        'value',
        'label',
        'duration_minutes',
        'sort_order',
        'status',
    ];

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }
}
