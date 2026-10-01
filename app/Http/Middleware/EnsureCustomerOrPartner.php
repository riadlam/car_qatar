<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCustomerOrPartner
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $role = $user?->role;

        if ($role === UserRole::Customer) {
            return $next($request);
        }

        if ($role === UserRole::PartnerAdmin) {
            $ok = $user->partners()
                ->wherePivot('status', 'active')
                ->where('partners.status', 'active')
                ->exists();

            if ($ok) {
                return $next($request);
            }
        }

        abort(403, 'Only a customer or partner account can book.');
    }
}
