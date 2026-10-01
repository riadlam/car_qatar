<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Partner extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'legal_name',
        'display_name',
        'email',
        'phone',
        'country_id',
        'city_id',
        'address',
        'tax_number',
        'registration_number',
        'commission_type',
        'commission_value',
        'status',
        'approved_at',
        'approved_by',
    ];

    protected function casts(): array
    {
        return [
            'commission_value' => 'decimal:2',
            'approved_at' => 'datetime',
        ];
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'partner_users')
            ->withPivot(['role', 'status'])
            ->withTimestamps();
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function chauffeurs(): HasMany
    {
        return $this->hasMany(Chauffeur::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function payouts(): HasMany
    {
        return $this->hasMany(PartnerPayout::class);
    }

    public function earnedCommissionTotal(): float
    {
        return (float) $this->bookings()
            ->where('partner_commission_status', 'earned')
            ->sum('partner_commission_amount');
    }

    public function paidOutTotal(): float
    {
        return (float) $this->payouts()
            ->where('status', 'paid')
            ->sum('amount');
    }

    public function unpaidBalance(): float
    {
        return round($this->earnedCommissionTotal() - $this->paidOutTotal(), 2);
    }
}
