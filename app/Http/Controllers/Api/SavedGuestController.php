<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSavedGuestRequest;
use App\Http\Resources\SavedGuestResource;
use App\Models\SavedGuest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedGuestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', SavedGuest::class);

        $guests = SavedGuest::query()
            ->where('user_id', $request->user()->id)
            ->orderBy('first_name')
            ->get();

        return response()->json([
            'data' => SavedGuestResource::collection($guests)->resolve(),
        ]);
    }

    public function store(StoreSavedGuestRequest $request): JsonResponse
    {
        $this->authorize('create', SavedGuest::class);

        $guest = SavedGuest::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'data' => (new SavedGuestResource($guest))->resolve(),
        ], 201);
    }

    public function update(StoreSavedGuestRequest $request, SavedGuest $savedGuest): JsonResponse
    {
        $this->authorize('update', $savedGuest);

        $savedGuest->update($request->validated());

        return response()->json([
            'data' => (new SavedGuestResource($savedGuest->fresh()))->resolve(),
        ]);
    }

    public function destroy(SavedGuest $savedGuest): JsonResponse
    {
        $this->authorize('delete', $savedGuest);

        $savedGuest->delete();

        return response()->json([
            'message' => 'Saved guest deleted.',
        ]);
    }
}
