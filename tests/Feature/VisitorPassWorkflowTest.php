<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\VisitorPass;
use Database\Seeders\GroupSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class VisitorPassWorkflowTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed the basic roles, groups and permissions
        $this->seed(RoleSeeder::class);
        $this->seed(GroupSeeder::class);
        $this->seed(PermissionSeeder::class);

        // Create necessary roles if not seeded properly
        $this->createRolesIfNeeded();

        // Create necessary groups if not seeded properly
        $this->createGroupsIfNeeded();

        // Link permissions to groups
        $this->assignPermissionsToGroups();
    }

    protected function createRolesIfNeeded(): void
    {
        if (!Role::where('slug', 'admin')->exists()) {
            Role::create(['name' => 'Administrator', 'slug' => 'admin']);
        }

        if (!Role::where('slug', 'chef')->exists()) {
            Role::create(['name' => 'Chef', 'slug' => 'chef']);
        }

        if (!Role::where('slug', 'user')->exists()) {
            Role::create(['name' => 'User', 'slug' => 'user']);
        }
    }

    protected function createGroupsIfNeeded(): void
    {
        $requiredGroups = [
            ['name' => 'IT Department', 'slug' => 'it-department'],
            ['name' => 'Human Resources', 'slug' => 'hr'],
            ['name' => 'Service des Permis', 'slug' => 'service-permis'],
            ['name' => 'Barrière', 'slug' => 'barriere'],
            ['name' => 'Gendarmerie', 'slug' => 'gendarmerie']
        ];

        foreach ($requiredGroups as $group) {
            if (!Group::where('slug', $group['slug'])->exists()) {
                Group::create([
                    'name' => $group['name'],
                    'slug' => $group['slug'],
                    'description' => $group['name'] . ' Department'
                ]);
            }
        }
    }

    protected function assignPermissionsToGroups(): void
    {
        // Service des Permis permissions
        $servicePermisGroup = Group::where('slug', 'service-permis')->first();
        if ($servicePermisGroup) {
            $servicePermisGroup->permissions()->syncWithoutDetaching(
                Permission::whereIn('slug', ['review-visitor-pass', 'view-all-visitor-passes'])->pluck('id')
            );
        }

        // Barrière permissions
        $barriereGroup = Group::where('slug', 'barriere')->first();
        if ($barriereGroup) {
            $barriereGroup->permissions()->syncWithoutDetaching(
                Permission::whereIn('slug', ['approve-visitor-pass', 'view-all-visitor-passes'])->pluck('id')
            );
        }

        // Gendarmerie permissions
        $gendarmerieGroup = Group::where('slug', 'gendarmerie')->first();
        if ($gendarmerieGroup) {
            $gendarmerieGroup->permissions()->syncWithoutDetaching(
                Permission::whereIn('slug', ['approve-visitor-pass', 'view-all-visitor-passes'])->pluck('id')
            );
        }

        // Department permissions
        $departmentGroups = Group::whereIn('slug', ['it-department', 'hr'])->get();
        foreach ($departmentGroups as $group) {
            $group->permissions()->syncWithoutDetaching(
                Permission::whereIn('slug', ['create-visitor-pass', 'view-all-visitor-passes'])->pluck('id')
            );
        }
    }

    protected function createUser(string $role, string $group): User
    {
        // Add a unique identifier to avoid duplicate username/email
        $uniqueId = uniqid();

        $user = User::create([
            'username' => "test_{$role}_{$group}_{$uniqueId}",
            'email' => "test_{$role}_{$group}_{$uniqueId}@example.com",
            'password' => Hash::make('password'),
            'display_name' => ucfirst($role) . ' ' . $group,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Attach role
        $roleModel = Role::where('slug', $role)->first();
        $user->roles()->attach($roleModel);

        // Attach group
        $groupModel = Group::where('slug', $group)->first();
        if ($groupModel) {
            $user->groups()->attach($groupModel);
        }

        return $user;
    }

    protected function createTestVisitorPass(User $creator): VisitorPass
    {
        return VisitorPass::create([
            'visit_date' => now()->addDay(),
            'visited_person' => 'John Doe',
            'unit' => 'Test Unit',
            'module' => 'Test Module',
            'visit_purpose' => 'Testing',
            'duration_type' => 'full_day',
            'duration_days' => null,
            'visitor_name' => 'Test Visitor',
            'id_number' => 'ID123456',
            'organization' => 'Test Organization',
            'category' => 'S-T',
            'status' => 'awaiting',
            'created_by' => $creator->id,
        ]);
    }

    protected function getAuthorizedUser(string $group): User
    {
        // Match group to the appropriate role
        $role = match ($group) {
            'service-permis', 'barriere', 'gendarmerie' => 'chef', // These specialized groups typically need chef role for workflow actions
            default => 'user'
        };

        return $this->createUser($role, $group);
    }
}
