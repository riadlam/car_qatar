<?php

use App\Http\Controllers\Api\MapConfigController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BillingProfileController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\CancellationReasonController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\Chauffeur\OfferController;
use App\Http\Controllers\Api\Chauffeur\ProfileController as ChauffeurProfileController;
use App\Http\Controllers\Api\Chauffeur\RideController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\RealtimeConfigController;
use App\Http\Controllers\Api\SavedGuestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Stateless JSON API used by the React frontend and future mobile apps.
| Authenticate with Bearer tokens issued by Sanctum (Authorization header).
|
*/

Route::get('/health', HealthController::class);
Route::get('/map-config', MapConfigController::class);
Route::get('/realtime-config', RealtimeConfigController::class);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])
        ->middleware('throttle:10,1');
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::patch('/email', [ProfileController::class, 'updateEmail']);
        Route::patch('/password', [ProfileController::class, 'updatePassword']);
        Route::delete('/account', [ProfileController::class, 'destroy']);
    });
});

Route::get('/service-types', [CatalogController::class, 'serviceTypes']);
Route::get('/vehicle-classes', [CatalogController::class, 'vehicleClasses']);
Route::get('/seat-addons', [CatalogController::class, 'seatAddons']);
Route::get('/gulf-destinations', [CatalogController::class, 'gulfDestinations']);
Route::get('/school-terms', [CatalogController::class, 'schoolTerms']);
Route::get('/contact-channels', [CatalogController::class, 'contactChannels']);
Route::get('/explore-places', [CatalogController::class, 'explorePlaces']);

Route::post('/locations/resolve', [LocationController::class, 'resolve'])
    ->middleware('throttle:30,1');

Route::post('/quotes', [QuoteController::class, 'store'])
    ->middleware('throttle:20,1');
Route::get('/quotes/{quote}', [QuoteController::class, 'show'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/payment-methods', [PaymentMethodController::class, 'index']);
    Route::post('/payment-methods', [PaymentMethodController::class, 'store'])
        ->middleware('throttle:10,1');
    Route::delete('/payment-methods/{paymentMethod}', [PaymentMethodController::class, 'destroy']);

    Route::get('/cancellation-reasons', [CancellationReasonController::class, 'index']);

    Route::get('/billing-profile', [BillingProfileController::class, 'show']);
    Route::put('/billing-profile', [BillingProfileController::class, 'upsert']);

    Route::get('/bookings', [BookingController::class, 'index'])->middleware('customer');
    Route::post('/bookings', [BookingController::class, 'store'])
        ->middleware(['customer', 'throttle:10,1']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show'])->middleware('customer');
    Route::get('/bookings/{booking}/track', [BookingController::class, 'track'])
        ->middleware(['customer', 'throttle:60,1']);
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->middleware('customer');

    Route::apiResource('saved-guests', SavedGuestController::class)
        ->except(['show']);

    Route::prefix('chauffeur')->middleware('chauffeur.active')->group(function () {
        Route::get('/offers', [OfferController::class, 'index']);
        Route::post('/offers/{offer}/accept', [OfferController::class, 'accept']);
        Route::post('/offers/{offer}/reject', [OfferController::class, 'reject']);
        Route::get('/profile', [ChauffeurProfileController::class, 'show']);
        Route::get('/rides', [RideController::class, 'index']);
        Route::post('/rides/{assignment}/status', [RideController::class, 'updateStatus'])
            ->middleware('throttle:30,1');
        Route::post('/rides/{assignment}/cancel', [RideController::class, 'cancel'])
            ->middleware('throttle:30,1');
        Route::post('/location', [RideController::class, 'storeLocation'])
            ->middleware('throttle:120,1');
    });
});
