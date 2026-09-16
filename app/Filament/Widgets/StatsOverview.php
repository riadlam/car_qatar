<?php

namespace App\Filament\Widgets;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Filament\Resources\Bookings\BookingResource;
use App\Filament\Resources\Chauffeurs\ChauffeurResource;
use App\Models\Booking;
use App\Models\Chauffeur;
use App\Models\RideOffer;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $weekAgo = now()->subDays(7);
        $todayStart = now()->startOfDay();
        $todayEnd = now()->endOfDay();

        $liveTrips = Booking::query()
            ->whereIn('status', [
                BookingStatus::ChauffeurAssigned,
                BookingStatus::InProgress,
            ])
            ->count();

        $pickupsToday = Booking::query()
            ->whereNotIn('status', [
                BookingStatus::Cancelled,
                BookingStatus::Draft,
            ])
            ->whereBetween('pickup_at', [$todayStart, $todayEnd])
            ->count();

        $pendingChauffeurs = Chauffeur::query()
            ->where('status', 'pending')
            ->count();

        $openOffers = RideOffer::query()
            ->whereIn('status', ['pending', 'offered'])
            ->count();

        $revenue7d = Booking::query()
            ->where('status', BookingStatus::Completed)
            ->where(function ($query) {
                $query
                    ->where('payment_status', PaymentStatus::Paid)
                    ->orWhere('payment_status', PaymentStatus::Authorized);
            })
            ->where('completed_at', '>=', $weekAgo)
            ->sum('total_amount');

        $cancelled7d = Booking::query()
            ->where('status', BookingStatus::Cancelled)
            ->where('cancelled_at', '>=', $weekAgo)
            ->count();

        return [
            Stat::make('Live trips', (string) $liveTrips)
                ->description('Assigned or in progress')
                ->descriptionIcon('heroicon-m-truck')
                ->color('primary')
                ->url(BookingResource::getUrl('index')),
            Stat::make('Pickups today', (string) $pickupsToday)
                ->description('Scheduled for today')
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color('success')
                ->url(BookingResource::getUrl('index')),
            Stat::make('Pending chauffeurs', (string) $pendingChauffeurs)
                ->description('Applications awaiting review')
                ->descriptionIcon('heroicon-m-user-plus')
                ->color('warning')
                ->url(ChauffeurResource::getUrl('index')),
            Stat::make('Open offers', (string) $openOffers)
                ->description('Waiting for a chauffeur')
                ->descriptionIcon('heroicon-m-bell-alert')
                ->color('info')
                ->url(BookingResource::getUrl('index')),
            Stat::make('Revenue (7 days)', number_format((float) $revenue7d, 2).' QAR')
                ->description('Completed & paid')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
            Stat::make('Cancelled (7 days)', (string) $cancelled7d)
                ->description('Last seven days')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger')
                ->url(BookingResource::getUrl('index')),
        ];
    }
}
