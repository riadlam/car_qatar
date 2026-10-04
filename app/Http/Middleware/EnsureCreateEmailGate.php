<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCreateEmailGate
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->get('create_email_authed')) {
            return redirect()->route('create-email.login');
        }

        return $next($request);
    }
}
