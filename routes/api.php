<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\FileController;
use App\Http\Controllers\API\VisitorPassController;
use App\Http\Controllers\API\VisitorPassWorkflowController;
use App\Http\Controllers\API\ActivityController;
use App\Http\Controllers\API\UserProfileController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\TwoFactorAuthController;
use App\Http\Middleware\EnsureUserHasRole;

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::middleware(['throttle:6,1'])->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // Password reset routes
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
});

// Protected routes requiring authentication
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth management routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh-token', [AuthController::class, 'refresh']);
        Route::get('/user', [AuthController::class, 'user']);

        // User profile routes
        Route::get('/users/profile', [UserProfileController::class, 'show']);
        Route::put('/users/{user}/profile', [UserProfileController::class, 'update']);
        Route::put('/users/{user}/password', [UserProfileController::class, 'changePassword']);

        // Email verification routes
        Route::prefix('email')->group(function () {
            Route::post('/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail'])
                ->middleware(['throttle:6,1']);
            Route::get('/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
                ->name('verification.verify');
        });

        // Two-factor authentication routes
        Route::prefix('2fa')->group(function () {
            Route::post('/enable', [TwoFactorAuthController::class, 'enable']);
            Route::post('/confirm', [TwoFactorAuthController::class, 'confirm']);
            Route::post('/disable', [TwoFactorAuthController::class, 'disable']);
        });
    });

    // Admin routes
    Route::middleware(EnsureUserHasRole::class . ':admin')->group(function () {
        // Add admin specific routes here
    });

    // Chef routes
    Route::middleware(EnsureUserHasRole::class . ':chef')->group(function () {
        // Add chef specific routes here
    });

    // Routes for both admin and chef
    Route::middleware(EnsureUserHasRole::class . ':admin,chef')->group(function () {
        // Add shared admin/chef routes here
    });

    // Visitor pass management routes
    Route::prefix('api')->group(function () {
        Route::apiResource('visitor-passes', VisitorPassController::class);

        // File management for visitor passes
        Route::post('visitor-passes/{visitorPass}/files', [FileController::class, 'store']);
        Route::delete('files/{file}', [FileController::class, 'destroy']);

        Route::get('activities', [ActivityController::class, 'index']);
        Route::post('visitor-passes/{visitorPass}/comments', [ActivityController::class, 'addComment']);
        Route::get('visitor-passes/{visitorPass}/timeline', [ActivityController::class, 'getVisitorPassTimeline']);

        // Enhanced visitor pass workflow routes
        Route::prefix('visitor-passes')->group(function () {
            Route::post('{visitorPass}/status', [VisitorPassWorkflowController::class, 'updateStatus']);
            Route::get('{visitorPass}/available-actions', [VisitorPassWorkflowController::class, 'getAvailableActions']);
            Route::get('{visitorPass}/workflow-history', [VisitorPassWorkflowController::class, 'getWorkflowHistory']);

            // File management routes
            Route::post('{visitorPass}/files', [FileController::class, 'store']);
            Route::delete('files/{file}', [FileController::class, 'destroy']);
        });
    });
});

// A catch-all route for undefined API routes
Route::fallback(function () {
    return response()->json([
        'message' => 'Route not found.',
    ], 404);
});
