<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'Administrator', 'slug' => 'admin']);
        Role::firstOrCreate(['name' => 'Chef', 'slug' => 'chef']);
        Role::firstOrCreate(['name' => 'User', 'slug' => 'user']);
    }
}
