<?php

namespace App\Http\Controllers\Api\Chauffeur;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreChauffeurLocationRequest;
use App\Http\Resources\ChauffeurRideResource;
use App\Models\CancellationReason;
use App\Models\RideAssignment;
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
        $lat = (float) $data['latitude'];
        $lng = (float) $data['longitude'];

        $assignment = RideAssignment::query()
            ->where('chauffeur_id', $chauffeur->id)
            ->where('booking_id', $data['booking_id'] ?? 0)
            ->whereIn('status', DispatchService::ONGOING)
            ->with('booking.pickupLocation', 'booking.dropoffLocation', 'booking.stops.location')
            ->first();

        if (! $assignment?->booking) {
            return response()->json(['ignored' => true, 'message' => 'No active trip.']);
        }

        $booking = $assignment->booking;
        $pickup = $booking->pickupLocation;
        $dropoff = $this->tracking->dropoffPoint($booking);
        if (! $this->tracking->shouldAcceptFix(
            $chauffeur,
            $lat,
            $lng,
            $pickup?->latitude !== null ? (float) $pickup->latitude : null,
            $pickup?->longitude !== null ? (float) $pickup->longitude : null,
            $dropoff?->latitude !== null ? (float) $dropoff->latitude : null,
            $dropoff?->longitude !== null ? (float) $dropoff->longitude : null,
            $assignment->status,
        )) {
            return response()->json(['ignored' => true, 'message' => 'Unmoved.']);
        }

        $recordedAt = isset($data['recorded_at']) ? now()->parse($data['recorded_at']) : now();
        $before = $assignment->status;

        $chauffeur->forceFill([
            'current_latitude' => $lat,
            'current_longitude' => $lng,
            'last_location_at' => $recordedAt,
        ])->save();

        $this->dispatch->applyLocationProgress($assignment, $chauffeur->fresh(), $lat, $lng);
        $assignment = $assignment->fresh() ?? $assignment;

        if ($assignment->status === $before) {
            $this->dispatch->broadcastPosition($booking->fresh() ?? $booking, isset($data['heading']) ? (float) $data['heading'] : null);
        }

        return response()->json([
            'message' => 'Location saved.',
            'chauffeur' => [
                'id' => $chauffeur->id,
                'latitude' => $lat,
                'longitude' => $lng,
                'last_location_at' => $chauffeur->last_location_at,
            ],
        ]);
    }
}
