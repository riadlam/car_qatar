<?php

namespace App\Services\Dispatch;

use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Events\BookingPosition;
use App\Events\BookingUpdated;
use App\Events\OfferAvailable;
use App\Events\OfferWithdrawn;
use App\Events\RideUpdated;
use App\Http\Resources\ChauffeurOfferResource;
use App\Http\Resources\ChauffeurRideResource;
use App\Models\Booking;
use App\Models\BookingCancellation;
use App\Models\Chauffeur;
use App\Models\DispatchSetting;
use App\Models\RideAssignment;
use App\Models\RideEvent;
use App\Models\RideOffer;
use App\Models\User;
use App\Services\Maps\MapboxDirectionsService;
use App\Services\Tracking\TrackingService;
use App\Support\Broadcasts;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class DispatchService
{
    public const LOCATION_MAX_AGE_MINUTES = 15;

    /** @var list<string> */
    public const ONGOING = ['assigned', 'en_route', 'arrived', 'in_progress'];

    public function __construct(
        private readonly MapboxDirectionsService $directions,
    ) {}

    public function radiusKm(): int
    {
        return DispatchSetting::current()->radiusKm();
    }

    public function radiusMatchingEnabled(): bool
    {
        return (bool) DispatchSetting::current()->radius_matching_enabled;
    }

    public function syncBooking(Booking $booking): void
    {
        $booking->loadMissing(['pickupLocation', 'rideAssignment']);

        if (! $this->bookingIsOpen($booking)) {
            $this->withdrawOpenOffers($booking);

            return;
        }

        if (! $this->radiusMatchingEnabled()) {
            foreach ($this->activeChauffeurs() as $chauffeur) {
                $this->openOffer($booking, (int) $chauffeur->id);
            }

            return;
        }

        $pickup = $booking->pickupLocation;
        if ($pickup?->latitude === null || $pickup?->longitude === null) {
            $this->withdrawOpenOffers($booking);

            return;
        }

        $eligibleIds = $this->eligibleChauffeurs(
            (float) $pickup->latitude,
            (float) $pickup->longitude,
        )->pluck('id')->all();

        foreach ($eligibleIds as $chauffeurId) {
            $this->openOffer($booking, (int) $chauffeurId);
        }

        RideOffer::query()
            ->where('booking_id', $booking->id)
            ->whereIn('status', ['pending', 'offered'])
            ->when($eligibleIds !== [], fn ($query) => $query->whereNotIn('chauffeur_id', $eligibleIds))
            ->get()
            ->each(fn (RideOffer $offer) => $this->withdrawOffer($offer));
    }

    public function syncChauffeur(Chauffeur $chauffeur): void
    {
        if ($chauffeur->status !== 'active' || $this->hasOngoingTrip($chauffeur)) {
            $this->withdrawChauffeurOffers($chauffeur);

            return;
        }

        if (! $this->radiusMatchingEnabled()) {
            $this->offerAllOpenBookings($chauffeur);

            return;
        }

        $insideIds = $this->bookingsInsideRadius($chauffeur);

        foreach ($insideIds as $bookingId) {
            $booking = Booking::query()->find($bookingId);
            if ($booking) {
                $this->openOffer($booking, (int) $chauffeur->id);
            }
        }

        RideOffer::query()
            ->where('chauffeur_id', $chauffeur->id)
            ->whereIn('status', ['pending', 'offered'])
            ->when($insideIds !== [], fn ($query) => $query->whereNotIn('booking_id', $insideIds))
            ->get()
            ->each(fn (RideOffer $offer) => $this->withdrawOffer($offer));
    }

    public function ensureOffersFor(Chauffeur $chauffeur): void
    {
        if (! $this->radiusMatchingEnabled()) {
            foreach ($this->activeChauffeurs() as $active) {
                if ($this->hasOngoingTrip($active)) {
                    $this->withdrawChauffeurOffers($active);

                    continue;
                }
                $this->offerAllOpenBookings($active);
            }

            return;
        }

        if ($chauffeur->status !== 'active' || $this->hasOngoingTrip($chauffeur)) {
            if ($this->hasOngoingTrip($chauffeur)) {
                $this->withdrawChauffeurOffers($chauffeur);
            }

            return;
        }

        $this->syncChauffeur($chauffeur);
    }

    public function accept(RideOffer $offer, Chauffeur $chauffeur): RideAssignment
    {
        if ((int) $offer->chauffeur_id !== (int) $chauffeur->id) {
            abort(404);
        }

        return DB::transaction(function () use ($offer, $chauffeur) {
            $locked = RideOffer::query()->whereKey($offer->id)->lockForUpdate()->firstOrFail();
            Chauffeur::query()->whereKey($chauffeur->id)->lockForUpdate()->first();

            if ((int) $locked->chauffeur_id !== (int) $chauffeur->id) {
                abort(404);
            }

            if ($this->hasOngoingTrip($chauffeur)) {
                throw new HttpException(409, 'Finish or cancel your current trip before accepting another.');
            }

            if (! in_array($locked->status, ['pending', 'offered'], true)) {
                throw new HttpException(409, 'This offer is no longer available.');
            }

            $booking = Booking::query()
                ->whereKey($locked->booking_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($booking->rideAssignment()->exists() || $booking->status !== BookingStatus::Confirmed) {
                throw new HttpException(409, 'This ride has already been accepted.');
            }

            $chauffeur = $chauffeur->fresh() ?? $chauffeur;
            $booking->load('pickupLocation');
            if ($this->radiusMatchingEnabled() && ! $this->chauffeurCanSeeBooking($chauffeur, $booking)) {
                throw ValidationException::withMessages([
                    'offer' => ['This offer is no longer in your area.'],
                ]);
            }

            $assignment = RideAssignment::query()->create([
                'booking_id' => $booking->id,
                'chauffeur_id' => $chauffeur->id,
                'vehicle_id' => $locked->vehicle_id,
                'ride_offer_id' => $locked->id,
                'status' => 'assigned',
                'assigned_at' => now(),
            ]);

            $locked->forceFill([
                'status' => 'accepted',
                'responded_at' => now(),
            ])->save();

            $booking->forceFill([
                'status' => BookingStatus::ChauffeurAssigned,
            ])->save();

            $others = RideOffer::query()
                ->where(function ($query) use ($booking, $locked, $chauffeur) {
                    $query->where(function ($query) use ($booking, $locked) {
                        $query->where('booking_id', $booking->id)->where('id', '!=', $locked->id);
                    })->orWhere(function ($query) use ($chauffeur, $locked) {
                        $query->where('chauffeur_id', $chauffeur->id)->where('id', '!=', $locked->id);
                    });
                })
                ->whereIn('status', ['pending', 'offered'])
                ->lockForUpdate()
                ->get();

            foreach ($others as $other) {
                $other->forceFill([
                    'status' => 'withdrawn',
                    'responded_at' => now(),
                ])->save();
            }

            DB::afterCommit(function () use ($others, $booking, $assignment, $chauffeur) {
                foreach ($others as $other) {
                    Broadcasts::send(new OfferWithdrawn(
                        (int) $other->chauffeur_id,
                        (int) $other->id,
                        (int) $booking->id,
                    ));
                }

                Broadcasts::send(new BookingUpdated((int) $booking->id, 'assigned'));
                Broadcasts::send(new RideUpdated(
                    (int) $chauffeur->id,
                    ChauffeurRideResource::payload($assignment->fresh() ?? $assignment),
                ));
            });

            return $assignment;
        });
    }

    /**
     * @return array<string, mixed>
     */
    public function advanceAssignment(RideAssignment $assignment, Chauffeur $chauffeur, string $next): array
    {
        if ((int) $assignment->chauffeur_id !== (int) $chauffeur->id) {
            abort(404);
        }

        $updated = DB::transaction(function () use ($assignment, $chauffeur, $next) {
            $locked = RideAssignment::query()->whereKey($assignment->id)->lockForUpdate()->firstOrFail();

            if ((int) $locked->chauffeur_id !== (int) $chauffeur->id) {
                abort(404);
            }

            $expected = ChauffeurRideResource::nextStatus($locked->status);
            if ($expected === null || $next !== $expected) {
                throw ValidationException::withMessages([
                    'status' => ['This ride cannot move to that step.'],
                ]);
            }

            $now = now();
            $updates = ['status' => $next];
            if ($next === 'en_route' && ! $locked->started_at) {
                $updates['started_at'] = $now;
            }
            if ($next === 'completed') {
                $updates['completed_at'] = $now;
            }
            $locked->forceFill($updates)->save();

            $booking = Booking::query()->whereKey($locked->booking_id)->lockForUpdate()->firstOrFail();
            if ($next === 'en_route') {
                $booking->forceFill(['status' => BookingStatus::InProgress])->save();
            }
            if ($next === 'completed') {
                $booking->forceFill([
                    'status' => BookingStatus::Completed,
                    'completed_at' => $now,
                ])->save();
                Chauffeur::query()->whereKey($chauffeur->id)->increment('completed_rides');
            }

            RideEvent::query()->create([
                'booking_id' => $booking->id,
                'ride_assignment_id' => $locked->id,
                'chauffeur_id' => $chauffeur->id,
                'event_type' => $next,
                'recorded_at' => $now,
            ]);

            return $locked->fresh() ?? $locked;
        });

        $updated->load(['booking.pickupLocation', 'booking.dropoffLocation', 'chauffeur']);
        $freshChauffeur = $updated->chauffeur;
        $booking = $updated->booking;
        if ($freshChauffeur && $booking) {
            app(TrackingService::class)
                ->refreshAssignmentEta($updated, $booking, $freshChauffeur);
            $updated = $updated->fresh() ?? $updated;
        }

        Broadcasts::send(new BookingUpdated((int) $updated->booking_id, $next));
        $this->broadcastRide($updated, (int) $chauffeur->id);

        if ($next === 'completed') {
            $this->syncChauffeur($chauffeur->fresh() ?? $chauffeur);
        }

        return ChauffeurRideResource::payload($updated);
    }

    /**
     * Move the trip from the chauffeur's latest coordinates. No tap required.
     */
    public function applyLocationProgress(RideAssignment $assignment, Chauffeur $chauffeur, float $lat, float $lng): void
    {
        $assignment->loadMissing(['booking.pickupLocation', 'booking.dropoffLocation', 'booking.stops.location']);
        $booking = $assignment->booking;
        if (! $booking) {
            return;
        }

        $tracking = app(TrackingService::class);
        $status = $assignment->status;

        if ($status === 'assigned') {
            $this->advanceAssignment($assignment, $chauffeur, 'en_route');
            $assignment->refresh();
            $status = $assignment->status;
        }

        $pickup = $booking->pickupLocation;
        $atPickup = $tracking->withinMeters(
            $lat,
            $lng,
            $pickup?->latitude !== null ? (float) $pickup->latitude : null,
            $pickup?->longitude !== null ? (float) $pickup->longitude : null,
        );

        if ($status === 'en_route' && $atPickup) {
            $this->advanceAssignment($assignment, $chauffeur, 'arrived');
            $assignment->refresh();
            $status = $assignment->status;
        }

        if ($status === 'arrived') {
            $this->advanceAssignment($assignment, $chauffeur, 'in_progress');
            $assignment->refresh();
            $status = $assignment->status;
        }

        $dropoff = $tracking->dropoffPoint($booking);
        if ($status === 'in_progress' && $tracking->withinMeters(
            $lat,
            $lng,
            $dropoff?->latitude !== null ? (float) $dropoff->latitude : null,
            $dropoff?->longitude !== null ? (float) $dropoff->longitude : null,
        )) {
            $this->advanceAssignment($assignment, $chauffeur, 'completed');
        }
    }

    public function reject(RideOffer $offer, Chauffeur $chauffeur): void
    {
        if ((int) $offer->chauffeur_id !== (int) $chauffeur->id) {
            abort(404);
        }

        DB::transaction(function () use ($offer, $chauffeur) {
            $locked = RideOffer::query()->whereKey($offer->id)->lockForUpdate()->firstOrFail();

            if ((int) $locked->chauffeur_id !== (int) $chauffeur->id) {
                abort(404);
            }

            if (! in_array($locked->status, ['pending', 'offered'], true)) {
                return;
            }

            $locked->forceFill([
                'status' => 'rejected',
                'responded_at' => now(),
            ])->save();
        });
    }

    public function hasOngoingTrip(Chauffeur $chauffeur): bool
    {
        return RideAssignment::query()
            ->where('chauffeur_id', $chauffeur->id)
            ->whereIn('status', self::ONGOING)
            ->whereHas('booking', function ($query) {
                $query->whereNotIn('status', [
                    BookingStatus::Cancelled->value,
                    BookingStatus::Completed->value,
                ]);
            })
            ->exists();
    }

    /**
     * @return array<string, mixed>
     */
    public function cancelAssignment(RideAssignment $assignment, User $user, string $reason): array
    {
        $chauffeur = $user->chauffeur;
        if (! $chauffeur || (int) $assignment->chauffeur_id !== (int) $chauffeur->id) {
            abort(404);
        }

        $updated = DB::transaction(function () use ($assignment, $user, $reason, $chauffeur) {
            $locked = RideAssignment::query()->whereKey($assignment->id)->lockForUpdate()->firstOrFail();

            if ((int) $locked->chauffeur_id !== (int) $chauffeur->id) {
                abort(404);
            }

            if (! in_array($locked->status, self::ONGOING, true)) {
                throw ValidationException::withMessages([
                    'ride' => ['This trip cannot be cancelled.'],
                ]);
            }

            $booking = Booking::query()->whereKey($locked->booking_id)->lockForUpdate()->firstOrFail();
            $this->markAssignmentCancelled($locked, $booking, $user, $reason);

            return $locked->fresh() ?? $locked;
        });

        $this->notifyTripCancelled($updated);

        return ChauffeurRideResource::payload($updated);
    }

    public function releaseAssignmentAfterClientCancel(Booking $booking, User $user, string $reason): void
    {
        $assignment = $booking->rideAssignment;
        if (! $assignment || ! in_array($assignment->status, self::ONGOING, true)) {
            Broadcasts::send(new BookingUpdated((int) $booking->id, 'cancelled'));

            return;
        }

        $assignment->forceFill(['status' => 'cancelled'])->save();
        RideEvent::query()->create([
            'booking_id' => $booking->id,
            'ride_assignment_id' => $assignment->id,
            'chauffeur_id' => $assignment->chauffeur_id,
            'event_type' => 'cancelled',
            'payload' => ['reason' => $reason],
            'recorded_at' => now(),
        ]);

        $this->notifyTripCancelled($assignment->fresh() ?? $assignment);
    }

    private function markAssignmentCancelled(RideAssignment $assignment, Booking $booking, User $user, string $reason): void
    {
        $now = now();
        $assignment->forceFill(['status' => 'cancelled'])->save();

        if (! in_array($booking->status, [BookingStatus::Cancelled, BookingStatus::Completed], true)) {
            $cancellation = new BookingCancellation([
                'booking_id' => $booking->id,
                'cancelled_by' => $user->id,
                'reason' => $reason,
                'currency' => $booking->currency,
                'status' => 'confirmed',
            ]);
            $cancellation->forceFill(array_merge([
                'fee_amount' => 0,
                'refund_amount' => 0,
            ], app(TrackingService::class)->cancelSnapshot($booking)))->save();

            $booking->forceFill([
                'status' => BookingStatus::Cancelled,
                'cancelled_at' => $now,
            ])->save();
        }

        RideEvent::query()->create([
            'booking_id' => $booking->id,
            'ride_assignment_id' => $assignment->id,
            'chauffeur_id' => $assignment->chauffeur_id,
            'event_type' => 'cancelled',
            'payload' => ['reason' => $reason],
            'recorded_at' => $now,
        ]);

        $this->withdrawOpenOffers($booking);
    }

    private function notifyTripCancelled(RideAssignment $assignment): void
    {
        Broadcasts::send(new BookingUpdated((int) $assignment->booking_id, 'cancelled'));
        $this->broadcastRide($assignment, (int) $assignment->chauffeur_id);

        $chauffeur = $assignment->chauffeur ?? Chauffeur::query()->find($assignment->chauffeur_id);
        if ($chauffeur) {
            $this->syncChauffeur($chauffeur);
        }
    }

    public function broadcastRideCard(RideAssignment $assignment, int $chauffeurId): void
    {
        $this->broadcastRide($assignment, $chauffeurId);
    }

    private function broadcastRide(RideAssignment $assignment, int $chauffeurId): void
    {
        Broadcasts::send(new RideUpdated(
            $chauffeurId,
            ChauffeurRideResource::payload($assignment),
        ));
    }

    public function broadcastPosition(Booking $booking, ?float $heading = null): void
    {
        $booking->loadMissing(['rideAssignment.chauffeur', 'pickupLocation', 'dropoffLocation', 'stops.location']);
        $assignment = $booking->rideAssignment;
        $chauffeur = $assignment?->chauffeur;
        if (! $assignment || $chauffeur?->current_latitude === null || $chauffeur?->current_longitude === null) {
            return;
        }

        $lat = (float) $chauffeur->current_latitude;
        $lng = (float) $chauffeur->current_longitude;
        $tracking = app(TrackingService::class);

        Broadcasts::send(new BookingPosition((int) $booking->id, [
            'lat' => $lat,
            'lng' => $lng,
            'heading' => $heading,
            'trip_step' => $tracking->tripStep($booking, $assignment, $lat, $lng),
            'progress' => $tracking->routeProgress($booking, $chauffeur, $assignment),
            'assignment_status' => $assignment->status,
        ]));
    }

    public function distanceKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earth = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return $earth * (2 * atan2(sqrt($a), sqrt(1 - $a)));
    }

    private function openOffer(Booking $booking, int $chauffeurId): void
    {
        $existing = RideOffer::query()
            ->where('booking_id', $booking->id)
            ->where('chauffeur_id', $chauffeurId)
            ->first();

        if ($existing && in_array($existing->status, ['rejected', 'accepted'], true)) {
            return;
        }

        if ($existing && in_array($existing->status, ['pending', 'offered'], true)) {
            return;
        }

        try {
            $offer = RideOffer::query()->updateOrCreate(
                [
                    'booking_id' => $booking->id,
                    'chauffeur_id' => $chauffeurId,
                ],
                [
                    'status' => 'pending',
                    'offered_at' => now(),
                    'responded_at' => null,
                ],
            );
        } catch (\Illuminate\Database\QueryException) {
            return;
        }

        if (! $offer->wasRecentlyCreated && ! $offer->wasChanged('status')) {
            return;
        }

        Broadcasts::send(new OfferAvailable(
            $chauffeurId,
            ChauffeurOfferResource::payload($offer),
        ));
    }

    private function withdrawOffer(RideOffer $offer): void
    {
        if (! in_array($offer->status, ['pending', 'offered'], true)) {
            return;
        }

        $offer->forceFill([
            'status' => 'withdrawn',
            'responded_at' => now(),
        ])->save();

        Broadcasts::send(new OfferWithdrawn(
            (int) $offer->chauffeur_id,
            (int) $offer->id,
            (int) $offer->booking_id,
        ));
    }

    private function withdrawOpenOffers(Booking $booking): void
    {
        RideOffer::query()
            ->where('booking_id', $booking->id)
            ->whereIn('status', ['pending', 'offered'])
            ->get()
            ->each(fn (RideOffer $offer) => $this->withdrawOffer($offer));
    }

    private function withdrawChauffeurOffers(Chauffeur $chauffeur): void
    {
        RideOffer::query()
            ->where('chauffeur_id', $chauffeur->id)
            ->whereIn('status', ['pending', 'offered'])
            ->get()
            ->each(fn (RideOffer $offer) => $this->withdrawOffer($offer));
    }

    /**
     * @return \Illuminate\Support\Collection<int, Chauffeur>
     */
    private function eligibleChauffeurs(float $pickupLat, float $pickupLng)
    {
        $radius = $this->radiusKm();

        return $this->activeChauffeurs()
            ->filter(function (Chauffeur $chauffeur) use ($pickupLat, $pickupLng, $radius) {
                if (! $this->locationIsFresh($chauffeur)) {
                    return false;
                }

                $straight = $this->distanceKm(
                    $pickupLat,
                    $pickupLng,
                    (float) $chauffeur->current_latitude,
                    (float) $chauffeur->current_longitude,
                );

                if ($straight > $radius) {
                    return false;
                }

                $driving = $this->drivingDistanceKm(
                    (float) $chauffeur->current_latitude,
                    (float) $chauffeur->current_longitude,
                    $pickupLat,
                    $pickupLng,
                );

                return $driving !== null && $driving <= $radius;
            })
            ->values();
    }

    /**
     * @return list<int>
     */
    private function bookingsInsideRadius(Chauffeur $chauffeur): array
    {
        if (! $this->locationIsFresh($chauffeur)) {
            return [];
        }

        $radius = $this->radiusKm();
        $lat = (float) $chauffeur->current_latitude;
        $lng = (float) $chauffeur->current_longitude;

        return $this->openBookings()
            ->filter(function (Booking $booking) use ($lat, $lng, $radius) {
                $pickup = $booking->pickupLocation;
                if ($pickup?->latitude === null || $pickup?->longitude === null) {
                    return false;
                }

                $straight = $this->distanceKm($lat, $lng, (float) $pickup->latitude, (float) $pickup->longitude);
                if ($straight > $radius) {
                    return false;
                }

                $driving = $this->drivingDistanceKm($lat, $lng, (float) $pickup->latitude, (float) $pickup->longitude);

                return $driving !== null && $driving <= $radius;
            })
            ->pluck('id')
            ->all();
    }

    private function offerAllOpenBookings(Chauffeur $chauffeur): void
    {
        foreach ($this->openBookings() as $booking) {
            $this->openOffer($booking, (int) $chauffeur->id);
        }
    }

    /**
     * @return \Illuminate\Support\Collection<int, Booking>
     */
    private function openBookings()
    {
        return Booking::query()
            ->where('status', BookingStatus::Confirmed)
            ->whereDoesntHave('rideAssignment')
            ->with('pickupLocation')
            ->get();
    }

    /**
     * @return \Illuminate\Support\Collection<int, Chauffeur>
     */
    private function activeChauffeurs()
    {
        return Chauffeur::query()
            ->where('status', 'active')
            ->whereHas('user', fn ($query) => $query->where('role', UserRole::Chauffeur))
            ->get();
    }

    private function drivingDistanceKm(float $fromLat, float $fromLng, float $toLat, float $toLng): ?float
    {
        $route = $this->directions->route([
            ['lat' => $fromLat, 'lng' => $fromLng],
            ['lat' => $toLat, 'lng' => $toLng],
        ]);

        return isset($route['distance_km']) ? (float) $route['distance_km'] : null;
    }

    private function chauffeurCanSeeBooking(Chauffeur $chauffeur, Booking $booking): bool
    {
        if ($chauffeur->status !== 'active' || ! $this->locationIsFresh($chauffeur)) {
            return false;
        }

        $pickup = $booking->pickupLocation;
        if ($pickup?->latitude === null || $pickup?->longitude === null) {
            return false;
        }

        $driving = $this->drivingDistanceKm(
            (float) $chauffeur->current_latitude,
            (float) $chauffeur->current_longitude,
            (float) $pickup->latitude,
            (float) $pickup->longitude,
        );

        return $driving !== null && $driving <= $this->radiusKm();
    }

    private function locationIsFresh(Chauffeur $chauffeur): bool
    {
        return $chauffeur->current_latitude !== null
            && $chauffeur->current_longitude !== null
            && $chauffeur->last_location_at !== null
            && $chauffeur->last_location_at->gte(now()->subMinutes(self::LOCATION_MAX_AGE_MINUTES));
    }

    private function bookingIsOpen(Booking $booking): bool
    {
        return $booking->status === BookingStatus::Confirmed
            && ! $booking->rideAssignment;
    }
}
