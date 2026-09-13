<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolTerm extends Model
{
    protected $fillable = [
        'value',
        'label',
        'sort_order',
        'status',
    ];
}
