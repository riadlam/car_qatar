<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DispatchSetting extends Model
{
    protected $fillable = [
        'offer_radius_km',
        'radius_matching_enabled',
    ];

    protected function casts(): array
    {
        return [
            'offer_radius_km' => 'integer',
            'radius_matching_enabled' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'offer_radius_km' => 15,
                'radius_matching_enabled' => true,
            ],
        );
    }

    public function radiusKm(): int
    {
        return max(1, min(100, (int) $this->offer_radius_km));
    }
}
