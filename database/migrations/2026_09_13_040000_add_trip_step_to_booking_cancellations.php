<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('booking_cancellations', function (Blueprint $table) {
            $table->string('trip_step', 32)->nullable()->after('reason');
            $table->string('service_type')->nullable()->after('trip_step');
            $table->foreignId('chauffeur_id')->nullable()->after('service_type')->constrained()->nullOnDelete();
            $table->decimal('chauffeur_latitude', 10, 7)->nullable()->after('chauffeur_id');
            $table->decimal('chauffeur_longitude', 10, 7)->nullable()->after('chauffeur_latitude');
            $table->unsignedInteger('distance_to_pickup_m')->nullable()->after('chauffeur_longitude');
        });
    }

    public function down(): void
    {
        Schema::table('booking_cancellations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('chauffeur_id');
            $table->dropColumn([
                'trip_step',
                'service_type',
                'chauffeur_latitude',
                'chauffeur_longitude',
                'distance_to_pickup_m',
            ]);
        });
    }
};
