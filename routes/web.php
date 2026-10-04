<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CreateEmailController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Serves the React SPA shell. All frontend routing is handled by React Router.
| API communication lives under /api (see routes/api.php).
|
*/

Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])
    ->middleware('throttle:20,1');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->middleware('throttle:20,1');

Route::prefix('create_email')->group(function () {
    Route::get('/login', [CreateEmailController::class, 'showLogin'])
        ->name('create-email.login');
    Route::post('/login', [CreateEmailController::class, 'login'])
        ->middleware('throttle:10,1')
        ->name('create-email.login.submit');
    Route::post('/logout', [CreateEmailController::class, 'logout'])
        ->name('create-email.logout');

    Route::middleware('create.email.gate')->group(function () {
        Route::get('/', [CreateEmailController::class, 'index'])
            ->name('create-email.index');
        Route::post('/', [CreateEmailController::class, 'store'])
            ->middleware('throttle:10,1')
            ->name('create-email.store');
        Route::post('/password', [CreateEmailController::class, 'updatePassword'])
            ->middleware('throttle:10,1')
            ->name('create-email.password');
    });
});

Route::view('/{any?}', 'app')->where('any', '^(?!admin(?:/|$)|livewire(?:/|$)|filament(?:/|$)|auth/google(?:/|$)|create_email(?:/|$)).*$');
