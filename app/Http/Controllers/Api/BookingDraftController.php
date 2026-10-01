<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingDraft;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class BookingDraftController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'payload' => ['required', 'array'],
            'return_path' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user() ?? Auth::guard('sanctum')->user();

        $draft = BookingDraft::query()->create([
            'user_id' => $user?->id,
            'payload' => $data['payload'],
            'return_path' => $data['return_path'] ?? '/booking/checkout',
            'expires_at' => Carbon::now()->addHours(48),
        ]);

        return response()->json([
            'id' => $draft->id,
            'return_path' => $draft->return_path,
            'expires_at' => $draft->expires_at?->toIso8601String(),
        ], 201);
    }

    public function show(Request $request, string $bookingDraft): JsonResponse
    {
        $draft = BookingDraft::query()->findOrFail($bookingDraft);

        if ($draft->isExpired()) {
            abort(410, 'This booking draft has expired.');
        }

        $user = $request->user() ?? Auth::guard('sanctum')->user();

        if ($draft->user_id !== null) {
            if (! $user || (int) $user->id !== (int) $draft->user_id) {
                abort(403, 'This booking draft belongs to another account.');
            }
        }

        return response()->json([
            'id' => $draft->id,
            'user_id' => $draft->user_id,
            'payload' => $draft->payload,
            'return_path' => $draft->return_path,
            'expires_at' => $draft->expires_at?->toIso8601String(),
        ]);
    }

    public function claim(Request $request, string $bookingDraft): JsonResponse
    {
        $draft = BookingDraft::query()->findOrFail($bookingDraft);

        if ($draft->isExpired()) {
            abort(410, 'This booking draft has expired.');
        }

        $user = $request->user();

        if ($draft->user_id !== null && (int) $draft->user_id !== (int) $user->id) {
            abort(403, 'This booking draft belongs to another account.');
        }

        if ($draft->user_id === null) {
            $draft->forceFill(['user_id' => $user->id])->save();
        }

        return response()->json([
            'id' => $draft->id,
            'user_id' => $draft->user_id,
            'payload' => $draft->payload,
            'return_path' => $draft->return_path,
            'expires_at' => $draft->expires_at?->toIso8601String(),
        ]);
    }
}
