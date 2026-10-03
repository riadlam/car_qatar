<?php

use App\Http\Controllers\Auth\GoogleAuthController;
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

Route::view('/{any?}', 'app')->where('any', '^(?!admin(?:/|$)|livewire(?:/|$)|filament(?:/|$)|auth/google(?:/|$)).*$');
