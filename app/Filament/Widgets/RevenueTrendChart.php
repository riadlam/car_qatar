<?php

namespace App\Filament\Widgets;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use Filament\Widgets\ChartWidget;

class RevenueTrendChart extends ChartWidget
{
    protected static ?int $sort = 3;

    protected int | string | array $columnSpan = 1;

    protected ?string $heading = 'Revenue (7 days)';

    protected ?string $description = 'Completed paid trips, QAR';

    protected ?string $maxHeight = '260px';

    protected string $color = 'success';

    protected function getData(): array
    {
        $labels = [];
        $values = [];

        for ($i = 6; $i >= 0; $i--) {
            $day = now()->subDays($i)->startOfDay();
            $labels[] = $day->format('D j');
            $values[] = round((float) Booking::query()
                ->where('status', BookingStatus::Completed)
                ->where(function ($query) {
                    $query
                        ->where('payment_status', PaymentStatus::Paid)
                        ->orWhere('payment_status', PaymentStatus::Authorized);
                })
                ->whereDate('completed_at', $day)
                ->sum('total_amount'), 2);
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (QAR)',
                    'data' => $values,
                    'backgroundColor' => 'rgba(91, 5, 32, 0.75)',
                    'borderRadius' => 6,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
