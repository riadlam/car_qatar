<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingProfile extends Model
{
    protected $fillable = [
        'user_id',
        'company',
        'street',
        'zip',
        'city',
        'country',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Snapshot stored on the booking so later edits do not rewrite this ride.
     *
     * @return array{company: ?string, street: string, zip: string, city: string, country: string}
     */
    public function snapshot(): array
    {
        return [
            'company' => $this->company,
            'street' => $this->street,
            'zip' => $this->zip,
            'city' => $this->city,
            'country' => $this->country,
        ];
    }
}
