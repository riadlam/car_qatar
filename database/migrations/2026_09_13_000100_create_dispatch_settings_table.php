<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dispatch_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('offer_radius_km')->default(10);
            $table->timestamps();
        });

        Schema::table('ride_offers', function (Blueprint $table) {
            $table->unique(['booking_id', 'chauffeur_id']);
        });
    }

    public function down(): void
    {
        Schema::table('ride_offers', function (Blueprint $table) {
            $table->dropUnique(['booking_id', 'chauffeur_id']);
        });

        Schema::dropIfExists('dispatch_settings');
    }
};
