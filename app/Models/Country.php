<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    protected $fillable = [
        'name',
        'iso2',
        'iso3',
        'phone_code',
        'default_currency',
        'timezone',
        'status',
    ];

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }

    public function partners(): HasMany
    {
        return $this->hasMany(Partner::class);
    }

    public function gulfDestinations(): HasMany
    {
        return $this->hasMany(GulfDestination::class);
    }
}
