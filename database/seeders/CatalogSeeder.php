<?php

namespace Database\Seeders;

use App\Models\Amenity;
use App\Models\CancellationPolicy;
use App\Models\ContactChannel;
use App\Models\Country;
use App\Models\GulfDestination;
use App\Models\PricingRule;
use App\Models\SchoolTerm;
use App\Models\SeatAddon;
use App\Models\ServiceCountOption;
use App\Models\ServiceDurationOption;
use App\Models\ServiceType;
use App\Models\VehicleClass;
use App\Models\VehicleClassMedia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    private const CDN = 'https://service-catalog-assets.blacklane.com/Service+Catalog+Assets';

    public function run(): void
    {
        $this->seedCountries();
        $this->seedServiceTypes();
        $this->seedServiceDropdownOptions();
        $this->seedVehicleClasses();
        $this->seedAmenities();
        $this->seedVanAmenities();
        $this->seedVanMedia();
        $this->seedSeatAddons();
        $this->seedGulfDestinations();
        $this->seedSchoolTerms();
        $this->seedContactChannels();
        $this->seedPricingRules();
        $this->seedCancellationPolicies();
    }

    private function seedCountries(): void
    {
        $countries = [
            ['name' => 'Qatar', 'iso2' => 'QA', 'iso3' => 'QAT', 'phone_code' => '+974', 'default_currency' => 'QAR', 'timezone' => 'Asia/Qatar'],
            ['name' => 'United Arab Emirates', 'iso2' => 'AE', 'iso3' => 'ARE', 'phone_code' => '+971', 'default_currency' => 'AED', 'timezone' => 'Asia/Dubai'],
            ['name' => 'Saudi Arabia', 'iso2' => 'SA', 'iso3' => 'SAU', 'phone_code' => '+966', 'default_currency' => 'SAR', 'timezone' => 'Asia/Riyadh'],
            ['name' => 'Oman', 'iso2' => 'OM', 'iso3' => 'OMN', 'phone_code' => '+968', 'default_currency' => 'OMR', 'timezone' => 'Asia/Muscat'],
            ['name' => 'Kuwait', 'iso2' => 'KW', 'iso3' => 'KWT', 'phone_code' => '+965', 'default_currency' => 'KWD', 'timezone' => 'Asia/Kuwait'],
            ['name' => 'Bahrain', 'iso2' => 'BH', 'iso3' => 'BHR', 'phone_code' => '+973', 'default_currency' => 'BHD', 'timezone' => 'Asia/Bahrain'],
            ['name' => 'Algeria', 'iso2' => 'DZ', 'iso3' => 'DZA', 'phone_code' => '+213', 'default_currency' => 'DZD', 'timezone' => 'Africa/Algiers'],
        ];

        foreach ($countries as $country) {
            Country::updateOrCreate(
                ['iso2' => $country['iso2']],
                array_merge($country, ['status' => 'active']),
            );
        }
    }

    private function seedServiceTypes(): void
    {
        $types = [
            [
                'slug' => 'one_way',
                'name' => 'One way',
                'mode' => 'transfer',
                'requires_dropoff' => true,
                'allows_multi_stops' => false,
                'max_stops' => null,
                'is_hourly' => false,
                'requires_gulf_destination' => false,
                'requires_school_term' => false,
                'requires_passengers' => false,
                'requires_students' => false,
                'sort_order' => 1,
            ],
            [
                'slug' => 'multi_stops',
                'name' => 'Multi stops',
                'mode' => 'transfer',
                'requires_dropoff' => true,
                'allows_multi_stops' => true,
                'max_stops' => 3,
                'is_hourly' => false,
                'requires_gulf_destination' => false,
                'requires_school_term' => false,
                'requires_passengers' => false,
                'requires_students' => false,
                'sort_order' => 2,
            ],
            [
                'slug' => 'by_hour',
                'name' => 'By the hour',
                'mode' => 'hourly',
                'requires_dropoff' => false,
                'allows_multi_stops' => false,
                'max_stops' => null,
                'is_hourly' => true,
                'requires_gulf_destination' => false,
                'requires_school_term' => false,
                'requires_passengers' => false,
                'requires_students' => false,
                'sort_order' => 3,
            ],
            [
                'slug' => 'city_tour',
                'name' => 'City tour',
                'mode' => 'hourly',
                'requires_dropoff' => false,
                'allows_multi_stops' => false,
                'max_stops' => null,
                'is_hourly' => true,
                'requires_gulf_destination' => false,
                'requires_school_term' => false,
                'requires_passengers' => true,
                'requires_students' => false,
                'sort_order' => 4,
            ],
            [
                'slug' => 'arab_gulf_trips',
                'name' => 'Arab Gulf trips',
                'mode' => 'transfer',
                'requires_dropoff' => true,
                'allows_multi_stops' => false,
                'max_stops' => null,
                'is_hourly' => false,
                'requires_gulf_destination' => true,
                'requires_school_term' => false,
                'requires_passengers' => true,
                'requires_students' => false,
                'sort_order' => 5,
            ],
            [
                'slug' => 'school_chauffeured',
                'name' => 'School chauffeured',
                'mode' => 'transfer',
                'requires_dropoff' => true,
                'allows_multi_stops' => false,
                'max_stops' => null,
                'is_hourly' => false,
                'requires_gulf_destination' => false,
                'requires_school_term' => true,
                'requires_passengers' => false,
                'requires_students' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($types as $type) {
            ServiceType::updateOrCreate(
                ['slug' => $type['slug']],
                array_merge($type, [
                    'requires_flight' => false,
                    'status' => 'active',
                ]),
            );
        }
    }

    private function seedServiceDropdownOptions(): void
    {
        $byHour = ServiceType::query()->where('slug', 'by_hour')->firstOrFail();
        $cityTour = ServiceType::query()->where('slug', 'city_tour')->firstOrFail();
        $gulf = ServiceType::query()->where('slug', 'arab_gulf_trips')->firstOrFail();
        $school = ServiceType::query()->where('slug', 'school_chauffeured')->firstOrFail();

        for ($hours = 1; $hours <= 12; $hours++) {
            ServiceDurationOption::updateOrCreate(
                [
                    'service_type_id' => $byHour->id,
                    'value' => (string) $hours,
                ],
                [
                    'label' => $hours === 1 ? '1 hour' : "{$hours} hours",
                    'duration_minutes' => $hours * 60,
                    'sort_order' => $hours,
                    'status' => 'active',
                ],
            );
        }

        ServiceDurationOption::updateOrCreate(
            [
                'service_type_id' => $byHour->id,
                'value' => 'full_day',
            ],
            [
                'label' => 'Full day',
                'duration_minutes' => 12 * 60,
                'sort_order' => 13,
                'status' => 'active',
            ],
        );

        for ($hours = 1; $hours <= 4; $hours++) {
            ServiceDurationOption::updateOrCreate(
                [
                    'service_type_id' => $cityTour->id,
                    'value' => (string) $hours,
                ],
                [
                    'label' => $hours === 1 ? '1 hour' : "{$hours} hours",
                    'duration_minutes' => $hours * 60,
                    'sort_order' => $hours,
                    'status' => 'active',
                ],
            );
        }

        foreach ([1, 2, 3, 4] as $count) {
            ServiceCountOption::updateOrCreate(
                [
                    'service_type_id' => $cityTour->id,
                    'kind' => 'passenger',
                    'value' => (string) $count,
                ],
                [
                    'label' => (string) $count,
                    'sort_order' => $count,
                    'status' => 'active',
                ],
            );

            ServiceCountOption::updateOrCreate(
                [
                    'service_type_id' => $gulf->id,
                    'kind' => 'passenger',
                    'value' => (string) $count,
                ],
                [
                    'label' => (string) $count,
                    'sort_order' => $count,
                    'status' => 'active',
                ],
            );

            ServiceCountOption::updateOrCreate(
                [
                    'service_type_id' => $school->id,
                    'kind' => 'student',
                    'value' => (string) $count,
                ],
                [
                    'label' => (string) $count,
                    'sort_order' => $count,
                    'status' => 'active',
                ],
            );
        }
    }

    private function seedSchoolTerms(): void
    {
        $terms = [
            [
                'value' => 'one_semester',
                'label' => 'One semester (half year)',
                'sort_order' => 1,
            ],
            [
                'value' => 'two_semesters',
                'label' => 'Two semesters (school year)',
                'sort_order' => 2,
            ],
        ];

        foreach ($terms as $term) {
            SchoolTerm::updateOrCreate(
                ['value' => $term['value']],
                array_merge($term, ['status' => 'active']),
            );
        }
    }

    private function seedContactChannels(): void
    {
        $channels = [
            [
                'key' => 'call_us',
                'label' => 'Call us',
                'href' => 'tel:+97440000000',
                'type' => 'phone',
                'sort_order' => 1,
            ],
            [
                'key' => 'whatsapp',
                'label' => 'WhatsApp',
                'href' => 'https://wa.me/97440000000',
                'type' => 'whatsapp',
                'sort_order' => 2,
            ],
            [
                'key' => 'leave_message',
                'label' => 'Leave a message',
                'href' => '/help',
                'type' => 'form',
                'sort_order' => 3,
            ],
            [
                'key' => 'email',
                'label' => 'Email',
                'href' => 'mailto:concierge@almajd.com',
                'type' => 'email',
                'sort_order' => 4,
            ],
        ];

        foreach ($channels as $channel) {
            ContactChannel::updateOrCreate(
                ['key' => $channel['key']],
                array_merge($channel, ['status' => 'active']),
            );
        }
    }

    private function seedVehicleClasses(): void
    {
        $cdn = self::CDN;

        // Only Business Van is bookable; other classes kept inactive for FK/history.
        $classes = [
            [
                'slug' => 'van',
                'name' => 'Business Van',
                'similar_label' => 'Mercedes-Benz V-Class or similar',
                'description' => 'More room without compromise. Ideal for groups, excess luggage, or when you need flexibility on the road.',
                'passengers' => 5,
                'luggage' => 5,
                'image_lg' => "{$cdn}/Business+Van/Main/Mobile_Van_Class_Main%402x.png",
                'image_sm' => "{$cdn}/Business+Van/Main/Desktop_Web_Van_Class_Main%402x.png",
                'sort_order' => 1,
                'status' => 'active',
            ],
            [
                'slug' => 'business',
                'name' => 'Business Class',
                'similar_label' => 'Mercedes-Benz EQE or similar',
                'description' => 'Premium made practical. Spacious seating, a smooth journey, and punctual pickups that keep your day in rhythm.',
                'passengers' => 3,
                'luggage' => 2,
                'image_lg' => "{$cdn}/Business+Class/Main/Mobile_Business_Class_Main%402x.png",
                'image_sm' => "{$cdn}/Business+Class/Main/Desktop_Web_Business_Class_Main%402x.png",
                'sort_order' => 2,
                'status' => 'inactive',
            ],
            [
                'slug' => 'first',
                'name' => 'First Class',
                'similar_label' => 'Mercedes-Benz S-Class or similar',
                'description' => 'Our most refined ride. Elevated comfort, discreet service, and a cabin built for arrival moments that matter.',
                'passengers' => 3,
                'luggage' => 2,
                'image_lg' => "{$cdn}/First+Class/Main/Mobile_First_Class_Main%402x.png",
                'image_sm' => "{$cdn}/First+Class/Main/Desktop_Web_First_Class_Main%402x.png",
                'sort_order' => 3,
                'status' => 'inactive',
            ],
        ];

        foreach ($classes as $class) {
            VehicleClass::updateOrCreate(
                ['slug' => $class['slug']],
                $class,
            );
        }
    }

    private function seedAmenities(): void
    {
        $amenities = [
            ['slug' => 'meet', 'label' => 'Personal meet & greet', 'icon' => 'meet', 'sort_order' => 1],
            ['slug' => 'cancel', 'label' => 'Free to cancel up to 1 hour before pickup', 'icon' => 'cancel', 'sort_order' => 2],
            ['slug' => 'chargers', 'label' => 'iOS and Android chargers onboard', 'icon' => 'chargers', 'sort_order' => 3],
            ['slug' => 'wipes', 'label' => 'Complimentary tissues & sanitizing wipes', 'icon' => 'wipes', 'sort_order' => 4],
            ['slug' => 'water', 'label' => 'Complimentary chilled water included', 'icon' => 'water', 'sort_order' => 5],
        ];

        foreach ($amenities as $amenity) {
            Amenity::updateOrCreate(
                ['slug' => $amenity['slug']],
                array_merge($amenity, ['status' => 'active']),
            );
        }
    }

    private function seedVanAmenities(): void
    {
        $van = VehicleClass::query()->where('slug', 'van')->firstOrFail();
        $amenityIds = Amenity::query()->where('status', 'active')->pluck('id')->all();
        $van->amenities()->sync($amenityIds);
    }

    private function seedVanMedia(): void
    {
        $cdn = self::CDN;
        $van = VehicleClass::query()->where('slug', 'van')->firstOrFail();

        $captions = [
            1 => 'Extra space for groups, gear, and longer rides',
            2 => 'Comfortable seating for up to five passengers',
            3 => 'Room for larger luggage and assistive devices',
            4 => 'Ideal for airport runs with the whole team',
            5 => 'Executive comfort with van-class capacity',
        ];

        $rows = [];

        foreach ($captions as $n => $caption) {
            $rows[] = [
                'kind' => 'highlight',
                'key' => "highlight_{$n}",
                'label' => $caption,
                'image_lg' => "{$cdn}/Business+Van/Carousel/Desktop_Van_Class_Carousel_{$n}%402x.png",
                'image_sm' => "{$cdn}/Business+Van/Carousel/Mobile_Van_Class_Carousel_{$n}%402x.png",
                'sort_order' => $n,
            ];
        }

        $luggage = [
            ['cabin_asset', '5 x Carry-on', 'Luggage_Carry_On', 1],
            ['checked_asset', '5 x Standard check-in', 'Luggage_Check_In', 2],
            ['extra_large_asset', '3 x Extra large check-in', 'Luggage_Extra_Large', 3],
        ];
        foreach ($luggage as [$key, $label, $file, $order]) {
            $rows[] = [
                'kind' => 'luggage',
                'key' => $key,
                'label' => $label,
                'image_lg' => "{$cdn}/Business+Van/Luggage+Capacity/Desktop_Van_Class_Capacity_{$file}%402x.png",
                'image_sm' => "{$cdn}/Business+Van/Luggage+Capacity/Mobile_Van_Class_Capacity_{$file}%402x.png",
                'sort_order' => $order,
            ];
        }

        $seating = [
            ['maximum_asset', 'Five passengers', 'Seating_Five', 1],
            ['suggest_asset', 'Four passengers', 'Seating_Four', 2],
            ['child_seat_asset', 'Child seat', 'Seating_Child', 3],
            ['baby_seat_asset', 'Baby seat', 'Seating_Baby', 4],
        ];
        foreach ($seating as [$key, $label, $file, $order]) {
            $rows[] = [
                'kind' => 'seating',
                'key' => $key,
                'label' => $label,
                'image_lg' => "{$cdn}/Business+Van/Seating+Capacity/Desktop_Van_Class_Capacity_{$file}%402x.png",
                'image_sm' => "{$cdn}/Business+Van/Seating+Capacity/Mobile_Van_Class_Capacity_{$file}%402x.png",
                'sort_order' => $order,
            ];
        }

        foreach ($rows as $row) {
            VehicleClassMedia::updateOrCreate(
                [
                    'vehicle_class_id' => $van->id,
                    'kind' => $row['kind'],
                    'key' => $row['key'],
                ],
                [
                    'label' => $row['label'],
                    'image_lg' => $row['image_lg'],
                    'image_sm' => $row['image_sm'],
                    'sort_order' => $row['sort_order'],
                ],
            );
        }
    }

    private function seedSeatAddons(): void
    {
        $addons = [
            ['slug' => 'none', 'label' => 'No seat needed', 'sort_order' => 1, 'default_price' => 0],
            ['slug' => 'child_seat', 'label' => 'Child seat', 'sort_order' => 2, 'default_price' => 15],
            ['slug' => 'baby_seat', 'label' => 'Baby seat', 'sort_order' => 3, 'default_price' => 15],
        ];

        foreach ($addons as $addon) {
            SeatAddon::updateOrCreate(
                ['slug' => $addon['slug']],
                array_merge($addon, [
                    'currency' => 'USD',
                    'status' => 'active',
                ]),
            );
        }
    }

    private function seedGulfDestinations(): void
    {
        $destinations = [
            ['name' => 'Dubai', 'iso2' => 'AE', 'sort_order' => 1, 'latitude' => 25.204849, 'longitude' => 55.270783],
            ['name' => 'Abu Dhabi', 'iso2' => 'AE', 'sort_order' => 2, 'latitude' => 24.453884, 'longitude' => 54.377344],
            ['name' => 'Riyadh', 'iso2' => 'SA', 'sort_order' => 3, 'latitude' => 24.713552, 'longitude' => 46.675296],
            ['name' => 'Dammam', 'iso2' => 'SA', 'sort_order' => 4, 'latitude' => 26.420683, 'longitude' => 50.088794],
            ['name' => 'Al-Ahsa', 'iso2' => 'SA', 'sort_order' => 5, 'latitude' => 25.383000, 'longitude' => 49.586000],
            ['name' => 'Muscat', 'iso2' => 'OM', 'sort_order' => 6, 'latitude' => 23.588000, 'longitude' => 58.382900],
            ['name' => 'Salalah', 'iso2' => 'OM', 'sort_order' => 7, 'latitude' => 17.015050, 'longitude' => 54.092400],
            ['name' => 'Kuwait City', 'iso2' => 'KW', 'sort_order' => 8, 'latitude' => 29.375859, 'longitude' => 47.977405],
        ];

        foreach ($destinations as $destination) {
            $slug = Str::slug($destination['name']);
            $country = Country::query()->where('iso2', $destination['iso2'])->first();

            GulfDestination::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $destination['name'],
                    'country_id' => $country?->id,
                    'latitude' => $destination['latitude'],
                    'longitude' => $destination['longitude'],
                    'sort_order' => $destination['sort_order'],
                    'status' => 'active',
                ],
            );
        }
    }

    private function seedPricingRules(): void
    {
        $vanBase = 334.62;
        $van = VehicleClass::query()->where('slug', 'van')->firstOrFail();

        $serviceSlugs = [
            'one_way',
            'multi_stops',
            'by_hour',
            'city_tour',
            'arab_gulf_trips',
            'school_chauffeured',
        ];

        $multipliers = [
            'one_way' => 1.0,
            'multi_stops' => 1.25,
            'by_hour' => 1.0,
            'city_tour' => 1.0,
            'arab_gulf_trips' => 2.5,
            'school_chauffeured' => 8.0,
        ];

        foreach ($serviceSlugs as $serviceSlug) {
            $serviceType = ServiceType::query()->where('slug', $serviceSlug)->firstOrFail();
            $multiplier = $multipliers[$serviceSlug] ?? 1.0;
            $isHourly = $serviceType->is_hourly || $serviceType->mode === 'hourly';
            $adjustedBase = round($vanBase * $multiplier, 2);

            PricingRule::updateOrCreate(
                [
                    'service_type_id' => $serviceType->id,
                    'vehicle_class_id' => $van->id,
                    'city_id' => null,
                ],
                [
                    'currency' => 'USD',
                    'base_price' => $adjustedBase,
                    'per_km' => $isHourly ? 0 : round(2.00 * $multiplier, 2),
                    'per_minute' => $isHourly ? 0 : round(0.15 * $multiplier, 2),
                    'minimum_price' => $adjustedBase,
                    'hourly_price' => $isHourly ? $vanBase : null,
                    'tax_rate' => 15.25,
                    'priority' => 0,
                    'status' => 'active',
                ],
            );
        }

        // Deactivate legacy Business / First pricing if present.
        $inactiveClassIds = VehicleClass::query()
            ->whereIn('slug', ['business', 'first'])
            ->pluck('id');

        if ($inactiveClassIds->isNotEmpty()) {
            PricingRule::query()
                ->whereIn('vehicle_class_id', $inactiveClassIds)
                ->update(['status' => 'inactive']);
        }
    }

    private function seedCancellationPolicies(): void
    {
        $oneWay = ServiceType::query()->where('slug', 'one_way')->firstOrFail();

        CancellationPolicy::updateOrCreate(
            [
                'service_type_id' => $oneWay->id,
                'name' => 'One way — free cancel 1 hour',
            ],
            [
                'free_cancel_hours' => 1,
                'fee_type' => 'percent',
                'fee_value' => 100,
                'currency' => 'USD',
                'description' => 'Free to cancel up to 1 hour before pickup. Later cancellations may be charged in full.',
                'status' => 'active',
            ],
        );
    }
}
