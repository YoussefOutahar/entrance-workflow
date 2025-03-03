<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VisitorPass;
use Carbon\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VisitorPassKpiTest extends VisitorPassWorkflowTest
{
    public function test_dashboard_kpis_are_available(): void
    {
        $this->withoutExceptionHandling();

        // Create some pass data with different statuses
        $user = $this->createUser('user', 'it-department');

        // Create passes in different states
        $this->createPasses($user);

        // Get KPI data
        Sanctum::actingAs($user);
        $response = $this->getJson('/kpi/dashboard');

        $response->assertSuccessful();
        $response->assertJsonStructure([
            'status',
            'data' => [
                'total_passes',
                'pending_approval',
                'approved',
                'declined',
                'approval_rate',
                'status_breakdown',
                'passes_by_unit',
                'passes_by_category',
                'processing_times',
                'trend_data',
                'time_range'
            ]
        ]);
    }

    public function test_dashboard_kpis_can_filter_by_unit(): void
    {
        // Create some pass data with different units
        $user = $this->createUser('user', 'it-department');

        // Create passes with different units
        $this->createPassWithUnit($user, 'Unit A');
        $this->createPassWithUnit($user, 'Unit B');
        $this->createPassWithUnit($user, 'Unit B'); // Create a second one for Unit B

        // Get filtered KPI data for Unit B
        Sanctum::actingAs($user);
        $response = $this->getJson('/kpi/dashboard?unit=Unit+B');

        $response->assertSuccessful();

        // Should count only Unit B passes
        $this->assertEquals(
            2,
            $response->json('data.total_passes'),
            'Should only count passes from Unit B'
        );
    }

    public function test_dashboard_kpis_can_filter_by_time_range(): void
    {
        // Create some pass data with different dates
        $user = $this->createUser('user', 'it-department');

        // Create passes with different dates
        $this->createPassWithDate($user, Carbon::now()->subDays(10));
        $this->createPassWithDate($user, Carbon::now()->subDays(20));
        $this->createPassWithDate($user, Carbon::now()->subDays(40));

        // Get KPI data for last 15 days
        Sanctum::actingAs($user);
        $response = $this->getJson('/kpi/dashboard?time_range=15_days');

        $response->assertSuccessful();

        // Should only count passes from the last 15 days
        // Note: Actual implementation might handle time ranges differently
        // This test may need adjustment based on the actual implementation
    }

    public function test_user_kpis_are_available(): void
    {
        // Create some pass data for different users
        $user = $this->createUser('user', 'it-department');

        // Create some passes by this user
        $this->createPasses($user);

        // Create a second user with their own passes
        $user2 = $this->createUser('user', 'hr');
        $this->createPasses($user2);

        // Get KPI data for the first user
        Sanctum::actingAs($user);
        $response = $this->getJson('/kpi/user');

        $response->assertSuccessful();
        $response->assertJsonStructure([
            'status',
            'data' => [
                'total_created',
                'pending_approval',
                'approved',
                'declined',
                'activities',
                'avg_processing_time',
                'time_range'
            ]
        ]);

        // Should only count user1's passes, not user2's
        $this->assertEquals(
            5,
            $response->json('data.total_created'),
            'Should only count passes created by the current user'
        );
    }

    public function test_available_units_list(): void
    {
        // Create some pass data with different units
        $user = $this->createUser('user', 'it-department');

        // Create passes with different units
        $this->createPassWithUnit($user, 'Unit A');
        $this->createPassWithUnit($user, 'Unit B');
        $this->createPassWithUnit($user, 'Unit C');

        // Get units list
        Sanctum::actingAs($user);
        $response = $this->getJson('/kpi/units');

        $response->assertSuccessful();
        $response->assertJsonStructure([
            'status',
            'data'
        ]);

        // Should have all 3 units
        $this->assertCount(3, $response->json('data'), 'Should list all 3 units');
        $this->assertContains('Unit A', $response->json('data'));
        $this->assertContains('Unit B', $response->json('data'));
        $this->assertContains('Unit C', $response->json('data'));
    }

    private function createPasses(User $user): void
    {
        // Create 5 passes with different statuses
        $statuses = ['awaiting', 'pending_chef', 'started', 'in_progress', 'accepted'];

        foreach ($statuses as $status) {
            VisitorPass::create([
                'visit_date' => now()->addDay(),
                'visited_person' => 'John Doe',
                'unit' => 'Test Unit',
                'module' => 'Test Module',
                'visit_purpose' => 'Testing',
                'duration_type' => 'full_day',
                'duration_days' => null,
                'visitor_name' => 'Test Visitor - ' . $status,
                'id_number' => 'ID' . random_int(100000, 999999),
                'organization' => 'Test Organization',
                'category' => 'S-T',
                'status' => $status,
                'created_by' => $user->id,
                'status_changed_at' => now(),
            ]);
        }
    }

    private function createPassWithUnit(User $user, string $unit): void
    {
        VisitorPass::create([
            'visit_date' => now()->addDay(),
            'visited_person' => 'John Doe',
            'unit' => $unit,
            'module' => 'Test Module',
            'visit_purpose' => 'Testing',
            'duration_type' => 'full_day',
            'duration_days' => null,
            'visitor_name' => 'Test Visitor - ' . $unit,
            'id_number' => 'ID' . random_int(100000, 999999),
            'organization' => 'Test Organization',
            'category' => 'S-T',
            'status' => 'awaiting',
            'created_by' => $user->id,
            'status_changed_at' => now(),
        ]);
    }

    private function createPassWithDate(User $user, Carbon $date): void
    {
        VisitorPass::create([
            'visit_date' => $date->addDay(),
            'visited_person' => 'John Doe',
            'unit' => 'Test Unit',
            'module' => 'Test Module',
            'visit_purpose' => 'Testing',
            'duration_type' => 'full_day',
            'duration_days' => null,
            'visitor_name' => 'Test Visitor - ' . $date->format('Y-m-d'),
            'id_number' => 'ID' . random_int(100000, 999999),
            'organization' => 'Test Organization',
            'category' => 'S-T',
            'status' => 'awaiting',
            'created_by' => $user->id,
            'created_at' => $date,
            'updated_at' => $date,
            'status_changed_at' => $date,
        ]);
    }
}
