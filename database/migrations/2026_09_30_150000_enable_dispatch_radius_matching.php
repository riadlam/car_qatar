<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('dispatch_settings')) {
            return;
        }

        DB::table('dispatch_settings')->update([
            'radius_matching_enabled' => true,
            'updated_at' => now(),
        ]);

        if (! DB::table('dispatch_settings')->where('id', 1)->exists()) {
            DB::table('dispatch_settings')->insert([
                'id' => 1,
                'offer_radius_km' => 15,
                'radius_matching_enabled' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        //
    }
};
