<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_type_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            $table->char('currency', 3)->default('USD');
            $table->decimal('base_price', 12, 2)->default(0);
            $table->decimal('per_km', 12, 2)->default(0);
            $table->decimal('per_minute', 12, 2)->default(0);
            $table->decimal('minimum_price', 12, 2)->default(0);
            $table->decimal('hourly_price', 12, 2)->nullable();
            $table->decimal('included_km_per_hour', 8, 2)->nullable();
            $table->decimal('extra_km_price', 12, 2)->nullable();
            $table->decimal('extra_minute_price', 12, 2)->nullable();
            $table->decimal('waiting_price', 12, 2)->nullable();
            $table->decimal('tax_rate', 5, 2)->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->unsignedInteger('priority')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('status');
            $table->index(['service_type_id', 'vehicle_class_id', 'status']);
        });

        Schema::create('pricing_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('zone_type')->nullable();
            $table->json('polygon')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('zone_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pricing_zone_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_type_id')->constrained()->cascadeOnDelete();
            $table->char('currency', 3)->default('USD');
            $table->decimal('price', 12, 2)->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['pricing_zone_id', 'vehicle_class_id', 'service_type_id'], 'zone_prices_unique');
            $table->index('status');
        });

        Schema::create('route_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_route_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_type_id')->constrained()->cascadeOnDelete();
            $table->char('currency', 3)->default('USD');
            $table->decimal('price', 12, 2)->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['city_route_id', 'vehicle_class_id', 'service_type_id'], 'route_prices_unique');
            $table->index('status');
        });

        Schema::create('surcharges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->string('type')->default('fixed');
            $table->decimal('value', 12, 2)->default(0);
            $table->char('currency', 3)->nullable();
            $table->foreignId('service_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            $table->string('applies_to')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->string('status')->default('active');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('code');
        });

        Schema::create('cancellation_policies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('service_type_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('free_cancel_hours')->default(24);
            $table->string('fee_type')->default('percent');
            $table->decimal('fee_value', 12, 2)->default(0);
            $table->char('currency', 3)->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cancellation_policies');
        Schema::dropIfExists('surcharges');
        Schema::dropIfExists('route_prices');
        Schema::dropIfExists('zone_prices');
        Schema::dropIfExists('pricing_zones');
        Schema::dropIfExists('pricing_rules');
    }
};
