<?php

namespace App\Support;

use Illuminate\Support\Facades\Log;
use Throwable;

class Broadcasts
{
    public static function send(object $event): void
    {
        try {
            event($event);
        } catch (Throwable $e) {
            Log::warning('Broadcast failed', [
                'event' => $event::class,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
