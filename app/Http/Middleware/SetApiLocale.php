<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetApiLocale
{
    /** @var list<string> */
    private const ALLOWED = ['en', 'ar'];

    public function handle(Request $request, Closure $next): Response
    {
        App::setLocale($this->resolveLocale($request));

        return $next($request);
    }

    private function resolveLocale(Request $request): string
    {
        $fromHeader = $this->localeFromAcceptLanguage($request->header('Accept-Language'));
        if ($fromHeader !== null) {
            return $fromHeader;
        }

        $user = Auth::guard('sanctum')->user();
        $userLanguage = is_string($user?->language) ? strtolower($user->language) : null;
        if ($userLanguage !== null && in_array($userLanguage, self::ALLOWED, true)) {
            return $userLanguage;
        }

        return 'en';
    }

    private function localeFromAcceptLanguage(?string $header): ?string
    {
        if ($header === null || trim($header) === '') {
            return null;
        }

        $first = trim(explode(',', $header)[0]);
        $tag = strtolower(trim(explode(';', $first)[0]));
        $primary = explode('-', $tag)[0];

        return in_array($primary, self::ALLOWED, true) ? $primary : null;
    }
}
