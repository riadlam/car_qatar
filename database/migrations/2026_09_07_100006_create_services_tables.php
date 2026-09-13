<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('mode');
            $table->boolean('requires_dropoff')->default(false);
            $table->boolean('allows_multi_stops')->default(false);
            $table->unsignedTinyInteger('max_stops')->nullable();
            $table->boolean('is_hourly')->default(false);
            $table->boolean('requires_flight')->default(false);
            $table->boolean('requires_gulf_destination')->default(false);
            $table->boolean('requires_school_term')->default(false);
            $table->boolean('requires_passengers')->default(false);
            $table->boolean('requires_students')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('slug');
            $table->index('status');
        });

        Schema::create('gulf_destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('country_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('slug');
            $table->index('status');
        });

        Schema::create('city_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('origin_city_id')->constrained('cities')->cascadeOnDelete();
            $table->foreignId('destination_city_id')->constrained('cities')->cascadeOnDelete();
            $table->decimal('distance_km', 10, 2)->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['origin_city_id', 'destination_city_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('city_routes');
        Schema::dropIfExists('gulf_destinations');
        Schema::dropIfExists('service_types');
    }
};
