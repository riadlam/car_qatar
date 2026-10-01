<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignId('partner_id')
                ->nullable()
                ->after('user_id')
                ->constrained()
                ->nullOnDelete();
            $table->foreignId('booked_by_user_id')
                ->nullable()
                ->after('partner_id')
                ->constrained('users')
                ->nullOnDelete();
            $table->string('partner_commission_type')->nullable()->after('total_amount');
            $table->decimal('partner_commission_value', 12, 2)->nullable()->after('partner_commission_type');
            $table->decimal('partner_commission_amount', 12, 2)->nullable()->after('partner_commission_value');
            $table->string('partner_commission_status')->nullable()->after('partner_commission_amount');

            $table->index('partner_id');
            $table->index(['partner_id', 'partner_commission_status']);
        });

        Schema::create('booking_payment_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('token', 80)->unique();
            $table->timestamp('expires_at');
            $table->timestamp('consumed_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();

            $table->index(['booking_id', 'expires_at']);
        });

        Schema::create('partner_payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->char('currency', 3)->default('QAR');
            $table->string('status')->default('draft'); // draft | paid
            $table->timestamp('paid_at')->nullable();
            $table->text('note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['partner_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_payouts');
        Schema::dropIfExists('booking_payment_links');

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex(['partner_id', 'partner_commission_status']);
            $table->dropConstrainedForeignId('booked_by_user_id');
            $table->dropConstrainedForeignId('partner_id');
            $table->dropColumn([
                'partner_commission_type',
                'partner_commission_value',
                'partner_commission_amount',
                'partner_commission_status',
            ]);
        });
    }
};
