<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
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

        // Get all groups from database
        $groups = Group::all();
        $createdGroups = [];

        foreach ($groups as $group) {
            $createdGroups[$group->slug] = $group;
        }

        // Workflow groups that don't need chef users
        $workflowGroups = ['service-permis', 'barriere', 'gendarmerie'];

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

            // Create a chef (supervisor) for regular departments
            if (!in_array($slug, $workflowGroups)) {
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
            $createdGroups['informatique']->id,
            $createdGroups['rh']->id
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
        $multiRoleUser->groups()->sync([$createdGroups['securite']->id]);

        // Create workflow test users with specific credentials
        // Service des Permis user with direct login
        $sppUser = User::firstOrCreate(
            ['email' => 'spp@system.com'],
            [
                'username' => 'spp',
                'password' => Hash::make('SPP123!'),
                'display_name' => 'Service des Permis Reviewer',
                'is_active' => true,
                'email_verified_at' => now(),
                'password_last_set' => now(),
                'two_factor_enabled' => false,
            ]
        );
        $sppUser->roles()->sync([$userRole->id]);
        $sppUser->groups()->sync([$createdGroups['service-permis']->id]);

        // Barriere user with direct login
        $barriereUser = User::firstOrCreate(
            ['email' => 'barriere@system.com'],
            [
                'username' => 'barriere',
                'password' => Hash::make('Barriere123!'),
                'display_name' => 'Barrière Approver',
                'is_active' => true,
                'email_verified_at' => now(),
                'password_last_set' => now(),
                'two_factor_enabled' => false,
            ]
        );
        $barriereUser->roles()->sync([$userRole->id]);
        $barriereUser->groups()->sync([$createdGroups['barriere']->id]);

        // Gendarmerie user with direct login
        $gendarmerieUser = User::firstOrCreate(
            ['email' => 'gendarmerie@system.com'],
            [
                'username' => 'gendarmerie',
                'password' => Hash::make('Gendarmerie123!'),
                'display_name' => 'Gendarmerie Approver',
                'is_active' => true,
                'email_verified_at' => now(),
                'password_last_set' => now(),
                'two_factor_enabled' => false,
            ]
        );
        $gendarmerieUser->roles()->sync([$userRole->id]);
        $gendarmerieUser->groups()->sync([$createdGroups['gendarmerie']->id]);

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
        $inactiveUser->groups()->sync([$createdGroups['rh']->id]);

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
        $twoFactorUser->groups()->sync([$createdGroups['informatique']->id]);
    }
}
