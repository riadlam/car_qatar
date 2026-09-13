<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('active')->after('booking_notifications');
            $table->string('avatar_path')->nullable()->after('status');
            $table->timestamp('phone_verified_at')->nullable()->after('avatar_path');
            $table->timestamp('last_login_at')->nullable()->after('phone_verified_at');
            $table->softDeletes();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropSoftDeletes();
            $table->dropColumn([
                'status',
                'avatar_path',
                'phone_verified_at',
                'last_login_at',
            ]);
        });
    }
};
