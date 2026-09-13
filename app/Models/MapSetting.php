<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MapSetting extends Model
{
    protected $fillable = [
        'style_uri',
        'basemap_theme',
        'default_latitude',
        'default_longitude',
        'default_zoom',
        'country_codes',
        'language',
        'directions_profile',
        'show_traffic',
        'marker_color',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'default_latitude' => 'decimal:7',
            'default_longitude' => 'decimal:7',
            'show_traffic' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'style_uri' => 'mapbox://styles/mapbox/standard',
                'basemap_theme' => 'faded',
                'default_latitude' => 25.2854,
                'default_longitude' => 51.531,
                'default_zoom' => 11,
                'country_codes' => 'qa,ae,sa,om,kw,bh',
                'language' => 'en',
                'directions_profile' => 'mapbox/driving-traffic',
                'show_traffic' => true,
                'marker_color' => '#5b0520',
                'status' => 'active',
            ],
        );
    }

    /**
     * @return list<string>
     */
    public function countryCodeList(): array
    {
        return array_values(array_filter(array_map(
            static fn (string $code): string => strtolower(trim($code)),
            explode(',', (string) $this->country_codes),
        )));
    }
}
