<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Create some additional groups
        $additionalGroups = [
            [
                'name' => 'IT Department',
                'slug' => 'it-department',
                'description' => 'Information Technology team'
            ],
            [
                'name' => 'Human Resources',
                'slug' => 'hr',
                'description' => 'Human Resources department'
            ],
            [
                'name' => 'Maintenance',
                'slug' => 'maintenance',
                'description' => 'Maintenance and facilities team'
            ],
            [
                'name' => 'Security',
                'slug' => 'security',
                'description' => 'Security personnel'
            ]
        ];

        foreach ($additionalGroups as $group) {
            Group::firstOrCreate(
                ['slug' => $group['slug']],
                $group
            );
        }

        // Create 20 random users
        for ($i = 0; $i < 20; $i++) {
            $firstName = $faker->firstName;
            $lastName = $faker->lastName;

            $user = User::create([
                'username' => strtolower($firstName . '.' . $lastName),
                'email' => strtolower($firstName . '.' . $lastName . '@example.com'),
                'password' => Hash::make('password123'),
                'display_name' => $firstName . ' ' . $lastName,
                'is_active' => $faker->boolean(80), // 80% chance of being active
                'email_verified_at' => $faker->boolean(90) ? now() : null, // 90% chance of being verified
                'password_last_set' => now(),
                'two_factor_enabled' => $faker->boolean(20), // 20% chance of having 2FA enabled
            ]);

            // Randomly assign 1-3 groups to each user
            $randomGroups = Group::inRandomOrder()
                ->take($faker->numberBetween(1, 3))
                ->get();

            $user->groups()->attach($randomGroups);
        }
    }
}
