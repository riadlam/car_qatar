<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceCountOption extends Model
{
    protected $fillable = [
        'service_type_id',
        'kind',
        'value',
        'label',
        'sort_order',
        'status',
    ];

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }
}
