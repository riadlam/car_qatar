<?php

namespace App\Http\Controllers\Api\Chauffeur;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreChauffeurLocationRequest;
use App\Http\Resources\ChauffeurRideResource;
use App\Models\CancellationReason;
use App\Models\ChauffeurLocation;
use App\Models\RideAssignment;
use App\Models\RideEvent;
use App\Services\Dispatch\DispatchService;
use App\Services\Tracking\TrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RideController extends Controller
{
    public function __construct(
        private readonly TrackingService $tracking,
        private readonly DispatchService $dispatch,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $chauffeur = $request->user()->chauffeur;

        if (! $chauffeur) {
            return response()->json([
                'message' => 'No chauffeur profile found for this account.',
                'data' => [],
            ], 403);
        }

        $assignments = RideAssignment::query()
            ->where('chauffeur_id', $chauffeur->id)
            ->whereIn('status', ['assigned', 'en_route', 'arrived', 'in_progress'])
            ->with([
                'booking.pickupLocation',
                'booking.dropoffLocation',
                'booking.serviceType',
                'booking.guest',
                'booking.user',
                'vehicle',
                'chauffeur',
            ])
            ->orderByDesc('assigned_at')
            ->get();

        return ChauffeurRideResource::collection($assignments)->response();
    }

    public function updateStatus(Request $request, RideAssignment $assignment): JsonResponse
    {
        $chauffeur = $request->user()->chauffeur;
        if (! $chauffeur || (int) $assignment->chauffeur_id !== (int) $chauffeur->id) {
            abort(404);
        }

        $data = $request->validate([
            'status' => ['required', 'string', Rule::in(['en_route', 'arrived', 'in_progress', 'completed'])],
        ]);

        $ride = $this->dispatch->advanceAssignment($assignment, $chauffeur, $data['status']);

        return response()->json([
            'message' => 'Ride updated.',
            'ride' => $ride,
        ]);
    }

    public function cancel(Request $request, RideAssignment $assignment): JsonResponse
    {
        $data = $request->validate([
            'reason_id' => ['nullable', 'integer', 'required_without:note'],
            'note' => ['nullable', 'string', 'min:3', 'max:500', 'required_without:reason_id'],
        ]);

        $ride = $this->dispatch->cancelAssignment(
            $assignment,
            $request->user(),
            CancellationReason::snapshotFor($request->user(), $data['reason_id'] ?? null, $data['note'] ?? null),
        );

        return response()->json([
            'message' => 'Trip cancelled.',
            'ride' => $ride,
        ]);
    }

    public function storeLocation(StoreChauffeurLocationRequest $request): JsonResponse
    {
        $chauffeur = $request->user()->chauffeur;
        $data = $request->validated();
        $recordedAt = isset($data['recorded_at']) ? now()->parse($data['recorded_at']) : now();

        ChauffeurLocation::query()->create([
            'chauffeur_id' => $chauffeur->id,
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'accuracy' => $data['accuracy'] ?? null,
            'heading' => $data['heading'] ?? null,
            'speed' => $data['speed'] ?? null,
            'recorded_at' => $recordedAt,
        ]);

        $chauffeur->forceFill([
            'current_latitude' => $data['latitude'],
            'current_longitude' => $data['longitude'],
            'last_location_at' => $recordedAt,
        ])->save();

        $assignment = null;
        if (! empty($data['booking_id'])) {
            $assignment = RideAssignment::query()
                ->where('chauffeur_id', $chauffeur->id)
                ->where('booking_id', $data['booking_id'])
                ->with('booking.pickupLocation', 'booking.dropoffLocation')
                ->first();
        } else {
            $assignment = RideAssignment::query()
                ->where('chauffeur_id', $chauffeur->id)
                ->whereIn('status', ['en_route', 'arrived', 'in_progress', 'assigned'])
                ->with('booking.pickupLocation', 'booking.dropoffLocation')
                ->orderByDesc('assigned_at')
                ->first();
        }

        if ($assignment?->booking) {
            $this->dispatch->applyLocationProgress($assignment, $chauffeur->fresh(), (float) $data['latitude'], (float) $data['longitude']);
            $assignment = $assignment->fresh() ?? $assignment;

            if (in_array($assignment->status, DispatchService::ONGOING, true)) {
                $this->tracking->refreshAssignmentEta($assignment, $assignment->booking, $chauffeur->fresh());
            }

            RideEvent::query()->create([
                'booking_id' => $assignment->booking_id,
                'ride_assignment_id' => $assignment->id,
                'chauffeur_id' => $chauffeur->id,
                'event_type' => 'location_update',
                'payload' => [
                    'accuracy' => $data['accuracy'] ?? null,
                    'heading' => $data['heading'] ?? null,
                    'speed' => $data['speed'] ?? null,
                ],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'recorded_at' => $recordedAt,
            ]);

            $this->dispatch->broadcastPosition($assignment->booking);
            $this->dispatch->broadcastRideCard($assignment->fresh() ?? $assignment, (int) $chauffeur->id);
        }

        $this->dispatch->syncChauffeur($chauffeur->fresh());

        return response()->json([
            'message' => 'Location saved.',
            'chauffeur' => [
                'id' => $chauffeur->id,
                'latitude' => (float) $chauffeur->current_latitude,
                'longitude' => (float) $chauffeur->current_longitude,
                'last_location_at' => $chauffeur->last_location_at,
            ],
            'eta_minutes' => $assignment?->fresh()?->eta_minutes,
        ]);
    }
}
