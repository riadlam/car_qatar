<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Dashboard;
use App\Filament\Widgets\BookingsTrendChart;
use App\Filament\Widgets\LatestBookings;
use App\Filament\Widgets\LiveTripsWidget;
use App\Filament\Widgets\NeedsAttentionWidget;
use App\Filament\Widgets\RevenueTrendChart;
use App\Filament\Widgets\StatsOverview;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Icons\Heroicon;
use Filament\View\PanelsRenderHook;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Blade;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName('AL MAJD')
            ->brandLogo(fn () => view('filament.brand-logo'))
            ->brandLogoHeight('2.75rem')
            ->favicon(asset('favicon.ico'))
            ->colors([
                'primary' => Color::hex('#5b0520'),
                'danger' => Color::Rose,
                'gray' => Color::Zinc,
                'info' => Color::Sky,
                'success' => Color::Emerald,
                'warning' => Color::Amber,
            ])
            ->sidebarCollapsibleOnDesktop()
            ->sidebarFullyCollapsibleOnDesktop()
            ->maxContentWidth('full')
            ->navigationGroups([
                NavigationGroup::make('Operations')
                    ->icon(Heroicon::OutlinedClipboardDocumentList)
                    ->collapsed(false),
                NavigationGroup::make('Catalog')
                    ->icon(Heroicon::OutlinedSquares2x2)
                    ->collapsed(false),
                NavigationGroup::make('Content')
                    ->icon(Heroicon::OutlinedDocumentText)
                    ->collapsed(false),
                NavigationGroup::make('Fleet')
                    ->icon(Heroicon::OutlinedTruck)
                    ->collapsed(),
                NavigationGroup::make('Geography')
                    ->icon(Heroicon::OutlinedGlobeAlt)
                    ->collapsed(),
                NavigationGroup::make('Pricing')
                    ->icon(Heroicon::OutlinedBanknotes)
                    ->collapsed(),
                NavigationGroup::make('Finance')
                    ->icon(Heroicon::OutlinedCreditCard)
                    ->collapsed(),
                NavigationGroup::make('People')
                    ->icon(Heroicon::OutlinedUsers)
                    ->collapsed(),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                StatsOverview::class,
                BookingsTrendChart::class,
                RevenueTrendChart::class,
                LiveTripsWidget::class,
                NeedsAttentionWidget::class,
                LatestBookings::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->renderHook(
                PanelsRenderHook::HEAD_END,
                fn (): string => Blade::render(<<<'BLADE'
                    @viteReactRefresh
                    @vite('resources/js/filament/adminMapboxPicker.jsx')
                BLADE),
            );
    }
}
