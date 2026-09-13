<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MapSettingResource;
use App\Models\MapSetting;
use Illuminate\Http\JsonResponse;

class MapConfigController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $settings = MapSetting::current();

        return response()->json([
            'data' => (new MapSettingResource($settings))->resolve(),
        ]);
    }
}
