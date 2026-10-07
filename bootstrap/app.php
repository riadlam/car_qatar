<?php

use App\Http\Middleware\EnsureActiveChauffeur;
use App\Http\Middleware\EnsureActivePartner;
use App\Http\Middleware\EnsureCreateEmailGate;
use App\Http\Middleware\EnsureCustomer;
use App\Http\Middleware\EnsureCustomerOrPartner;
use App\Http\Middleware\SetApiLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api',
    )
    ->withBroadcasting(
        __DIR__.'/../routes/channels.php',
        ['prefix' => 'api', 'middleware' => ['auth:sanctum']],
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->api(prepend: [
            SetApiLocale::class,
        ]);
        $middleware->alias([
            'api.locale' => SetApiLocale::class,
            'customer' => EnsureCustomer::class,
            'customer.or.partner' => EnsureCustomerOrPartner::class,
            'chauffeur.active' => EnsureActiveChauffeur::class,
            'partner.active' => EnsureActivePartner::class,
            'create.email.gate' => EnsureCreateEmailGate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
