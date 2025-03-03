<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\VisitorPass;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VisitorPassTransitionTest extends VisitorPassWorkflowTest
{
    public function test_full_workflow_happy_path(): void
    {
        $this->withoutExceptionHandling();

        // 1. User creates a pass (awaiting)
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);
        $this->assertEquals('awaiting', $pass->status);

        // 2. User submits to chef
        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'pending_chef',
            'notes' => 'Please approve this pass',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('pending_chef', $pass->fresh()->status);

        // 3. Chef approves the pass
        $chef = $this->createUser('chef', 'it-department');
        Sanctum::actingAs($chef);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'started',
            'notes' => 'Approved by chef',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('started', $pass->fresh()->status);

        // 4. Service des Permis reviews the pass
        $servicePermisUser = $this->createUser('user', 'service-permis');
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
            'notes' => 'Reviewed by Service des Permis',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('in_progress', $pass->fresh()->status);

        // 5. Barriere gives final approval
        $barriereUser = $this->createUser('user', 'barriere');
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
            'notes' => 'Final approval by Barriere',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('accepted', $pass->fresh()->status);

        // Ensure the approval was recorded
        $this->assertEquals($barriereUser->id, $pass->fresh()->approved_by);
    }

    public function test_chef_can_bypass_pending_chef_status(): void
    {
        // 1. User creates a pass (awaiting)
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);
        $this->assertEquals('awaiting', $pass->status);

        // 2. Chef can directly transition from awaiting to started
        $chef = $this->createUser('chef', 'it-department');
        Sanctum::actingAs($chef);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'started',
            'notes' => 'Directly approved by chef',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('started', $pass->fresh()->status);
    }

    public function test_gendarmerie_can_also_provide_final_approval(): void
    {
        // Setup a pass in the in_progress state
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);
        $pass->status = 'in_progress';
        $pass->save();

        // Gendarmerie user gives final approval
        $gendarmerieUser = $this->createUser('user', 'gendarmerie');
        $gendarmerieGroup = $gendarmerieUser->groups()->first();
        if ($gendarmerieGroup) {
            $approvePermission = Permission::where('slug', 'approve-visitor-pass')->first();
            if ($approvePermission) {
                $gendarmerieGroup->permissions()->syncWithoutDetaching([$approvePermission->id]);
            }
        }

        Sanctum::actingAs($gendarmerieUser);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'accepted',
            'notes' => 'Final approval by Gendarmerie',
        ]);
        $response->assertSuccessful();
        $this->assertEquals('accepted', $pass->fresh()->status);
        $this->assertEquals($gendarmerieUser->id, $pass->fresh()->approved_by);
    }

    public function test_rejection_at_any_stage(): void
    {
        // Test rejection at each workflow step
        $stages = ['awaiting', 'pending_chef', 'started', 'in_progress'];

        foreach ($stages as $stage) {
            // Create a pass at the specific stage
            $user = $this->createUser('user', 'it-department');
            $pass = $this->createTestVisitorPass($user);
            $pass->status = $stage;
            $pass->save();

            // Chef or admin can reject at any stage
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

    public function test_admin_can_perform_any_transition(): void
    {
        // Create all possible transitions that an admin should be able to do
        $transitions = [
            'awaiting' => ['pending_chef', 'started', 'declined'],
            'pending_chef' => ['started', 'declined'],
            'started' => ['in_progress', 'declined'],
            'in_progress' => ['accepted', 'declined'],
            'accepted' => ['awaiting'], // Reopen
            'declined' => ['awaiting'], // Reopen
        ];

        $admin = $this->createUser('admin', 'it-department');

        foreach ($transitions as $fromStatus => $toStatuses) {
            foreach ($toStatuses as $toStatus) {
                // Create a pass at the specific stage
                $pass = $this->createTestVisitorPass($admin);
                $pass->status = $fromStatus;
                $pass->save();

                // Admin attempts transition
                Sanctum::actingAs($admin);
                $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
                    'status' => $toStatus,
                    'notes' => "Admin transition from {$fromStatus} to {$toStatus}",
                ]);

                $response->assertSuccessful();
                $this->assertEquals(
                    $toStatus,
                    $pass->fresh()->status,
                    "Failed transitioning from {$fromStatus} to {$toStatus}"
                );

                // Clean up for next iteration
                $pass->delete();
            }
        }
    }

    public function test_invalid_transition_returns_error(): void
    {
        // Create a pass in awaiting status
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Try to perform an invalid transition (awaiting -> accepted)
        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'accepted', // Should not be possible from awaiting
            'notes' => 'Trying to skip steps',
        ]);

        $response->assertStatus(403); // Forbidden or validation error
        $this->assertEquals('awaiting', $pass->fresh()->status, 'Status should not have changed');
    }

    public function test_status_changed_at_is_updated_on_transition(): void
    {
        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);
        $originalDate = $pass->status_changed_at;

        // Perform status update
        Sanctum::actingAs($user);
        $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'pending_chef',
        ]);

        $updatedPass = $pass->fresh();
        $this->assertNotEquals(
            $originalDate,
            $updatedPass->status_changed_at,
            'status_changed_at should be updated after status change'
        );
    }

    public function test_activity_is_logged_on_status_change(): void
    {
        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Change status
        Sanctum::actingAs($user);
        $this->postJson("/visitor-passes/{$pass->id}/status", [
            'status' => 'pending_chef',
            'notes' => 'Test activity logging',
        ]);

        // Check for activity record
        $this->assertDatabaseHas('activities', [
            'subject_type' => VisitorPass::class,
            'subject_id' => $pass->id,
            'type' => 'status_changed',
            'user_id' => $user->id,
        ]);
    }
}
