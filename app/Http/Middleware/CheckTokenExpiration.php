<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\TransientToken;

class CheckTokenExpiration
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()->currentAccessToken() instanceof TransientToken) {
            return $next($request);
        }

        $tokenCreatedAt = $request->user()->currentAccessToken()->created_at;
        $expirationMinutes = config('sanctum.expiration') ?? 60;

        if ($tokenCreatedAt->addMinutes($expirationMinutes)->isPast()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token has expired',
            ], 401);
        }

        return $next($request);
    }
}
