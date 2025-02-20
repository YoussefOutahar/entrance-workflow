<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\FileController;
use App\Http\Controllers\API\VisitorPassController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh-token', [AuthController::class, 'refresh']);
        Route::get('/user', [AuthController::class, 'user']);


        Route::apiResource('visitor-passes', VisitorPassController::class);
        Route::post('visitor-passes/{visitorPass}/files', [FileController::class, 'store']);
        Route::delete('files/{file}', [FileController::class, 'destroy']);
    });
});
