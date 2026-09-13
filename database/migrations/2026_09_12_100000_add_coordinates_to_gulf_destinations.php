<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gulf_destinations', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('city_id');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });

        $centers = [
            'dubai' => [25.204849, 55.270783],
            'abu-dhabi' => [24.453884, 54.377344],
            'riyadh' => [24.713552, 46.675296],
            'dammam' => [26.420683, 50.088794],
            'al-ahsa' => [25.383000, 49.586000],
            'muscat' => [23.588000, 58.382900],
            'salalah' => [17.015050, 54.092400],
            'kuwait-city' => [29.375859, 47.977405],
        ];

        foreach ($centers as $slug => [$lat, $lng]) {
            DB::table('gulf_destinations')
                ->where('slug', $slug)
                ->whereNull('latitude')
                ->update([
                    'latitude' => $lat,
                    'longitude' => $lng,
                ]);
        }

        $multipliers = [
            'one_way' => 1.0,
            'multi_stops' => 1.25,
            'by_hour' => 1.0,
            'city_tour' => 1.0,
            'arab_gulf_trips' => 2.5,
            'school_chauffeured' => 8.0,
        ];
        $hourly = ['by_hour', 'city_tour'];
        $serviceIds = DB::table('service_types')->pluck('id', 'slug');

        foreach ($multipliers as $slug => $multiplier) {
            $serviceId = $serviceIds[$slug] ?? null;
            if (! $serviceId) {
                continue;
            }

            $isHourly = in_array($slug, $hourly, true);

            DB::table('pricing_rules')
                ->where('service_type_id', $serviceId)
                ->where('status', 'active')
                ->where(function ($query) {
                    $query->whereNull('per_km')->orWhere('per_km', 0);
                })
                ->update([
                    'per_km' => $isHourly ? 0 : round(2.00 * $multiplier, 2),
                    'per_minute' => $isHourly ? 0 : round(0.15 * $multiplier, 2),
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('gulf_destinations', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
