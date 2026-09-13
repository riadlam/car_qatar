<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ExplorePlace extends Model
{
    protected $fillable = [
        'category',
        'slug',
        'title',
        'body',
        'image_path',
        'label',
        'area',
        'formatted_address',
        'latitude',
        'longitude',
        'place_id',
        'provider',
        'show_in_carousel',
        'show_in_scheduler',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'show_in_carousel' => 'boolean',
            'show_in_scheduler' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeForCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Absolute public URL for the card image (storage upload or /images/… path).
     */
    public function imageUrl(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        if (str_starts_with($this->image_path, 'http://') || str_starts_with($this->image_path, 'https://')) {
            return $this->image_path;
        }

        if (str_starts_with($this->image_path, '/')) {
            return url($this->image_path);
        }

        // Stored on the public disk (e.g. explore-places/foo.jpg)
        return Storage::disk('public')->url($this->image_path);
    }

    /**
     * Resolve any stored image_path value to an absolute URL (for Filament previews).
     */
    public static function absoluteImageUrl(?string $path): ?string
    {
        if (! filled($path)) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, '/')) {
            return url($path);
        }

        return Storage::disk('public')->url($path);
    }
}
