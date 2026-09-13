<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\BookingGuest;
use App\Models\Chauffeur;
use App\Models\Country;
use App\Models\HourlyBooking;
use App\Models\Location;
use App\Models\Partner;
use App\Models\RideAssignment;
use App\Models\RideEvent;
use App\Models\RideOffer;
use App\Models\SavedGuest;
use App\Models\ServiceType;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleClass;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Demo ops data matching /journeys and /chauffeur UI shapes (Business Van only).
 */
class DemoOpsSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::query()->where('email', 'customer@example.com')->firstOrFail();
        $van = VehicleClass::query()->where('slug', 'van')->firstOrFail();
        $country = Country::query()->where('iso2', 'DZ')->first();

        foreach (
            [
                [
                    'email' => 'karim.benali@example.com',
                    'title' => 'Mr.',
                    'first_name' => 'Karim',
                    'last_name' => 'Benali',
                    'phone' => '+213555123456',
                ],
                [
                    'email' => 'sara.mansouri@example.com',
                    'title' => 'Mrs.',
                    'first_name' => 'Sara',
                    'last_name' => 'Mansouri',
                    'phone' => '+213661987654',
                ],
                [
                    'email' => 'youcef.hadji@example.com',
                    'title' => 'Mr.',
                    'first_name' => 'Youcef',
                    'last_name' => 'Hadji',
                    'phone' => '+213770112233',
                ],
            ] as $guest
        ) {
            SavedGuest::updateOrCreate(
                [
                    'user_id' => $customer->id,
                    'email' => $guest['email'],
                ],
                $guest,
            );
        }

        $oneWay = ServiceType::query()->where('slug', 'one_way')->firstOrFail();
        $byHour = ServiceType::query()->where('slug', 'by_hour')->firstOrFail();

        $partner = Partner::updateOrCreate(
            ['email' => 'partners@almajd.local'],
            [
                'legal_name' => 'AL MAJD Chauffeur Partners SARL',
                'display_name' => 'AL MAJD Partners',
                'phone' => '+213555010000',
                'country_id' => $country?->id,
                'address' => 'Algiers, Algeria',
                'commission_type' => 'percent',
                'commission_value' => 15,
                'status' => 'active',
                'approved_at' => now(),
            ],
        );

        $chauffeurUser = User::updateOrCreate(
            ['email' => 'chauffeur@example.com'],
            [
                'name' => 'Amine Khelifi',
                'password' => 'password',
                'account_type' => 'individual',
                'title' => 'Mr.',
                'first_name' => 'Amine',
                'last_name' => 'Khelifi',
                'phone' => '+213661204488',
                'preferred_language' => 'en',
                'language' => 'en',
                'status' => 'active',
            ],
        );
        $chauffeurUser->forceFill([
            'role' => UserRole::Chauffeur,
            'email_verified_at' => now(),
        ])->save();

        $chauffeur = Chauffeur::updateOrCreate(
            ['user_id' => $chauffeurUser->id],
            [
                'partner_id' => $partner->id,
                'license_number' => 'DZ-CH-441882',
                'license_country' => 'DZ',
                'license_expires_at' => now()->addYears(2)->toDateString(),
                'rating' => 4.94,
                'ratings_count' => 860,
                'completed_rides' => 860,
                'current_latitude' => 36.7538,
                'current_longitude' => 3.0588,
                'last_location_at' => now(),
                'status' => 'active',
            ],
        );

        $vehicle = Vehicle::updateOrCreate(
            ['license_plate' => '16-ALG-441'],
            [
                'partner_id' => $partner->id,
                'vehicle_class_id' => $van->id,
                'manufacturer' => 'Mercedes-Benz',
                'model' => 'V-Class',
                'year' => 2024,
                'color' => 'Obsidian black',
                'vin' => 'WDF447DEMO000441',
                'passengers' => 5,
                'luggage' => 5,
                'status' => 'active',
            ],
        );

        DB::table('chauffeur_vehicle_assignments')->updateOrInsert(
            [
                'chauffeur_id' => $chauffeur->id,
                'vehicle_id' => $vehicle->id,
            ],
            [
                'starts_at' => now()->subMonths(6),
                'ends_at' => null,
                'is_primary' => true,
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );

        $locations = $this->seedLocations($country?->id);

        // Wipe prior demo bookings for idempotent re-seed (by booking_number prefix).
        $demoNumbers = [
            'AM-48291037',
            'AM-39184720',
            'AM-77120358',
            'AM-55019482',
            'AM-22091844',
            'AM-11820377',
            'AM-90441120',
            'AM-OFFER-01',
            'AM-OFFER-02',
            'AM-OFFER-03',
        ];
        Booking::query()->whereIn('booking_number', $demoNumbers)->get()->each(function (Booking $booking) {
            $booking->rideOffers()->delete();
            $booking->rideAssignment?->delete();
            $booking->guests()->delete();
            $booking->hourlyBooking?->delete();
            DB::table('booking_flights')->where('booking_id', $booking->id)->delete();
            $booking->delete();
        });

        // ——— Customer journeys (Business Van) ———
        $confirmedAirport = $this->createBooking([
            'booking_number' => 'AM-48291037',
            'user_id' => $customer->id,
            'service_type_id' => $oneWay->id,
            'status' => BookingStatus::Confirmed,
            'payment_status' => PaymentStatus::Paid,
            'pickup_location_id' => $locations['alg_arrivals']->id,
            'dropoff_location_id' => $locations['hyatt']->id,
            'pickup_at' => '2026-07-25 14:40:00',
            'timezone' => 'Africa/Algiers',
            'passenger_count' => 2,
            'vehicle_class_id' => $van->id,
            'subtotal' => 111.72,
            'tax_amount' => 16.78,
            'total_amount' => 128.50,
            'customer_notes' => 'Name board: AL MAJD',
            'pickup_sign' => 'AL MAJD',
        ]);
        $this->attachFlight($confirmedAirport, 'AH', 'AH 6006', '1');

        $assignedHourly = $this->createBooking([
            'booking_number' => 'AM-39184720',
            'user_id' => $customer->id,
            'service_type_id' => $byHour->id,
            'status' => BookingStatus::ChauffeurAssigned,
            'payment_status' => PaymentStatus::Paid,
            'pickup_location_id' => $locations['embassy']->id,
            'dropoff_location_id' => null,
            'pickup_at' => '2026-07-26 09:00:00',
            'timezone' => 'Asia/Kolkata',
            'passenger_count' => 1,
            'vehicle_class_id' => $van->id,
            'subtotal' => 357.48,
            'tax_amount' => 54.52,
            'total_amount' => 412.00,
            'customer_notes' => 'Guest prefers quiet cabin',
        ]);
        BookingGuest::create([
            'booking_id' => $assignedHourly->id,
            'title' => 'Mr.',
            'first_name' => 'Karim',
            'last_name' => 'Benali',
            'is_primary' => true,
        ]);
        HourlyBooking::create([
            'booking_id' => $assignedHourly->id,
            'duration_minutes' => 240,
            'starts_at' => '2026-07-26 09:00:00',
            'ends_at' => '2026-07-26 13:00:00',
            'included_km' => 120,
        ]);
        RideAssignment::create([
            'booking_id' => $assignedHourly->id,
            'chauffeur_id' => $chauffeur->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'assigned',
            'assigned_at' => now()->subDay(),
        ]);

        $cityTransfer = $this->createBooking([
            'booking_number' => 'AM-77120358',
            'user_id' => $customer->id,
            'service_type_id' => $oneWay->id,
            'status' => BookingStatus::Confirmed,
            'payment_status' => PaymentStatus::Paid,
            'pickup_location_id' => $locations['four_seasons']->id,
            'dropoff_location_id' => $locations['palais']->id,
            'pickup_at' => '2026-07-28 08:15:00',
            'timezone' => 'Africa/Algiers',
            'passenger_count' => 2,
            'vehicle_class_id' => $van->id,
            'subtotal' => 83.55,
            'tax_amount' => 12.65,
            'total_amount' => 96.20,
            'customer_notes' => 'Board meeting — wait if delayed',
        ]);
        BookingGuest::create([
            'booking_id' => $cityTransfer->id,
            'title' => 'Mrs.',
            'first_name' => 'Sara',
            'last_name' => 'Mansouri',
            'is_primary' => true,
        ]);

        $completed = $this->createBooking([
            'booking_number' => 'AM-22091844',
            'user_id' => $customer->id,
            'service_type_id' => $oneWay->id,
            'status' => BookingStatus::Completed,
            'payment_status' => PaymentStatus::Paid,
            'pickup_location_id' => $locations['hyatt']->id,
            'dropoff_location_id' => $locations['alg_departures']->id,
            'pickup_at' => '2026-06-12 06:30:00',
            'timezone' => 'Africa/Algiers',
            'passenger_count' => 1,
            'vehicle_class_id' => $van->id,
            'subtotal' => 97.61,
            'tax_amount' => 14.89,
            'total_amount' => 112.50,
            'completed_at' => '2026-06-12 07:20:00',
        ]);
        RideAssignment::create([
            'booking_id' => $completed->id,
            'chauffeur_id' => $chauffeur->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'completed',
            'assigned_at' => '2026-06-11 18:00:00',
            'started_at' => '2026-06-12 06:25:00',
            'completed_at' => '2026-06-12 07:20:00',
        ]);

        $cancelled = $this->createBooking([
            'booking_number' => 'AM-11820377',
            'user_id' => $customer->id,
            'service_type_id' => $oneWay->id,
            'status' => BookingStatus::Cancelled,
            'payment_status' => PaymentStatus::Refunded,
            'pickup_location_id' => $locations['four_seasons']->id,
            'dropoff_location_id' => $locations['alg_arrivals']->id,
            'pickup_at' => '2026-06-20 18:00:00',
            'timezone' => 'Africa/Algiers',
            'passenger_count' => 3,
            'vehicle_class_id' => $van->id,
            'subtotal' => 130.00,
            'tax_amount' => 19.83,
            'total_amount' => 149.83,
            'cancelled_at' => '2026-06-19 10:00:00',
            'customer_notes' => 'Plans changed',
        ]);

        // ——— Current ride twin (in progress) ———
        $currentRide = $this->createBooking([
            'booking_number' => 'AM-55019482',
            'user_id' => $customer->id,
            'service_type_id' => $oneWay->id,
            'status' => BookingStatus::InProgress,
            'payment_status' => PaymentStatus::Paid,
            'pickup_location_id' => $locations['les_pins']->id,
            'dropoff_location_id' => $locations['alg_departures']->id,
            'pickup_at' => '2026-07-23 14:10:00',
            'timezone' => 'Africa/Algiers',
            'passenger_count' => 1,
            'vehicle_class_id' => $van->id,
            'subtotal' => 74.62,
            'tax_amount' => 11.38,
            'total_amount' => 86.00,
            'customer_notes' => 'Quiet cabin · early flight',
            'chauffeur_notes' => 'Early flight — priority drop-off',
        ]);
        BookingGuest::create([
            'booking_id' => $currentRide->id,
            'title' => 'Mr.',
            'first_name' => 'Youcef',
            'last_name' => 'Hadji',
            'phone' => '+213555014422',
            'is_primary' => true,
        ]);
        $this->attachFlight($currentRide, 'AF', 'AF 1255', 'T1');
        RideAssignment::create([
            'booking_id' => $currentRide->id,
            'chauffeur_id' => $chauffeur->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'en_route',
            'assigned_at' => now()->subHours(2),
            'started_at' => now()->subMinutes(20),
            'eta_minutes' => 18,
            'eta_at' => now()->addMinutes(18),
        ]);

        $chauffeur->forceFill([
            'current_latitude' => 36.768,
            'current_longitude' => 2.98,
            'last_location_at' => now(),
        ])->save();

        RideEvent::query()->create([
            'booking_id' => $currentRide->id,
            'ride_assignment_id' => RideAssignment::query()->where('booking_id', $currentRide->id)->value('id'),
            'chauffeur_id' => $chauffeur->id,
            'event_type' => 'en_route',
            'payload' => ['note' => 'Chauffeur departed toward pickup'],
            'latitude' => 36.768,
            'longitude' => 2.98,
            'recorded_at' => now()->subMinutes(15),
        ]);

        // ——— Pending offers for chauffeur portal ———
        $offerSpecs = [
            [
                'booking_number' => 'AM-OFFER-01',
                'pickup' => $locations['sheraton'],
                'dropoff' => $locations['alg_departures'],
                'pickup_at' => '2026-07-24 05:30:00',
                'total' => 94.00,
                'notes' => 'Airport departure — early morning',
            ],
            [
                'booking_number' => 'AM-OFFER-02',
                'pickup' => $locations['four_seasons'],
                'dropoff' => null,
                'pickup_at' => '2026-07-24 10:00:00',
                'total' => 180.00,
                'notes' => '3-hour city coverage',
                'hourly' => true,
            ],
            [
                'booking_number' => 'AM-OFFER-03',
                'pickup' => $locations['hyatt'],
                'dropoff' => $locations['palais'],
                'pickup_at' => '2026-07-25 16:45:00',
                'total' => 72.00,
                'notes' => 'City transfer',
            ],
        ];

        foreach ($offerSpecs as $spec) {
            $booking = $this->createBooking([
                'booking_number' => $spec['booking_number'],
                'user_id' => $customer->id,
                'service_type_id' => ! empty($spec['hourly']) ? $byHour->id : $oneWay->id,
                'status' => BookingStatus::Confirmed,
                'payment_status' => PaymentStatus::Paid,
                'pickup_location_id' => $spec['pickup']->id,
                'dropoff_location_id' => $spec['dropoff']?->id,
                'pickup_at' => $spec['pickup_at'],
                'timezone' => 'Africa/Algiers',
                'passenger_count' => 2,
                'vehicle_class_id' => $van->id,
                'subtotal' => round($spec['total'] / 1.1525, 2),
                'tax_amount' => round($spec['total'] - ($spec['total'] / 1.1525), 2),
                'total_amount' => $spec['total'],
                'customer_notes' => $spec['notes'],
            ]);

            if (! empty($spec['hourly'])) {
                HourlyBooking::create([
                    'booking_id' => $booking->id,
                    'duration_minutes' => 180,
                    'included_km' => 80,
                ]);
            }

            RideOffer::create([
                'booking_id' => $booking->id,
                'chauffeur_id' => $chauffeur->id,
                'vehicle_id' => $vehicle->id,
                'status' => 'pending',
                'offered_at' => now(),
                'expires_at' => now()->addHours(6),
                'notes' => $spec['notes'],
            ]);
        }

        // Upcoming assigned ride for chauffeur history
        $upcomingAssigned = $this->createBooking([
            'booking_number' => 'AM-90441120',
            'user_id' => $customer->id,
            'service_type_id' => $oneWay->id,
            'status' => BookingStatus::ChauffeurAssigned,
            'payment_status' => PaymentStatus::Paid,
            'pickup_location_id' => $locations['sheraton']->id,
            'dropoff_location_id' => $locations['alg_arrivals']->id,
            'pickup_at' => '2026-07-27 11:20:00',
            'timezone' => 'Africa/Algiers',
            'passenger_count' => 2,
            'vehicle_class_id' => $van->id,
            'subtotal' => 88.00,
            'tax_amount' => 13.42,
            'total_amount' => 101.42,
        ]);
        RideAssignment::create([
            'booking_id' => $upcomingAssigned->id,
            'chauffeur_id' => $chauffeur->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'assigned',
            'assigned_at' => now(),
        ]);
    }

    /**
     * @return array<string, Location>
     */
    private function seedLocations(?int $countryId): array
    {
        $defs = [
            'alg_arrivals' => [
                'name' => 'Houari Boumediene Airport (ALG) — Arrivals',
                'formatted_address' => 'Houari Boumediene Airport (ALG) — Arrivals, Algiers',
                'latitude' => 36.6982,
                'longitude' => 3.2144,
                'type' => 'airport',
            ],
            'alg_departures' => [
                'name' => 'Houari Boumediene Airport (ALG) — Departures T1',
                'formatted_address' => 'Houari Boumediene Airport (ALG) — Departures T1, Algiers',
                'latitude' => 36.6982,
                'longitude' => 3.2145,
                'type' => 'airport',
            ],
            'hyatt' => [
                'name' => 'Hyatt Regency Algiers Airport Hotel',
                'formatted_address' => 'Hyatt Regency Algiers Airport Hotel, Algiers',
                'latitude' => 36.7010,
                'longitude' => 3.2100,
                'type' => 'hotel',
            ],
            'embassy' => [
                'name' => 'Embassy of Algeria, New Delhi',
                'formatted_address' => 'Embassy of Algeria, New Delhi',
                'latitude' => 28.564641,
                'longitude' => 77.159464,
                'type' => 'address',
            ],
            'four_seasons' => [
                'name' => 'Four Seasons Hotel Algiers',
                'formatted_address' => 'Four Seasons Hotel Algiers, Algiers',
                'latitude' => 36.7695,
                'longitude' => 3.0532,
                'type' => 'hotel',
            ],
            'palais' => [
                'name' => 'Palais des Congrès, Pins Maritimes',
                'formatted_address' => 'Palais des Congrès, Pins Maritimes, Algiers',
                'latitude' => 36.7750,
                'longitude' => 3.0400,
                'type' => 'address',
            ],
            'les_pins' => [
                'name' => 'Residence Les Pins, Algiers',
                'formatted_address' => 'Residence Les Pins, Algiers',
                'latitude' => 36.7801,
                'longitude' => 2.9550,
                'type' => 'address',
            ],
            'sheraton' => [
                'name' => 'Sheraton Club des Pins Resort',
                'formatted_address' => 'Sheraton Club des Pins Resort, Algiers',
                'latitude' => 36.7850,
                'longitude' => 2.9300,
                'type' => 'hotel',
            ],
        ];

        $out = [];
        foreach ($defs as $key => $def) {
            $out[$key] = Location::updateOrCreate(
                ['name' => $def['name']],
                [
                    'type' => $def['type'],
                    'formatted_address' => $def['formatted_address'],
                    'country_id' => $countryId,
                    'latitude' => $def['latitude'],
                    'longitude' => $def['longitude'],
                    'provider' => 'seed',
                    'place_id' => 'seed_'.$key,
                ],
            );
        }

        return $out;
    }

    private function createBooking(array $data): Booking
    {
        $status = $data['status'];
        $paymentStatus = $data['payment_status'];
        $money = [
            'subtotal' => $data['subtotal'],
            'tax_amount' => $data['tax_amount'],
            'fees' => $data['fees'] ?? 0,
            'discount' => $data['discount'] ?? 0,
            'total_amount' => $data['total_amount'],
        ];

        unset(
            $data['status'],
            $data['payment_status'],
            $data['subtotal'],
            $data['tax_amount'],
            $data['fees'],
            $data['discount'],
            $data['total_amount'],
        );

        $booking = new Booking(array_merge($data, [
            'currency' => 'USD',
        ]));
        $booking->forceFill(array_merge($money, [
            'status' => $status,
            'payment_status' => $paymentStatus,
        ]))->save();

        return $booking->fresh();
    }

    private function attachFlight(Booking $booking, string $airline, string $flightNumber, ?string $terminal): void
    {
        DB::table('booking_flights')->updateOrInsert(
            ['booking_id' => $booking->id],
            [
                'airline' => $airline,
                'flight_number' => $flightNumber,
                'terminal' => $terminal,
                'status' => 'scheduled',
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );
    }
}
