<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Role;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'is_active' => true,
            'password_last_set' => now(),
        ]);

        $userRole = Role::where('slug', 'user')->first();
        $user->roles()->attach($userRole);

        $token = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User successfully registered',
            'data' => [
                'user' => $user,
                'token' => $token,
                'refreshToken' => $refreshToken,
            ]
        ], Response::HTTP_CREATED);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            $user = User::where('email', $request->email)->firstOrFail();

            if (!$user->is_active) {
                throw ValidationException::withMessages([
                    'email' => ['This account has been deactivated.'],
                ]);
            }

            // Revoke all existing tokens
            $user->tokens()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;
            $refreshToken = $user->createToken('refresh_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged in',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'refreshToken' => $refreshToken,
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authentication failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function logout(): JsonResponse
    {
        Auth::user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh(): JsonResponse
    {
        $user = Auth::user();

        // Revoke all existing tokens except the current one
        $user->tokens()->where('id', '!=', Auth::user()->currentAccessToken()->id)->delete();

        $token = $user->createToken('auth_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Token successfully refreshed',
            'data' => [
                'token' => $token,
                'refreshToken' => $refreshToken,
            ]
        ]);
    }

    public function user(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => Auth::user()
            ]
        ]);
    }
}
