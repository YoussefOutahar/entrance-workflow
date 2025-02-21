<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator']
        );

        if (!User::where('email', 'admin@example.com')->exists()) {
            $user = User::create([
                'username' => 'admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('admin123'),
                'display_name' => 'System Administrator',
                'is_active' => true,
                'password_last_set' => now(),
            ]);

            // Attach admin role to user
            $user->roles()->attach($adminRole);
        }
    }
}
