<?php

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

Route::view('/{any?}', 'app')->where('any', '.*');
