<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user() || !$request->user()->hasAnyRole($roles)) {
            return response()->json([
                'message' => 'Unauthorized access'
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
