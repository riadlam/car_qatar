<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\BookingsTrendChart;
use App\Filament\Widgets\LatestBookings;
use App\Filament\Widgets\LiveTripsWidget;
use App\Filament\Widgets\NeedsAttentionWidget;
use App\Filament\Widgets\RevenueTrendChart;
use App\Filament\Widgets\StatsOverview;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Support\Icons\Heroicon;

class Dashboard extends BaseDashboard
{
    protected static string | \BackedEnum | null $navigationIcon = Heroicon::OutlinedHome;

    protected static ?string $navigationLabel = 'Ops';

    protected static ?string $title = 'Ops';

    protected ?string $heading = 'AL MAJD Ops';

    protected ?string $subheading = 'Live bookings, fleet, and revenue';

    /**
     * @return array<class-string<\Filament\Widgets\Widget>|\Filament\Widgets\WidgetConfiguration>
     */
    public function getWidgets(): array
    {
        return [
            StatsOverview::class,
            BookingsTrendChart::class,
            RevenueTrendChart::class,
            LiveTripsWidget::class,
            NeedsAttentionWidget::class,
            LatestBookings::class,
        ];
    }

    /**
     * @return int | array<string, ?int>
     */
    public function getColumns(): int | array
    {
        return [
            'default' => 1,
            'md' => 2,
            'xl' => 2,
        ];
    }
}
