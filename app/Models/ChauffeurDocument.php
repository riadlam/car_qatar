<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChauffeurDocument extends Model
{
    protected $fillable = [
        'chauffeur_id',
        'type',
        'number',
        'file_path',
        'issue_date',
        'expiration_date',
        'verification_status',
        'verified_at',
        'verified_by',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'expiration_date' => 'date',
            'verified_at' => 'datetime',
        ];
    }

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Chauffeur::class);
    }
}
