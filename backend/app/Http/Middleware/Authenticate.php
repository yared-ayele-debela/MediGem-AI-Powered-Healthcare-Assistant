<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API routes or JSON requests, return null to prevent redirect
        // The exception handler will catch AuthenticationException and return JSON
        if ($request->is('api/*') || $request->expectsJson()) {
            return null;
        }

        // This should never be reached for API-only apps, but just in case
        return null;
    }
}

