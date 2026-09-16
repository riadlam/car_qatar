<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;

class BookingsTrendChart extends ChartWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 1;

    protected ?string $heading = 'Bookings (7 days)';

    protected ?string $description = 'New bookings created each day';

    protected ?string $maxHeight = '260px';

    protected string $color = 'primary';

    protected function getData(): array
    {
        $labels = [];
        $values = [];

        for ($i = 6; $i >= 0; $i--) {
            $day = now()->subDays($i)->startOfDay();
            $labels[] = $day->format('D j');
            $values[] = Booking::query()
                ->whereDate('created_at', $day)
                ->count();
        }

        return [
            'datasets' => [
                [
                    'label' => 'Bookings',
                    'data' => $values,
                    'borderColor' => '#5b0520',
                    'backgroundColor' => 'rgba(91, 5, 32, 0.12)',
                    'fill' => true,
                    'tension' => 0.35,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
