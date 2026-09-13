<?php

namespace App\Filament\Widgets;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\QuoteStatus;
use App\Models\Booking;
use App\Models\Chauffeur;
use App\Models\Payment;
use App\Models\Quote;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $today = now()->startOfDay();
        $weekAgo = now()->subWeek();

        $bookingsToday = Booking::query()
            ->whereDate('created_at', $today)
            ->count();

        $upcoming = Booking::query()
            ->whereIn('status', [
                BookingStatus::Confirmed,
                BookingStatus::ChauffeurAssigned,
                BookingStatus::PendingPayment,
            ])
            ->where('pickup_at', '>=', now())
            ->count();

        $cancelledWeek = Booking::query()
            ->where('status', BookingStatus::Cancelled)
            ->where('cancelled_at', '>=', $weekAgo)
            ->count();

        $openQuotes = Quote::query()
            ->where('status', QuoteStatus::Priced)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->count();

        $pendingPayments = Payment::query()
            ->where('status', PaymentStatus::Pending)
            ->sum('amount');

        $activeChauffeurs = Chauffeur::query()
            ->where('status', 'active')
            ->count();

        return [
            Stat::make('Bookings today', (string) $bookingsToday)
                ->description('Created since midnight')
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color('primary'),
            Stat::make('Upcoming confirmed', (string) $upcoming)
                ->description('Confirmed / assigned ahead')
                ->descriptionIcon('heroicon-m-clock')
                ->color('success'),
            Stat::make('Cancelled (7 days)', (string) $cancelledWeek)
                ->description('Last week')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),
            Stat::make('Open quotes', (string) $openQuotes)
                ->description('Priced & not expired')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('warning'),
            Stat::make('Pending payments', number_format((float) $pendingPayments, 2))
                ->description('Awaiting capture')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('info'),
            Stat::make('Active chauffeurs', (string) $activeChauffeurs)
                ->description('Fleet online-ready')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('primary'),
        ];
    }
}
