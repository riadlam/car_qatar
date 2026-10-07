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
            abort(403, __('api.middleware.partner_only'));
        }

        $partner = $user->partners()
            ->wherePivot('status', 'active')
            ->where('partners.status', 'active')
            ->first();

        if (! $partner) {
            abort(403, __('api.middleware.partner_inactive'));
        }

        $request->attributes->set('partner', $partner);

        return $next($request);
    }
}
