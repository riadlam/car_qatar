<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Booking extends Model
{
    protected $fillable = [
        'booking_number',
        'user_id',
        'quote_id',
        'service_type_id',
        'pickup_location_id',
        'dropoff_location_id',
        'pickup_at',
        'timezone',
        'passenger_count',
        'luggage_count',
        'vehicle_class_id',
        'currency',
        'customer_notes',
        'chauffeur_notes',
        'pickup_sign',
        'customer_reference',
        'cost_center_id',
        'seat_addon_id',
        'preferred_language',
        'billing',
        'cancelled_at',
        'completed_at',
    ];

    protected $guarded = [
        'status',
        'payment_status',
        'subtotal',
        'tax_amount',
        'fees',
        'discount',
        'total_amount',
    ];

    protected function casts(): array
    {
        return [
            'pickup_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'completed_at' => 'datetime',
            'subtotal' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'fees' => 'decimal:2',
            'discount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'status' => BookingStatus::class,
            'payment_status' => PaymentStatus::class,
            'billing' => 'array',
        ];
    }

    public static function generateBookingNumber(): string
    {
        do {
            $number = 'BK-'.now()->format('Ymd').'-'.strtoupper(Str::random(4));
        } while (static::query()->where('booking_number', $number)->exists());

        return $number;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
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

    public function seatAddon(): BelongsTo
    {
        return $this->belongsTo(SeatAddon::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(BookingGuest::class);
    }

    public function guest(): HasOne
    {
        return $this->hasOne(BookingGuest::class)->where('is_primary', true);
    }

    public function stops(): HasMany
    {
        return $this->hasMany(BookingStop::class)->orderBy('sequence');
    }

    public function hourlyBooking(): HasOne
    {
        return $this->hasOne(HourlyBooking::class);
    }

    public function priceItems(): HasMany
    {
        return $this->hasMany(BookingPriceItem::class);
    }

    public function cancellations(): HasMany
    {
        return $this->hasMany(BookingCancellation::class);
    }

    public function rideOffers(): HasMany
    {
        return $this->hasMany(RideOffer::class);
    }

    public function rideAssignment(): HasOne
    {
        return $this->hasOne(RideAssignment::class);
    }

    public function rideEvents(): HasMany
    {
        return $this->hasMany(RideEvent::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
