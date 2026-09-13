<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactChannel extends Model
{
    protected $fillable = [
        'key',
        'label',
        'href',
        'type',
        'sort_order',
        'status',
    ];
}
