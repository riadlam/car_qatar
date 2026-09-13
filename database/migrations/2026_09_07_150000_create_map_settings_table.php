<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('map_settings', function (Blueprint $table) {
            $table->id();
            $table->string('style_uri')->default('mapbox://styles/mapbox/standard');
            $table->string('basemap_theme')->default('faded');
            $table->decimal('default_latitude', 10, 7)->default(25.2854000);
            $table->decimal('default_longitude', 10, 7)->default(51.5310000);
            $table->unsignedTinyInteger('default_zoom')->default(11);
            $table->string('country_codes')->default('qa,ae,sa,om,kw,bh');
            $table->string('language', 16)->default('en');
            $table->string('directions_profile')->default('mapbox/driving-traffic');
            $table->boolean('show_traffic')->default(true);
            $table->string('marker_color', 32)->default('#5b0520');
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('map_settings');
    }
};
