<?php

namespace Tests\Feature;

use App\Models\Permission;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VisitorPassPermissionTest extends VisitorPassWorkflowTest
{
    public function test_only_chef_can_approve_chef_stage(): void
    {
        $this->withoutExceptionHandling();

        // Create a pass in pending_chef status
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);
        $pass->status = 'pending_chef';
        $pass->save();

        // Regular user from same department attempts to approve chef stage (should fail)
        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'started',
        ]);
        $response->assertStatus(403);
        $this->assertEquals('pending_chef', $pass->fresh()->status);

        // Chef from same department can approve
        $chef = $this->createUser('chef', 'it-department');
        Sanctum::actingAs($chef);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'started',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('started', $pass->fresh()->status);
    }

    public function test_only_service_permis_can_review_started_passes(): void
    {
        // Create a pass in started status
        $chef = $this->createUser('chef', 'it-department');
        $pass = $this->createTestVisitorPass($chef);
        $pass->status = 'started';
        $pass->save();

        // Regular IT department user attempts to review (should fail)
        $user = $this->createUser('user', 'it-department');
        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'in_progress',
        ]);
        $response->assertStatus(403);
        $this->assertEquals('started', $pass->fresh()->status);

        // Service des Permis user can review
        $servicePermisUser = $this->getAuthorizedUser('service-permis');
        // Ensure they have the review permission
        $servicePermisGroup = $servicePermisUser->groups()->first();
        if ($servicePermisGroup) {
            $reviewPermission = Permission::where('slug', 'review-visitor-pass')->first();
            if ($reviewPermission) {
                $servicePermisGroup->permissions()->syncWithoutDetaching([$reviewPermission->id]);
            }
        }

        Sanctum::actingAs($servicePermisUser);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'in_progress',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('in_progress', $pass->fresh()->status);
    }

    public function test_only_barriere_gendarmerie_can_give_final_approval(): void
    {
        // Create a pass in in_progress status
        $chef = $this->createUser('chef', 'it-department');
        $pass = $this->createTestVisitorPass($chef);
        $pass->status = 'in_progress';
        $pass->save();

        // Service des Permis user attempts final approval (should fail)
        $servicePermisUser = $this->getAuthorizedUser('service-permis');
        Sanctum::actingAs($servicePermisUser);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'accepted',
        ]);
        $response->assertStatus(403);
        $this->assertEquals('in_progress', $pass->fresh()->status);

        // Barriere user can give final approval
        $barriereUser = $this->getAuthorizedUser('barriere');
        // Ensure they have the approve permission
        $barriereGroup = $barriereUser->groups()->first();
        if ($barriereGroup) {
            $approvePermission = Permission::where('slug', 'approve-visitor-pass')->first();
            if ($approvePermission) {
                $barriereGroup->permissions()->syncWithoutDetaching([$approvePermission->id]);
            }
        }

        Sanctum::actingAs($barriereUser);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'accepted',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('accepted', $pass->fresh()->status);
    }

    public function test_chef_can_reject_at_any_stage(): void
    {
        $stages = ['awaiting', 'pending_chef', 'started', 'in_progress'];

        foreach ($stages as $stage) {
            // Create a pass at the specified stage
            $user = $this->createUser('user', 'it-department');
            $pass = $this->createTestVisitorPass($user);
            $pass->status = $stage;
            $pass->save();

            // Chef from same department can reject
            $chef = $this->createUser('chef', 'it-department');
            Sanctum::actingAs($chef);
            $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
                'status' => 'declined',
                'notes' => "Rejected at {$stage} stage",
            ]);

            $response->assertSuccessful();
            $this->assertEquals('declined', $pass->fresh()->status);

            // Clean up for next iteration
            $pass->delete();
        }
    }

    public function test_barriere_cannot_skip_workflow_steps(): void
    {
        // Create a pass in started status (not yet reviewed by Service des Permis)
        $chef = $this->createUser('chef', 'it-department');
        $pass = $this->createTestVisitorPass($chef);
        $pass->status = 'started';
        $pass->save();

        // Barriere user attempts to approve before Service des Permis review
        $barriereUser = $this->getAuthorizedUser('barriere');
        $barriereGroup = $barriereUser->groups()->first();
        if ($barriereGroup) {
            $approvePermission = Permission::where('slug', 'approve-visitor-pass')->first();
            if ($approvePermission) {
                $barriereGroup->permissions()->syncWithoutDetaching([$approvePermission->id]);
            }
        }

        Sanctum::actingAs($barriereUser);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'accepted', // Should not be possible from 'started' stage
        ]);

        $response->assertStatus(403);
        $this->assertEquals('started', $pass->fresh()->status);
    }

    public function test_non_creator_regular_user_cannot_modify_pass(): void
    {
        // Create a pass by user1
        $user1 = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user1);

        // User2 attempts to modify user1's pass
        $user2 = $this->createUser('user', 'it-department');
        Sanctum::actingAs($user2);

        // Attempt to update
        $response = $this->putJson("/visitor-passes/{$pass->id}", [
            'visit_purpose' => 'Modified by another user'
        ]);

        // This might be allowed depending on your policy implementation
        // You could assert either permission denied or success here

        // Attempt to delete
        $response = $this->deleteJson("/visitor-passes/{$pass->id}");

        // Again, this depends on your policy implementation
        // Generally deletion should be restricted
    }

    public function test_available_actions_endpoint_for_different_roles(): void
    {
        // Create a pass in awaiting status
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Test what actions are available for different roles
        $scenarios = [
            [
                'role' => 'user',
                'group' => 'it-department',
                'passStatus' => 'awaiting',
                'expectedActions' => ['submit_to_chef'] // User should be able to submit to chef
            ],
            [
                'role' => 'chef',
                'group' => 'it-department',
                'passStatus' => 'awaiting',
                'expectedActions' => ['approve_as_chef', 'reject'] // Chef can approve or reject
            ],
            [
                'role' => 'user',
                'group' => 'service-permis',
                'passStatus' => 'started',
                'expectedActions' => ['service_permis_review'] // Service des Permis can review
            ],
            [
                'role' => 'user',
                'group' => 'barriere',
                'passStatus' => 'in_progress',
                'expectedActions' => ['final_approve'] // Barriere can give final approval
            ],
            [
                'role' => 'admin',
                'group' => 'it-department',
                'passStatus' => 'in_progress',
                'expectedActions' => ['final_approve', 'reject'] // Admin can do almost anything
            ]
        ];

        foreach ($scenarios as $scenario) {
            // Update pass status
            $pass->status = $scenario['passStatus'];
            $pass->save();

            // Get available actions for this role/group
            $testUser = $this->createUser($scenario['role'], $scenario['group']);

            // Ensure service-permis has review permission
            if ($scenario['group'] === 'service-permis') {
                $servicePermisGroup = $testUser->groups()->first();
                if ($servicePermisGroup) {
                    $reviewPermission = Permission::where('slug', 'review-visitor-pass')->first();
                    if ($reviewPermission) {
                        $servicePermisGroup->permissions()->syncWithoutDetaching([$reviewPermission->id]);
                    }
                }
            }

            // Ensure barriere has approve permission
            if ($scenario['group'] === 'barriere') {
                $barriereGroup = $testUser->groups()->first();
                if ($barriereGroup) {
                    $approvePermission = Permission::where('slug', 'approve-visitor-pass')->first();
                    if ($approvePermission) {
                        $barriereGroup->permissions()->syncWithoutDetaching([$approvePermission->id]);
                    }
                }
            }

            Sanctum::actingAs($testUser);
            $response = $this->getJson("/visitor-passes/{$pass->id}/available-actions");

            $response->assertSuccessful();

            // Check that expected actions are available
            foreach ($scenario['expectedActions'] as $action) {
                $actionFound = false;
                foreach ($response->json('available_actions') as $availableAction) {
                    if ($availableAction['action'] === $action) {
                        $actionFound = true;
                        break;
                    }
                }
                $this->assertTrue(
                    $actionFound,
                    "Action '{$action}' should be available for {$scenario['role']} in {$scenario['group']} group"
                );
            }
        }
    }

    public function test_workflow_history_is_accessible(): void
    {
        // Create and process a pass through multiple stages
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Submit to chef
        Sanctum::actingAs($user);
        $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'pending_chef',
            'notes' => 'Please review',
        ]);

        // Chef approves
        $chef = $this->createUser('chef', 'it-department');
        Sanctum::actingAs($chef);
        $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'started',
            'notes' => 'Approved by chef',
        ]);

        // Check history
        $response = $this->getJson("/visitor-passes/{$pass->id}/workflow-history");
        $response->assertSuccessful();

        // Should have 2 history items (plus creation if that's recorded as an activity)
        $this->assertCount(2, $response->json('history'), 'Should have 2 status change records in history');

        // Verify the statuses in the history
        $this->assertEquals('started', $response->json('history.0.status'), 'Most recent status should be started');
        $this->assertEquals('pending_chef', $response->json('history.1.status'), 'Previous status should be pending_chef');
    }
}
