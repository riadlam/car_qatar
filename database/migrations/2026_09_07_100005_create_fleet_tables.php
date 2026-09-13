<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_classes', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('similar_label')->nullable();
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('passengers')->default(1);
            $table->unsignedTinyInteger('luggage')->default(0);
            $table->string('image_lg')->nullable();
            $table->string('image_sm')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('slug');
            $table->index('status');
        });

        Schema::create('vehicle_class_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_class_id')->constrained()->cascadeOnDelete();
            $table->string('kind');
            $table->string('key')->nullable();
            $table->string('label')->nullable();
            $table->string('image_lg')->nullable();
            $table->string('image_sm')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['vehicle_class_id', 'kind']);
        });

        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('label');
            $table->string('icon')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('slug');
            $table->index('status');
        });

        Schema::create('vehicle_class_amenity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('amenity_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['vehicle_class_id', 'amenity_id']);
        });

        Schema::create('seat_addons', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('label');
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('status')->default('active');
            $table->decimal('default_price', 12, 2)->default(0);
            $table->char('currency', 3)->default('USD');
            $table->timestamps();

            $table->index('slug');
            $table->index('status');
        });

        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_class_id')->constrained()->cascadeOnDelete();
            $table->string('manufacturer')->nullable();
            $table->string('model')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('color')->nullable();
            $table->string('license_plate');
            $table->string('vin')->nullable();
            $table->unsignedTinyInteger('passengers')->nullable();
            $table->unsignedTinyInteger('luggage')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('license_plate');
            $table->index('status');
        });

        Schema::create('chauffeur_vehicle_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chauffeur_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index(['chauffeur_id', 'vehicle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chauffeur_vehicle_assignments');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('seat_addons');
        Schema::dropIfExists('vehicle_class_amenity');
        Schema::dropIfExists('amenities');
        Schema::dropIfExists('vehicle_class_media');
        Schema::dropIfExists('vehicle_classes');
    }
};
