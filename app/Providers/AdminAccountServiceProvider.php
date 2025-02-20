<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\ServiceProvider;

class AdminAccountServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Only run in non-console environment
        if (!$this->app->runningInConsole()) {
            $this->ensureAdminExists();
        }
    }

    private function ensureAdminExists(): void
    {
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'username' => 'admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
                'display_name' => 'System Administrator',
                'given_name' => 'Admin',
                'surname' => 'User',
                'is_active' => true,
                'employee_id' => 'ADMIN001',
                'department' => 'Administration',
                'title' => 'System Administrator',
            ]);
        }
    }
}
