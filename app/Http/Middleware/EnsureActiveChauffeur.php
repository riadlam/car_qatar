<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveChauffeur
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $chauffeur = $user?->chauffeur;

        if ($user?->role !== UserRole::Chauffeur || $chauffeur?->status !== 'active') {
            abort(403, 'Only an approved chauffeur can access this.');
        }

        return $next($request);
    }
}
