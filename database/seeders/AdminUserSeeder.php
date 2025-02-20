<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
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
