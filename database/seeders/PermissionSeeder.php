<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Group;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Visitor Pass permissions
            [
                'name' => 'Create Visitor Pass',
                'slug' => 'create-visitor-pass',
                'description' => 'Can create new visitor passes'
            ],
            [
                'name' => 'Review Visitor Pass',
                'slug' => 'review-visitor-pass',
                'description' => 'Can review visitor pass applications'
            ],
            [
                'name' => 'Approve Visitor Pass',
                'slug' => 'approve-visitor-pass',
                'description' => 'Can approve visitor passes'
            ],
            [
                'name' => 'Reject Visitor Pass',
                'slug' => 'reject-visitor-pass',
                'description' => 'Can reject visitor passes'
            ],
            [
                'name' => 'View All Visitor Passes',
                'slug' => 'view-all-visitor-passes',
                'description' => 'Can view all visitor passes'
            ],
            // User management permissions
            [
                'name' => 'Manage Users',
                'slug' => 'manage-users',
                'description' => 'Can manage user accounts'
            ],
            [
                'name' => 'Manage Groups',
                'slug' => 'manage-groups',
                'description' => 'Can manage groups'
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        // Assign permissions to groups
        $this->assignPermissionsToGroups();
    }

    private function assignPermissionsToGroups(): void
    {
        // Service des Permis permissions
        $servicePermis = Group::where('slug', 'service-permis')->first();
        if ($servicePermis) {
            $servicePermis->permissions()->sync(
                Permission::whereIn('slug', [
                    'create-visitor-pass',
                    'review-visitor-pass',
                    'approve-visitor-pass',
                    'reject-visitor-pass',
                    'view-all-visitor-passes'
                ])->pluck('id')
            );
        }

        // Barrière permissions
        $barriere = Group::where('slug', 'barriere')->first();
        if ($barriere) {
            $barriere->permissions()->sync(
                Permission::whereIn('slug', [
                    'view-all-visitor-passes'
                ])->pluck('id')
            );
        }

        // Gendarmerie permissions
        $gendarmerie = Group::where('slug', 'gendarmerie')->first();
        if ($gendarmerie) {
            $gendarmerie->permissions()->sync(
                Permission::whereIn('slug', [
                    'view-all-visitor-passes',
                    'review-visitor-pass',
                    'approve-visitor-pass',
                    'reject-visitor-pass'
                ])->pluck('id')
            );
        }

        // IT Department permissions
        $itDepartment = Group::where('slug', 'it-department')->first();
        if ($itDepartment) {
            $itDepartment->permissions()->sync(
                Permission::whereIn('slug', [
                    'manage-users',
                    'manage-groups',
                    'view-all-visitor-passes'
                ])->pluck('id')
            );
        }

        // Security permissions
        $security = Group::where('slug', 'security')->first();
        if ($security) {
            $security->permissions()->sync(
                Permission::whereIn('slug', [
                    'view-all-visitor-passes',
                    'review-visitor-pass'
                ])->pluck('id')
            );
        }

        // HR permissions
        $hr = Group::where('slug', 'hr')->first();
        if ($hr) {
            $hr->permissions()->sync(
                Permission::whereIn('slug', [
                    'create-visitor-pass',
                    'view-all-visitor-passes'
                ])->pluck('id')
            );
        }
    }
}
