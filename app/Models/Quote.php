<?php

namespace App\Models;

use App\Enums\QuoteStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Quote extends Model
{
    protected $fillable = [
        'quote_number',
        'user_id',
        'service_type_id',
        'vehicle_class_id',
        'pickup_location_id',
        'dropoff_location_id',
        'pickup_at',
        'timezone',
        'duration_minutes',
        'passenger_count',
        'student_count',
        'school_term',
        'gulf_destination_id',
        'currency',
        'expires_at',
        'status',
        'metadata',
    ];

    protected $guarded = [
        'subtotal',
        'tax_amount',
        'fees',
        'discount',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'pickup_at' => 'datetime',
            'expires_at' => 'datetime',
            'subtotal' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'fees' => 'decimal:2',
            'discount' => 'decimal:2',
            'total' => 'decimal:2',
            'status' => QuoteStatus::class,
            'metadata' => 'array',
        ];
    }

    public static function generateQuoteNumber(): string
    {
        do {
            $number = 'QT-'.now()->format('Ymd').'-'.strtoupper(Str::random(4));
        } while (static::query()->where('quote_number', $number)->exists());

        return $number;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    public function vehicleClass(): BelongsTo
    {
        return $this->belongsTo(VehicleClass::class);
    }

    public function pickupLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'pickup_location_id');
    }

    public function dropoffLocation(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'dropoff_location_id');
    }

    public function gulfDestination(): BelongsTo
    {
        return $this->belongsTo(GulfDestination::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class);
    }

    public function stops(): HasMany
    {
        return $this->hasMany(QuoteStop::class)->orderBy('sequence');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
