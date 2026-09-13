<?php

namespace Database\Seeders;

use App\Models\CancellationReason;
use Illuminate\Database\Seeder;

class CancellationReasonSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['customer', 'Change of plans', 1],
            ['customer', 'Booked by mistake', 2],
            ['customer', 'Pickup time no longer works', 3],
            ['customer', 'Found another way to travel', 4],
            ['chauffeur', 'Vehicle problem', 1],
            ['chauffeur', 'Cannot reach the pickup', 2],
            ['chauffeur', 'Passenger did not show', 3],
            ['chauffeur', 'Unable to continue this trip', 4],
        ];

        foreach ($rows as [$audience, $label, $sort]) {
            CancellationReason::query()->updateOrCreate(
                ['audience' => $audience, 'label' => $label],
                ['sort_order' => $sort, 'is_active' => true],
            );
        }
    }
}
