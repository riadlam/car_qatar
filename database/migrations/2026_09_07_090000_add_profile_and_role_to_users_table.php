<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('password');
            $table->string('account_type')->default('individual')->after('role');
            $table->string('title')->nullable()->after('account_type');
            $table->string('first_name')->nullable()->after('title');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('company_name')->nullable()->after('last_name');
            $table->string('phone')->nullable()->after('company_name');
            $table->string('preferred_language')->nullable()->after('phone');
            $table->string('street_address')->nullable()->after('preferred_language');
            $table->string('language')->default('en')->after('street_address');
            $table->boolean('marketing_emails')->default(true)->after('language');
            $table->string('booking_notifications')->default('email_sms')->after('marketing_emails');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'account_type',
                'title',
                'first_name',
                'last_name',
                'company_name',
                'phone',
                'preferred_language',
                'street_address',
                'language',
                'marketing_emails',
                'booking_notifications',
            ]);
        });
    }
};
