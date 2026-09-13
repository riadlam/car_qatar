<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dispatch_settings', function (Blueprint $table) {
            $table->boolean('radius_matching_enabled')->default(false)->after('offer_radius_km');
        });
    }

    public function down(): void
    {
        Schema::table('dispatch_settings', function (Blueprint $table) {
            $table->dropColumn('radius_matching_enabled');
        });
    }
};
