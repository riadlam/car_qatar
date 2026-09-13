<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpsertBillingProfileRequest;
use App\Http\Resources\BillingProfileResource;
use App\Models\BillingProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillingProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $profile = BillingProfile::query()
            ->where('user_id', $request->user()->id)
            ->first();

        return response()->json([
            'data' => $profile ? (new BillingProfileResource($profile))->resolve() : null,
        ]);
    }

    public function upsert(UpsertBillingProfileRequest $request): JsonResponse
    {
        $profile = BillingProfile::query()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->validated(),
        );

        return response()->json([
            'data' => (new BillingProfileResource($profile))->resolve(),
        ]);
    }
}
