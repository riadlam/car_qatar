<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CancellationReason;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CancellationReasonController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $audience = CancellationReason::audienceFor($request->user());

        if ($audience === 'chauffeur' && $request->user()->chauffeur?->status !== 'active') {
            abort(403);
        }

        if (! $audience) {
            abort(403);
        }

        $reasons = CancellationReason::query()
            ->where('audience', $audience)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'label']);

        return response()->json([
            'data' => $reasons,
        ]);
    }
}
