<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class RealtimeConfigController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $connection = config('broadcasting.connections.reverb', []);

        return response()->json([
            'key' => $connection['key'] ?? null,
            'host' => $connection['options']['host'] ?? request()->getHost(),
            'port' => (int) ($connection['options']['port'] ?? 8080),
            'scheme' => $connection['options']['scheme'] ?? 'http',
        ]);
    }
}
