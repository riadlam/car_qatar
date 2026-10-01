<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chauffeurs', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('status');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->string('preferred_chauffeur_gender')->nullable()->after('preferred_language');
        });
    }

    public function down(): void
    {
        Schema::table('chauffeurs', function (Blueprint $table) {
            $table->dropColumn('gender');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('preferred_chauffeur_gender');
        });
    }
};
