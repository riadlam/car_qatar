<?php

namespace App\Http\Controllers\Api\Chauffeur;

use App\Http\Controllers\Controller;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingCancellation;
use App\Models\Chauffeur;
use App\Models\RideAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $chauffeur = $request->user()->chauffeur;
        $chauffeur->load([
            'user',
            'documents',
            'vehicleAssignments' => fn ($query) => $query
                ->where(function ($query) {
                    $query->whereNull('ends_at')->orWhere('ends_at', '>=', now());
                })
                ->with('vehicle.vehicleClass')
                ->orderByDesc('is_primary')
                ->orderByDesc('starts_at'),
        ]);

        $assignments = RideAssignment::query()
            ->where('chauffeur_id', $chauffeur->id)
            ->with([
                'booking.pickupLocation',
                'booking.dropoffLocation',
                'booking.vehicleClass',
                'booking.serviceType',
                'booking.guest',
                'booking.user',
                'booking.cancellations.cancelledBy',
            ])
            ->orderByDesc('assigned_at')
            ->get();

        $rides = $assignments
            ->map(fn (RideAssignment $assignment) => $this->ridePayload($assignment))
            ->filter()
            ->values();

        $weekStart = now()->startOfWeek();
        $earnings = $assignments
            ->filter(function (RideAssignment $assignment) use ($weekStart) {
                $when = $assignment->completed_at ?? $assignment->assigned_at;

                return $assignment->status === 'completed'
                    && $when
                    && $when->gte($weekStart);
            })
            ->sum(fn (RideAssignment $assignment) => (float) ($assignment->booking?->total_amount ?? 0));

        $currency = $assignments->first()?->booking?->currency ?: 'USD';

        return response()->json([
            'profile' => $this->profilePayload($chauffeur, $rides, (float) $earnings, $currency),
        ]);
    }

    /**
     * @param  \Illuminate\Support\Collection<int, array<string, mixed>>  $rides
     * @return array<string, mixed>
     */
    private function profilePayload(Chauffeur $chauffeur, $rides, float $earnings, string $currency): array
    {
        $user = $chauffeur->user;
        $name = $user?->name
            ?: trim(collect([$user?->first_name, $user?->last_name])->filter()->implode(' '));
        $assignment = $chauffeur->vehicleAssignments->first();
        $vehicle = $assignment?->vehicle;

        return [
            'name' => $name !== '' ? $name : 'Chauffeur',
            'email' => $user?->email ?: '',
            'phone' => $user?->phone ?: '',
            'address' => $user?->street_address ?: '',
            'rating' => $chauffeur->rating !== null ? (float) $chauffeur->rating : 0,
            'trips' => (int) $chauffeur->completed_rides,
            'member_since' => $chauffeur->created_at?->format('M Y') ?: '',
            'status' => $chauffeur->status,
            'status_label' => ucfirst((string) $chauffeur->status),
            'currency' => $currency,
            'earnings_week' => round($earnings, 2),
            'vehicle' => $vehicle ? [
                'model' => trim(collect([$vehicle->manufacturer, $vehicle->model])->filter()->implode(' ')) ?: 'Vehicle',
                'class' => $vehicle->vehicleClass?->name ?: '',
                'color' => $vehicle->color ?: '',
                'year' => $vehicle->year,
                'plate' => $vehicle->license_plate,
            ] : null,
            'documents' => $chauffeur->documents->map(fn ($doc) => [
                'id' => $doc->id,
                'label' => str_replace('_', ' ', ucfirst((string) $doc->type)),
                'number' => $doc->number,
                'status' => str_replace('_', ' ', ucfirst((string) $doc->verification_status)),
                'expires_at' => $doc->expiration_date?->toDateString(),
            ])->values(),
            'rides' => $rides,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function ridePayload(RideAssignment $assignment): ?array
    {
        $booking = $assignment->booking;
        if (! $booking) {
            return null;
        }

        $pickupAt = $booking->pickup_at?->copy()->timezone($booking->timezone ?: config('app.timezone'));
        $guest = $booking->guest;
        $owner = $booking->user;
        $passenger = $guest
            ? trim(collect([$guest->title, $guest->first_name, $guest->last_name])->filter()->implode(' '))
            : trim(collect([$owner?->first_name, $owner?->last_name])->filter()->implode(' '));
        if ($passenger === '') {
            $passenger = 'Passenger';
        }
        $canceled = in_array($assignment->status, ['cancelled', 'canceled'], true)
            || in_array($booking->status?->value ?? $booking->status, ['cancelled', 'canceled'], true);
        $completed = $assignment->status === 'completed'
            || in_array($booking->status?->value ?? $booking->status, ['completed'], true);

        return [
            'id' => $assignment->id,
            'booking_id' => $booking->id,
            'booking_number' => $booking->booking_number,
            'pickup' => $booking->pickupLocation?->formatted_address
                ?: $booking->pickupLocation?->name
                ?: '—',
            'dropoff' => $booking->dropoffLocation?->formatted_address
                ?: $booking->dropoffLocation?->name
                ?: '',
            'date' => $pickupAt?->toDateString() ?: '',
            'date_label' => $pickupAt?->format('D, j M Y') ?: '',
            'time_label' => $pickupAt?->format('g:i a') ?: '',
            'mode' => $booking->serviceType?->mode ?: 'transfer',
            'mode_label' => $booking->serviceType?->name ?: 'Journey',
            'vehicle_class' => $booking->vehicleClass?->name ?: '',
            'passenger_name' => $passenger,
            'payout' => $booking->total_amount !== null ? (float) $booking->total_amount : null,
            'currency' => $booking->currency ?: '',
            'status' => $canceled || $completed ? 'past' : 'upcoming',
            'phase' => $canceled ? 'canceled' : ($completed ? 'completed' : 'upcoming'),
            'status_label' => $canceled ? 'Canceled' : ($completed ? 'Completed' : 'Accepted'),
            'cancel_reason' => $canceled ? (string) ($this->latestCancellation($booking)?->reason ?: '') : '',
            'cancelled_by' => $canceled ? $this->cancelledByRole($booking) : '',
        ];
    }

    private function latestCancellation(Booking $booking): ?BookingCancellation
    {
        if (! $booking->relationLoaded('cancellations')) {
            return $booking->cancellations()->with('cancelledBy')->latest('id')->first();
        }

        return $booking->cancellations->sortByDesc('id')->first();
    }

    private function cancelledByRole(Booking $booking): string
    {
        $role = $this->latestCancellation($booking)?->cancelledBy?->role;

        return $role === UserRole::Chauffeur ? 'chauffeur' : 'customer';
    }
}
