<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CancellationPolicy extends Model
{
    protected $fillable = [
        'name',
        'service_type_id',
        'free_cancel_hours',
        'fee_type',
        'fee_value',
        'currency',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'fee_value' => 'decimal:2',
        ];
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function bookingCancellations(): HasMany
    {
        return $this->hasMany(BookingCancellation::class);
    }
}
