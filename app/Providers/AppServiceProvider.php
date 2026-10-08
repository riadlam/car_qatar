<?php

namespace App\Providers;

use App\Mail\Transport\CpanelBridgeTransport;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Mail::extend('cpanel_bridge', function () {
            return new CpanelBridgeTransport(
                bridgeUrl: (string) config('services.cpanel.bridge_url'),
                bridgeSecret: (string) config('services.cpanel.bridge_secret'),
                smtpUsername: (string) config('mail.mailers.smtp.username'),
                smtpPassword: (string) config('mail.mailers.smtp.password'),
                fromEmail: (string) config('mail.from.address'),
                fromName: (string) config('mail.from.name'),
            );
        });
    }
}
