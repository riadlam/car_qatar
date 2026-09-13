<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingCancellation extends Model
{
    protected $fillable = [
        'booking_id',
        'cancelled_by',
        'cancellation_policy_id',
        'reason',
        'trip_step',
        'service_type',
        'chauffeur_id',
        'chauffeur_latitude',
        'chauffeur_longitude',
        'distance_to_pickup_m',
        'currency',
        'status',
    ];

    protected $guarded = [
        'fee_amount',
        'refund_amount',
    ];

    protected function casts(): array
    {
        return [
            'fee_amount' => 'decimal:2',
            'refund_amount' => 'decimal:2',
            'chauffeur_latitude' => 'decimal:7',
            'chauffeur_longitude' => 'decimal:7',
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

    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function cancellationPolicy(): BelongsTo
    {
        return $this->belongsTo(CancellationPolicy::class);
    }
}
