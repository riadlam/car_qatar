<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $email = env('SUPER_ADMIN_EMAIL', 'superadmin@almajd.local');
        $password = env('SUPER_ADMIN_PASSWORD', 'ChangeMeNow!123');
        $name = env('SUPER_ADMIN_NAME', 'Super Admin');

        $superAdmin = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => $password,
                'account_type' => 'individual',
                'title' => 'Mr.',
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'company_name' => null,
                'phone' => null,
                'preferred_language' => 'en',
                'street_address' => null,
                'language' => 'en',
                'marketing_emails' => false,
                'booking_notifications' => 'email',
                'status' => 'active',
            ],
        );
        $superAdmin->forceFill([
            'role' => UserRole::SuperAdmin,
            'email_verified_at' => now(),
        ])->save();

        $customer = User::updateOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Test Customer',
                'password' => 'password',
                'account_type' => 'individual',
                'title' => 'Mr.',
                'first_name' => 'Test',
                'last_name' => 'Customer',
                'status' => 'active',
            ],
        );
        $customer->forceFill(['role' => UserRole::Customer])->save();

        $this->call(CancellationReasonSeeder::class);
        $this->call(CatalogSeeder::class);
        $this->call(ExplorePlaceSeeder::class);
        $this->call(MapSettingSeeder::class);
        $this->call(DemoOpsSeeder::class);
    }
}
