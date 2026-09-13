<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('brand', 32);
            $table->char('last_four', 4);
            $table->string('holder_name');
            $table->unsignedTinyInteger('exp_month');
            $table->unsignedSmallInteger('exp_year');
            $table->boolean('is_default')->default(false);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->unique('customer_reference');
        });

        Schema::create('billing_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('company')->nullable();
            $table->string('street');
            $table->string('zip', 32);
            $table->string('city');
            $table->string('country', 64);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_profiles');
        Schema::dropIfExists('payment_methods');

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropUnique(['customer_reference']);
        });
    }
};
