<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ride_assignments', function (Blueprint $table) {
            $table->unsignedInteger('eta_minutes')->nullable()->after('completed_at');
            $table->timestamp('eta_at')->nullable()->after('eta_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('ride_assignments', function (Blueprint $table) {
            $table->dropColumn(['eta_minutes', 'eta_at']);
        });
    }
};
