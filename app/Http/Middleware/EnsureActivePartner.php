<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActivePartner
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->role !== UserRole::PartnerAdmin) {
            abort(403, 'Only a partner account can access this.');
        }

        $partner = $user->partners()
            ->wherePivot('status', 'active')
            ->where('partners.status', 'active')
            ->first();

        if (! $partner) {
            abort(403, 'No active partner organization is linked to this account.');
        }

        $request->attributes->set('partner', $partner);

        return $next($request);
    }
}
