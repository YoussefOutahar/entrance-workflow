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
                'description' => 'Can review visitor pass applications (Service des Permis)'
            ],
            [
                'name' => 'Approve Visitor Pass',
                'slug' => 'approve-visitor-pass',
                'description' => 'Can give final approval to visitor passes (Barriere/Gendarmerie)'
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
        // Service des Permis permissions - they review after chef approval
        $servicePermis = Group::where('slug', 'service-permis')->first();
        if ($servicePermis) {
            $servicePermis->permissions()->sync(
                Permission::whereIn('slug', [
                    'review-visitor-pass',
                    'view-all-visitor-passes'
                ])->pluck('id')
            );
        }

        // Barrière permissions - they give final approval
        $barriere = Group::where('slug', 'barriere')->first();
        if ($barriere) {
            $barriere->permissions()->sync(
                Permission::whereIn('slug', [
                    'approve-visitor-pass',
                    'view-all-visitor-passes'
                ])->pluck('id')
            );
        }

        // Gendarmerie permissions - they can also give final approval
        $gendarmerie = Group::where('slug', 'gendarmerie')->first();
        if ($gendarmerie) {
            $gendarmerie->permissions()->sync(
                Permission::whereIn('slug', [
                    'approve-visitor-pass',
                    'view-all-visitor-passes'
                ])->pluck('id')
            );
        }

        // All department groups need create permission
        $departmentGroups = [
            'administration',
            'finances',
            'logistique',
            'rh',
            'informatique',
            'operations',
            'laboratoire',
            'securite',
            'maintenance',
            'formation',
            'communication',
            'juridique',
            'qualite'
        ];

        foreach ($departmentGroups as $groupSlug) {
            $group = Group::where('slug', $groupSlug)->first();
            if ($group) {
                $group->permissions()->sync(
                    Permission::whereIn('slug', [
                        'create-visitor-pass',
                        'view-all-visitor-passes'
                    ])->pluck('id')
                );
            }
        }

        // IT Department also needs management permissions
        $itDepartment = Group::where('slug', 'informatique')->first();
        if ($itDepartment) {
            $itDepartment->permissions()->syncWithoutDetaching(
                Permission::whereIn('slug', [
                    'manage-users',
                    'manage-groups'
                ])->pluck('id')
            );
        }
    }
}
