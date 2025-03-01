<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DataSeeder extends Seeder
{
    public function run(): void
    {
        // Create or retrieve roles
        $userRole = Role::firstOrCreate(
            ['slug' => 'user'],
            ['name' => 'User']
        );

        $chefRole = Role::firstOrCreate(
            ['slug' => 'chef'],
            ['name' => 'Chef']
        );

        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Administrator']
        );

        // Create additional groups
        $groups = [
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

        $createdGroups = [];

        foreach ($groups as $groupData) {
            $group = Group::firstOrCreate(
                ['slug' => $groupData['slug']],
                $groupData
            );
            $createdGroups[$group->slug] = $group;
        }

        // Create users for each group
        foreach ($createdGroups as $slug => $group) {
            // Create a regular user for this group
            $user = User::firstOrCreate(
                ['email' => "user.{$slug}@system.com"],
                [
                    'username' => "user.{$slug}",
                    'password' => Hash::make('User123!'),
                    'display_name' => ucwords(str_replace('-', ' ', $slug)) . ' User',
                    'is_active' => true,
                    'email_verified_at' => now(),
                    'password_last_set' => now(),
                    'two_factor_enabled' => false,
                ]
            );
            $user->roles()->sync([$userRole->id]);
            $user->groups()->sync([$group->id]);

            // Create a chef (supervisor) for this group
            $chef = User::firstOrCreate(
                ['email' => "chef.{$slug}@system.com"],
                [
                    'username' => "chef.{$slug}",
                    'password' => Hash::make('Chef123!'),
                    'display_name' => ucwords(str_replace('-', ' ', $slug)) . ' Supervisor',
                    'is_active' => true,
                    'email_verified_at' => now(),
                    'password_last_set' => now(),
                    'two_factor_enabled' => false,
                ]
            );
            $chef->roles()->sync([$chefRole->id]);
            $chef->groups()->sync([$group->id]);
        }

        // Create a multi-group user
        $multiGroupUser = User::firstOrCreate(
            ['email' => 'multi.group@system.com'],
            [
                'username' => 'multigroup',
                'password' => Hash::make('User123!'),
                'display_name' => 'Multi-Group User',
                'is_active' => true,
                'email_verified_at' => now(),
                'password_last_set' => now(),
                'two_factor_enabled' => false,
            ]
        );
        $multiGroupUser->roles()->sync([$userRole->id]);
        $multiGroupUser->groups()->attach([
            $createdGroups['it-department']->id,
            $createdGroups['hr']->id
        ]);

        // Create a multi-role user
        $multiRoleUser = User::firstOrCreate(
            ['email' => 'multi.role@system.com'],
            [
                'username' => 'multirole',
                'password' => Hash::make('User123!'),
                'display_name' => 'Multi-Role User',
                'is_active' => true,
                'email_verified_at' => now(),
                'password_last_set' => now(),
                'two_factor_enabled' => false,
            ]
        );
        $multiRoleUser->roles()->sync([$userRole->id, $chefRole->id]);
        $multiRoleUser->groups()->sync([$createdGroups['security']->id]);

        // Create an inactive user
        $inactiveUser = User::firstOrCreate(
            ['email' => 'inactive@system.com'],
            [
                'username' => 'inactive',
                'password' => Hash::make('User123!'),
                'display_name' => 'Inactive User',
                'is_active' => false,
                'email_verified_at' => now(),
                'password_last_set' => now(),
                'two_factor_enabled' => false,
            ]
        );
        $inactiveUser->roles()->sync([$userRole->id]);
        $inactiveUser->groups()->sync([$createdGroups['hr']->id]);

        // Create a 2FA-enabled user
        $twoFactorUser = User::firstOrCreate(
            ['email' => '2fa@system.com'],
            [
                'username' => 'twofa',
                'password' => Hash::make('User123!'),
                'display_name' => '2FA User',
                'is_active' => true,
                'email_verified_at' => now(),
                'password_last_set' => now(),
                'two_factor_enabled' => true,
            ]
        );
        $twoFactorUser->roles()->sync([$userRole->id]);
        $twoFactorUser->groups()->sync([$createdGroups['it-department']->id]);
    }
}
