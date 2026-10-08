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

        $status = $chauffeur?->status;
        $allowed = in_array($status, ['active', 'paused'], true);

        if ($user?->role !== UserRole::Chauffeur || ! $allowed) {
            abort(403, __('api.middleware.chauffeur_only'));
        }

        return $next($request);
    }
}
