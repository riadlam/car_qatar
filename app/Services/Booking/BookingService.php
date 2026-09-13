<?php

namespace App\Services\Booking;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\QuoteStatus;
use App\Models\BillingProfile;
use App\Models\Booking;
use App\Models\BookingCancellation;
use App\Models\BookingGuest;
use App\Models\BookingPriceItem;
use App\Models\BookingStop;
use App\Models\GulfDestination;
use App\Models\HourlyBooking;
use App\Models\Location;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\QuoteStop;
use App\Models\SeatAddon;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\VehicleClass;
use App\Services\Dispatch\DispatchService;
use App\Services\Maps\MapboxDirectionsService;
use App\Services\Maps\MapboxGeocodingService;
use App\Services\Pricing\PricingService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class BookingService
{
    public const OPEN = [
        BookingStatus::Confirmed->value,
        BookingStatus::ChauffeurAssigned->value,
        BookingStatus::InProgress->value,
    ];

    public const OPEN_BOOKING_MESSAGE = 'Finish or cancel your current booking before booking another.';

    public function __construct(
        private readonly PricingService $pricing,
        private readonly MapboxDirectionsService $directions,
        private readonly MapboxGeocodingService $geocoding,
        private readonly DispatchService $dispatch,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @return list<array<string, mixed>>
     */
    public function buildPricedOptions(?User $user, array $data): array
    {
        $data = $this->withRouteMetrics($data);
        $service = $this->resolveServiceType($data);
        $params = $this->pricingParams($data);

        return $this->pricing->priceAllClasses($service, $params);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createQuote(?User $user, array $data): Quote
    {
        $data = $this->withRouteMetrics($data);
        $service = $this->resolveServiceType($data);

        if (empty($data['vehicle_class_id']) && empty($data['vehicle_class'])) {
            throw ValidationException::withMessages([
                'vehicle_class_id' => ['A vehicle class is required to create a single quote.'],
            ]);
        }

        $class = $this->resolveVehicleClass($data);
        $priced = $this->pricing->priceTrip($service, $class, $this->pricingParams($data));

        return $this->persistQuote($user, $service, $class, $data, $priced);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return Collection<int, Quote>
     */
    public function createQuotesForAllClasses(?User $user, array $data): Collection
    {
        $data = $this->withRouteMetrics($data);
        $service = $this->resolveServiceType($data);
        $options = $this->pricing->priceAllClasses($service, $this->pricingParams($data));

        if ($options === []) {
            throw ValidationException::withMessages([
                'service_type' => ['No priced vehicle classes available for this service.'],
            ]);
        }

        $data['_pickup_location'] = $this->resolveOrCreateLocation($data['pickup']);
        $data['_dropoff_location'] = ! empty($data['dropoff'])
            ? $this->resolveOrCreateLocation($data['dropoff'])
            : null;
        if (! empty($data['legs']) && is_array($data['legs'])) {
            foreach ($data['legs'] as $index => $leg) {
                $data['legs'][$index]['_pickup_location'] = ! empty($leg['pickup'])
                    ? $this->resolveOrCreateLocation($leg['pickup'])
                    : null;
                $data['legs'][$index]['_dropoff_location'] = ! empty($leg['dropoff'])
                    ? $this->resolveOrCreateLocation($leg['dropoff'])
                    : null;
            }
        }

        $quotes = collect();

        DB::transaction(function () use ($user, $service, $data, $options, $quotes) {
            foreach ($options as $option) {
                /** @var VehicleClass $class */
                $class = $option['vehicle_class'];
                $quotes->push($this->persistQuote($user, $service, $class, $data, $option));
            }
        });

        return $quotes;
    }

    /**
     * @param  array<string, mixed>  $input
     */
    public function resolveOrCreateLocation(array $input): Location
    {
        $placeId = $input['place_id'] ?? null;
        $lat = $input['lat'] ?? $input['latitude'] ?? null;
        $lng = $input['lng'] ?? $input['longitude'] ?? null;
        $formatted = $input['formatted_address']
            ?? $input['label']
            ?? $input['name']
            ?? null;

        if ($placeId) {
            $existing = Location::query()->where('place_id', $placeId)->first();
            if ($existing) {
                return $existing;
            }
        }

        if ($lat !== null && $lng !== null && $formatted) {
            $existing = Location::query()
                ->where('latitude', $lat)
                ->where('longitude', $lng)
                ->where('formatted_address', $formatted)
                ->first();

            if ($existing) {
                return $existing;
            }
        }

        return Location::query()->create([
            'type' => $input['type'] ?? 'address',
            'name' => $input['name'] ?? $formatted,
            'formatted_address' => $formatted,
            'address_line1' => $input['address_line1'] ?? null,
            'address_line2' => $input['address_line2'] ?? null,
            'postal_code' => $input['postal_code'] ?? null,
            'city_id' => $input['city_id'] ?? null,
            'country_id' => $input['country_id'] ?? null,
            'latitude' => $lat,
            'longitude' => $lng,
            'provider' => $input['provider'] ?? null,
            'place_id' => $placeId,
            'metadata' => $input['metadata'] ?? null,
        ]);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function hasOpenBooking(User $user): bool
    {
        return Booking::query()
            ->where('user_id', $user->id)
            ->whereIn('status', self::OPEN)
            ->exists();
    }

    public function convertQuoteToBooking(User $user, Quote $quote, array $payload): Booking
    {
        $quote->loadMissing(['items', 'stops', 'serviceType', 'vehicleClass', 'pickupLocation', 'dropoffLocation']);

        if ($this->quoteNeedsRefresh($quote)) {
            $quote = $this->replaceExpiredQuote($user, $quote);
        }

        if ($quote->status !== QuoteStatus::Priced) {
            throw ValidationException::withMessages([
                'quote_id' => ['Quote must be in priced status to convert.'],
            ]);
        }

        if ($quote->expires_at && $quote->expires_at->isPast()) {
            throw ValidationException::withMessages([
                'quote_id' => ['This quote has expired. Refresh the price and try again.'],
            ]);
        }

        if ($quote->user_id !== null && (int) $quote->user_id !== (int) $user->id) {
            throw ValidationException::withMessages([
                'quote_id' => ['This quote does not belong to you.'],
            ]);
        }

        if (! $quote->vehicle_class_id) {
            throw ValidationException::withMessages([
                'quote_id' => ['Quote is missing a vehicle class.'],
            ]);
        }

        if (! $quote->pickup_at) {
            throw ValidationException::withMessages([
                'quote_id' => ['Quote is missing a pickup time.'],
            ]);
        }

        $seatAddon = $this->resolveSeatAddonFromQuote($quote);

        $billing = BillingProfile::query()->where('user_id', $user->id)->first();
        if (! $billing) {
            throw ValidationException::withMessages([
                'billing' => ['Add billing information before booking.'],
            ]);
        }

        $notes = isset($payload['customer_notes'])
            ? trim(strip_tags((string) $payload['customer_notes']))
            : '';

        return DB::transaction(function () use ($user, $quote, $payload, $seatAddon, $billing, $notes) {
            User::query()->whereKey($user->id)->lockForUpdate()->first();

            if ($this->hasOpenBooking($user)) {
                throw new HttpException(409, self::OPEN_BOOKING_MESSAGE);
            }

            $quote = Quote::query()->whereKey($quote->id)->lockForUpdate()->firstOrFail();

            if ($quote->status !== QuoteStatus::Priced) {
                throw ValidationException::withMessages([
                    'quote_id' => ['Quote must be in priced status to convert.'],
                ]);
            }

            if ($quote->expires_at && $quote->expires_at->isPast()) {
                throw ValidationException::withMessages([
                    'quote_id' => ['This quote has expired. Refresh the price and try again.'],
                ]);
            }

            if ($quote->user_id !== null && (int) $quote->user_id !== (int) $user->id) {
                throw ValidationException::withMessages([
                    'quote_id' => ['This quote does not belong to you.'],
                ]);
            }

            $booking = new Booking([
                'booking_number' => Booking::generateBookingNumber(),
                'user_id' => $user->id,
                'quote_id' => $quote->id,
                'service_type_id' => $quote->service_type_id,
                'pickup_location_id' => $quote->pickup_location_id,
                'dropoff_location_id' => $quote->dropoff_location_id,
                'pickup_at' => $quote->pickup_at,
                'timezone' => $quote->timezone ?: 'UTC',
                'passenger_count' => $quote->passenger_count ?: 1,
                'vehicle_class_id' => $quote->vehicle_class_id,
                'currency' => $quote->currency,
                'customer_notes' => $notes !== '' ? $notes : null,
                'preferred_language' => $payload['preferred_language'] ?? $user->preferred_language,
                'customer_reference' => $this->generateCustomerReference(),
                'seat_addon_id' => $seatAddon?->id,
                'billing' => $billing->snapshot(),
            ]);

            $booking->forceFill([
                'status' => BookingStatus::Confirmed,
                'payment_status' => PaymentStatus::Pending,
                'subtotal' => $quote->subtotal,
                'tax_amount' => $quote->tax_amount,
                'fees' => $quote->fees,
                'discount' => $quote->discount,
                'total_amount' => $quote->total,
            ])->save();

            foreach ($quote->items as $item) {
                BookingPriceItem::query()->create([
                    'booking_id' => $booking->id,
                    'item_type' => $item->item_type,
                    'name' => $item->name,
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                    'metadata' => $item->metadata,
                ]);
            }

            $forMyself = (bool) ($payload['for_myself'] ?? false);
            if (! $forMyself && ! empty($payload['guest'])) {
                $guest = $payload['guest'];
                BookingGuest::query()->create([
                    'booking_id' => $booking->id,
                    'title' => $guest['title'] ?? null,
                    'first_name' => $guest['first_name'],
                    'last_name' => $guest['last_name'],
                    'email' => $guest['email'] ?? null,
                    'phone' => $guest['phone'] ?? null,
                    'is_primary' => true,
                ]);
            }

            if ($quote->serviceType?->is_hourly) {
                $duration = (int) ($quote->duration_minutes ?: 60);
                $startsAt = $quote->pickup_at;
                HourlyBooking::query()->create([
                    'booking_id' => $booking->id,
                    'duration_minutes' => $duration,
                    'starts_at' => $startsAt,
                    'ends_at' => $startsAt?->copy()->addMinutes($duration),
                    'included_km' => null,
                ]);
            }

            $sequence = 1;
            foreach ($quote->stops as $stop) {
                if ($stop->pickup_location_id) {
                    BookingStop::query()->create([
                        'booking_id' => $booking->id,
                        'sequence' => $sequence++,
                        'location_id' => $stop->pickup_location_id,
                        'notes' => $stop->notes,
                    ]);
                }
                if ($stop->dropoff_location_id) {
                    BookingStop::query()->create([
                        'booking_id' => $booking->id,
                        'sequence' => $sequence++,
                        'location_id' => $stop->dropoff_location_id,
                        'notes' => $stop->notes,
                    ]);
                }
            }

            $quote->forceFill([
                'status' => QuoteStatus::Converted,
                'user_id' => $quote->user_id ?? $user->id,
            ])->save();

            return $booking;
        });

        $booking = $booking->fresh([
            'guest',
            'guests',
            'vehicleClass',
            'pickupLocation',
            'dropoffLocation',
            'priceItems',
            'serviceType',
            'seatAddon',
            'hourlyBooking',
            'stops.location',
            'payments',
        ]);

        $this->dispatch->syncBooking($booking);

        return $booking;
    }

    public function cancelBooking(User $user, Booking $booking, string $reason): Booking
    {
        if ($booking->status === BookingStatus::Cancelled) {
            throw ValidationException::withMessages([
                'booking' => ['Booking is already cancelled.'],
            ]);
        }

        if (in_array($booking->status, [BookingStatus::Completed], true)) {
            throw ValidationException::withMessages([
                'booking' => ['Completed bookings cannot be cancelled.'],
            ]);
        }

        $booking = DB::transaction(function () use ($user, $booking, $reason) {
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
            ], app(\App\Services\Tracking\TrackingService::class)->cancelSnapshot($booking)))->save();

            $booking->forceFill([
                'status' => BookingStatus::Cancelled,
                'cancelled_at' => now(),
            ])->save();

            return $booking->fresh([
                'guest',
                'vehicleClass',
                'pickupLocation',
                'dropoffLocation',
                'priceItems',
                'serviceType',
                'cancellations.cancelledBy',
            ]);
        });

        $this->dispatch->syncBooking($booking);
        $this->dispatch->releaseAssignmentAfterClientCancel($booking, $user, $reason);

        return $booking;
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, mixed>  $priced
     */
    private function persistQuote(
        ?User $user,
        ServiceType $service,
        VehicleClass $class,
        array $data,
        array $priced,
    ): Quote {
        $pickup = $data['_pickup_location'] ?? $this->resolveOrCreateLocation($data['pickup']);
        $dropoff = array_key_exists('_dropoff_location', $data)
            ? $data['_dropoff_location']
            : (! empty($data['dropoff']) ? $this->resolveOrCreateLocation($data['dropoff']) : null);

        $durationMinutes = $this->resolveDurationMinutes($data, $service);
        if (! ($service->is_hourly || $service->mode === 'hourly') && ! empty($data['route_duration_minutes'])) {
            $durationMinutes = (int) $data['route_duration_minutes'];
        }
        $gulfDestinationId = $this->resolveGulfDestinationId($data);

        $quote = new Quote([
            'quote_number' => Quote::generateQuoteNumber(),
            'user_id' => $user?->id,
            'service_type_id' => $service->id,
            'vehicle_class_id' => $class->id,
            'pickup_location_id' => $pickup->id,
            'dropoff_location_id' => $dropoff?->id,
            'pickup_at' => ! empty($data['pickup_at']) ? $data['pickup_at'] : now()->addDay(),
            'timezone' => $data['timezone'] ?? 'UTC',
            'duration_minutes' => $durationMinutes,
            'passenger_count' => $data['passengers'] ?? $data['passenger_count'] ?? null,
            'student_count' => $data['students'] ?? $data['student_count'] ?? null,
            'school_term' => $data['school_term'] ?? null,
            'gulf_destination_id' => $gulfDestinationId,
            'currency' => $priced['currency'] ?? 'USD',
            'expires_at' => now()->addHours(24),
            'metadata' => [
                'pricing_rule_id' => $priced['pricing_rule_id'] ?? null,
                'seat_addon' => $data['seat_addon'] ?? $data['seat_addon_slug'] ?? null,
                'distance_km' => $data['distance_km'] ?? $priced['distance_km'] ?? null,
                'route_duration_minutes' => $data['route_duration_minutes'] ?? $priced['route_duration_minutes'] ?? null,
                'route_status' => $data['route_status'] ?? null,
            ],
        ]);

        $quote->forceFill([
            'subtotal' => $priced['subtotal'],
            'tax_amount' => $priced['tax_amount'],
            'fees' => $priced['fees'],
            'discount' => $priced['discount'],
            'total' => $priced['total'],
            'status' => QuoteStatus::Priced,
        ])->save();

        if ($priced['items'] !== []) {
            $now = now();
            QuoteItem::query()->insert(array_map(fn (array $item) => [
                'quote_id' => $quote->id,
                'item_type' => $item['item_type'],
                'name' => $item['name'],
                'description' => $item['description'] ?? null,
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['total_price'],
                'metadata' => isset($item['metadata']) ? json_encode($item['metadata']) : null,
                'created_at' => $now,
                'updated_at' => $now,
            ], $priced['items']));
        }

        if (! empty($data['legs']) && is_array($data['legs'])) {
            foreach (array_values($data['legs']) as $index => $leg) {
                $legPickup = $leg['_pickup_location'] ?? (! empty($leg['pickup'])
                    ? $this->resolveOrCreateLocation($leg['pickup'])
                    : null);
                $legDropoff = $leg['_dropoff_location'] ?? (! empty($leg['dropoff'])
                    ? $this->resolveOrCreateLocation($leg['dropoff'])
                    : null);

                QuoteStop::query()->create([
                    'quote_id' => $quote->id,
                    'sequence' => $index + 1,
                    'pickup_location_id' => $legPickup?->id,
                    'dropoff_location_id' => $legDropoff?->id,
                    'notes' => $leg['notes'] ?? null,
                ]);
            }
        }

        $quote->setRelation('vehicleClass', $class);
        $quote->setRelation('serviceType', $service);
        $quote->setRelation('pickupLocation', $pickup);
        if ($dropoff) {
            $quote->setRelation('dropoffLocation', $dropoff);
        }

        return $quote;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveServiceType(array $data): ServiceType
    {
        $query = ServiceType::query()->where('status', 'active');

        if (! empty($data['service_type_id'])) {
            $service = $query->where('id', $data['service_type_id'])->first();
        } elseif (! empty($data['service_type'])) {
            $service = $query->where('slug', $data['service_type'])->first();
        } elseif (! empty($data['service_type_slug'])) {
            $service = $query->where('slug', $data['service_type_slug'])->first();
        } else {
            $service = null;
        }

        if (! $service) {
            throw ValidationException::withMessages([
                'service_type' => ['Unknown or inactive service type.'],
            ]);
        }

        return $service;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveVehicleClass(array $data): VehicleClass
    {
        $query = VehicleClass::query()->where('status', 'active');

        if (! empty($data['vehicle_class_id'])) {
            $class = $query->where('id', $data['vehicle_class_id'])->first();
        } elseif (! empty($data['vehicle_class'])) {
            $class = $query->where('slug', $data['vehicle_class'])->first();
        } else {
            $class = null;
        }

        if (! $class) {
            throw ValidationException::withMessages([
                'vehicle_class_id' => ['Unknown or inactive vehicle class.'],
            ]);
        }

        return $class;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function pricingParams(array $data): array
    {
        return [
            'duration' => $data['duration'] ?? null,
            'duration_minutes' => $data['duration_minutes'] ?? null,
            'distance_km' => $data['distance_km'] ?? null,
            'route_duration_minutes' => $data['route_duration_minutes'] ?? null,
            'seat_addon_id' => $data['seat_addon_id'] ?? null,
            'seat_addon' => $data['seat_addon'] ?? $data['seat_addon_slug'] ?? null,
            'passengers' => $data['passengers'] ?? $data['passenger_count'] ?? null,
            'school_term' => $data['school_term'] ?? null,
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveDurationMinutes(array $data, ServiceType $service): ?int
    {
        if (! empty($data['duration_minutes'])) {
            return (int) $data['duration_minutes'];
        }

        if (! ($service->is_hourly || $service->mode === 'hourly')) {
            return null;
        }

        $duration = $data['duration'] ?? null;

        if ($duration === 'full_day' || $duration === 'full-day') {
            return 12 * 60;
        }

        if (is_numeric($duration) && (float) $duration > 0) {
            return (int) round(((float) $duration) * 60);
        }

        return 60;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function resolveGulfDestinationId(array $data): ?int
    {
        if (! empty($data['gulf_destination_id'])) {
            return (int) $data['gulf_destination_id'];
        }

        $slug = $data['gulf_destination'] ?? $data['gulf_destination_slug'] ?? null;
        if (! $slug) {
            return null;
        }

        return $this->findGulfDestination($slug)?->id;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function withRouteMetrics(array $data): array
    {
        $service = $this->resolveServiceType($data);

        if ($service->is_hourly || $service->mode === 'hourly') {
            $data['route_status'] = 'hourly';

            return $data;
        }

        $points = $this->routePoints($service, $data);
        if (count($points) < 2) {
            $data['route_status'] = 'missing_coordinates';

            return $data;
        }

        $route = $this->directions->route($points);
        if (! $route) {
            $estimatedKm = $this->straightLineKm($points);
            if ($estimatedKm === null) {
                $data['route_status'] = 'unavailable';

                return $data;
            }

            $data['distance_km'] = $estimatedKm;
            $data['route_duration_minutes'] = (int) max(1, round(($estimatedKm / 70) * 60));
            $data['route_status'] = 'estimated';

            return $data;
        }

        $data['distance_km'] = $route['distance_km'];
        $data['route_duration_minutes'] = $route['duration_minutes'];
        $data['route_status'] = 'ok';

        return $data;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return list<array{lat: float, lng: float}>
     */
    private function routePoints(ServiceType $service, array &$data): array
    {
        if ($service->requires_gulf_destination || $service->slug === 'arab_gulf_trips') {
            $gulf = $this->findGulfDestination(
                $data['gulf_destination'] ?? $data['gulf_destination_slug'] ?? ($data['dropoff']['label'] ?? null)
            );
            $coords = $gulf ? $this->gulfCoordinates($gulf) : null;
            if ($coords) {
                $data['dropoff'] = array_merge($data['dropoff'] ?? [], [
                    'label' => $gulf->name,
                    'lat' => $coords['lat'],
                    'lng' => $coords['lng'],
                ]);
                $data['gulf_destination_id'] = $gulf->id;
            }
        }

        if ($service->allows_multi_stops && ! empty($data['legs']) && is_array($data['legs'])) {
            $points = [];
            foreach ($data['legs'] as $leg) {
                $pickup = $this->coordinatePoint($leg['pickup'] ?? null);
                $dropoff = $this->coordinatePoint($leg['dropoff'] ?? null);
                if ($pickup) {
                    $points[] = $pickup;
                }
                if ($dropoff) {
                    $points[] = $dropoff;
                }
            }

            return $points;
        }

        $dropoff = $data['dropoff'] ?? null;
        if (is_array($dropoff) && $this->coordinatePoint($dropoff) === null && filled($dropoff['label'] ?? $dropoff['formatted_address'] ?? null)) {
            $place = $this->geocoding->forward((string) ($dropoff['label'] ?? $dropoff['formatted_address']));
            if ($place && isset($place['latitude'], $place['longitude'])) {
                $data['dropoff']['lat'] = $place['latitude'];
                $data['dropoff']['lng'] = $place['longitude'];
            }
        }

        return array_values(array_filter([
            $this->coordinatePoint($data['pickup'] ?? null),
            $this->coordinatePoint($data['dropoff'] ?? null),
        ]));
    }

    /**
     * @return array{lat: float, lng: float}|null
     */
    private function coordinatePoint(mixed $location): ?array
    {
        if (! is_array($location)) {
            return null;
        }

        $lat = $location['lat'] ?? $location['latitude'] ?? null;
        $lng = $location['lng'] ?? $location['longitude'] ?? null;
        if (! is_numeric($lat) || ! is_numeric($lng)) {
            return null;
        }

        return ['lat' => (float) $lat, 'lng' => (float) $lng];
    }

    /**
     * Sum of great-circle legs when Mapbox has no drivable route (for example a Gulf crossing).
     *
     * @param  list<array{lat: float, lng: float}>  $points
     */
    private function straightLineKm(array $points): ?float
    {
        if (count($points) < 2) {
            return null;
        }

        $total = 0.0;
        for ($i = 1, $count = count($points); $i < $count; $i++) {
            $total += $this->haversineKm($points[$i - 1], $points[$i]);
        }

        return round($total, 2);
    }

    /**
     * @param  array{lat: float, lng: float}  $from
     * @param  array{lat: float, lng: float}  $to
     */
    private function haversineKm(array $from, array $to): float
    {
        $earth = 6371.0;
        $lat1 = deg2rad($from['lat']);
        $lat2 = deg2rad($to['lat']);
        $dLat = $lat2 - $lat1;
        $dLng = deg2rad($to['lng'] - $from['lng']);
        $a = sin($dLat / 2) ** 2 + cos($lat1) * cos($lat2) * sin($dLng / 2) ** 2;

        return $earth * (2 * atan2(sqrt($a), sqrt(1 - $a)));
    }

    private function findGulfDestination(mixed $value): ?GulfDestination
    {
        if ($value === null || $value === '') {
            return null;
        }

        $needle = trim((string) $value);

        return GulfDestination::query()
            ->where('status', 'active')
            ->where(function ($query) use ($needle) {
                $query->where('slug', $needle)
                    ->orWhereRaw('LOWER(name) = ?', [mb_strtolower($needle)]);
            })
            ->first();
    }

    /**
     * @return array{lat: float, lng: float}|null
     */
    private function gulfCoordinates(GulfDestination $gulf): ?array
    {
        if ($gulf->latitude !== null && $gulf->longitude !== null) {
            return [
                'lat' => (float) $gulf->latitude,
                'lng' => (float) $gulf->longitude,
            ];
        }

        $place = $this->geocoding->forward($gulf->name);
        if (! $place || ! isset($place['latitude'], $place['longitude'])) {
            return null;
        }

        $gulf->forceFill([
            'latitude' => $place['latitude'],
            'longitude' => $place['longitude'],
        ])->save();

        return [
            'lat' => (float) $place['latitude'],
            'lng' => (float) $place['longitude'],
        ];
    }

    private function quoteNeedsRefresh(Quote $quote): bool
    {
        if ($quote->status === QuoteStatus::Converted || $quote->status === QuoteStatus::Cancelled) {
            return false;
        }

        return $quote->status === QuoteStatus::Expired
            || ($quote->expires_at && $quote->expires_at->isPast());
    }

    /**
     * Reprice the same trip on the server. Totals still come from pricing, not the client.
     */
    private function replaceExpiredQuote(User $user, Quote $quote): Quote
    {
        $quote->loadMissing(['pickupLocation', 'dropoffLocation', 'serviceType', 'vehicleClass']);

        if ($quote->status !== QuoteStatus::Expired) {
            $quote->forceFill(['status' => QuoteStatus::Expired])->save();
        }

        $pickup = $quote->pickupLocation;
        if (! $pickup) {
            throw ValidationException::withMessages([
                'quote_id' => ['This quote has expired and cannot be refreshed.'],
            ]);
        }

        $data = [
            'service_type_id' => $quote->service_type_id,
            'vehicle_class_id' => $quote->vehicle_class_id,
            'pickup' => $this->locationPayload($pickup),
            'pickup_at' => $quote->pickup_at,
            'timezone' => $quote->timezone,
            'duration_minutes' => $quote->duration_minutes,
            'passengers' => $quote->passenger_count,
            'students' => $quote->student_count,
            'school_term' => $quote->school_term,
            'gulf_destination_id' => $quote->gulf_destination_id,
            'seat_addon' => $quote->metadata['seat_addon'] ?? null,
            'distance_km' => $quote->metadata['distance_km'] ?? null,
            'route_duration_minutes' => $quote->metadata['route_duration_minutes'] ?? null,
            'route_status' => $quote->metadata['route_status'] ?? null,
        ];

        if ($quote->dropoffLocation) {
            $data['dropoff'] = $this->locationPayload($quote->dropoffLocation);
        }

        return $this->createQuote($user, $data);
    }

    /**
     * @return array{label: string, formatted_address: ?string, lat: float, lng: float, place_id: ?string}
     */
    private function locationPayload(Location $location): array
    {
        $label = $location->formatted_address ?: $location->name ?: 'Location';

        return [
            'label' => $label,
            'formatted_address' => $location->formatted_address,
            'lat' => (float) $location->latitude,
            'lng' => (float) $location->longitude,
            'place_id' => $location->place_id,
        ];
    }

    private function generateCustomerReference(): string
    {
        do {
            $code = 'AM-'.now()->format('ymd').'-'.strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
        } while (Booking::query()->where('customer_reference', $code)->exists());

        return $code;
    }

    private function resolveSeatAddonFromQuote(Quote $quote): ?SeatAddon
    {
        $slug = $quote->metadata['seat_addon'] ?? null;
        if (! is_string($slug) || $slug === '' || $slug === 'none') {
            return null;
        }

        return SeatAddon::query()
            ->where('slug', $slug)
            ->where('status', 'active')
            ->first();
    }

    private function resolveSeatAddonFromPayload(array $payload): ?SeatAddon
    {
        if (! empty($payload['seat_addon_id'])) {
            return SeatAddon::query()->find($payload['seat_addon_id']);
        }

        $slug = $payload['seat_addon'] ?? $payload['seat_addon_slug'] ?? null;
        if (! $slug) {
            return null;
        }

        return SeatAddon::query()
            ->where('slug', $slug)
            ->where('status', 'active')
            ->first();
    }
}
