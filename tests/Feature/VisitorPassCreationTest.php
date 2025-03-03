<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VisitorPassCreationTest extends VisitorPassWorkflowTest
{
    public function test_regular_user_can_create_pass_in_awaiting_status(): void
    {
        $this->withoutExceptionHandling();

        // Create a regular user in IT department
        $user = $this->createUser('user', 'it-department');
        Sanctum::actingAs($user);

        // Create a visitor pass
        $response = $this->postJson('/visitor-passes', [
            'visit_date' => now()->addDay()->format('Y-m-d'),
            'visited_person' => 'John Doe',
            'unit' => 'Test Unit',
            'module' => 'Test Module',
            'visit_purpose' => 'Testing',
            'duration_type' => 'full_day',
            'visitor_name' => 'Test Visitor',
            'id_number' => 'ID123456',
            'organization' => 'Test Organization',
            'category' => 'S-T',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.status', 'awaiting');

        // Confirm in database
        $this->assertDatabaseHas('visitor_passes', [
            'visitor_name' => 'Test Visitor',
            'status' => 'awaiting',
            'created_by' => $user->id,
        ]);
    }

    public function test_chef_can_create_pass_in_started_status(): void
    {
        // Create a chef user in IT department
        $chef = $this->createUser('chef', 'it-department');
        Sanctum::actingAs($chef);

        // Create a visitor pass
        $response = $this->postJson('/visitor-passes', [
            'visit_date' => now()->addDay()->format('Y-m-d'),
            'visited_person' => 'John Doe',
            'unit' => 'Test Unit',
            'module' => 'Test Module',
            'visit_purpose' => 'Testing',
            'duration_type' => 'full_day',
            'visitor_name' => 'Chef Created Pass',
            'id_number' => 'ID789012',
            'organization' => 'Test Organization',
            'category' => 'S-T',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.status', 'started');

        // Confirm in database
        $this->assertDatabaseHas('visitor_passes', [
            'visitor_name' => 'Chef Created Pass',
            'status' => 'started',
            'created_by' => $chef->id,
        ]);
    }

    public function test_admin_can_create_pass_in_started_status(): void
    {
        // Create an admin user
        $admin = $this->createUser('admin', 'it-department');
        Sanctum::actingAs($admin);

        // Create a visitor pass
        $response = $this->postJson('/visitor-passes', [
            'visit_date' => now()->addDay()->format('Y-m-d'),
            'visited_person' => 'Jane Doe',
            'unit' => 'Admin Unit',
            'module' => 'Admin Module',
            'visit_purpose' => 'Admin Testing',
            'duration_type' => 'full_day',
            'visitor_name' => 'Admin Created Pass',
            'id_number' => 'AD123456',
            'organization' => 'Admin Organization',
            'category' => 'S-T',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.status', 'started');

        // Confirm in database
        $this->assertDatabaseHas('visitor_passes', [
            'visitor_name' => 'Admin Created Pass',
            'status' => 'started',
            'created_by' => $admin->id,
        ]);
    }

    public function test_required_fields_validation_for_visitor_pass(): void
    {
        $user = $this->createUser('user', 'it-department');
        Sanctum::actingAs($user);

        // Missing required fields
        $response = $this->postJson('/visitor-passes', [
            // Missing most required fields
            'visit_date' => now()->addDay()->format('Y-m-d'),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            'visited_person',
            'unit',
            'module',
            'visit_purpose',
            'duration_type',
            'visitor_name',
            'id_number',
            'category'
        ]);
    }

    public function test_duration_days_required_for_custom_duration(): void
    {
        $user = $this->createUser('user', 'it-department');
        Sanctum::actingAs($user);

        // Missing duration_days when custom duration is selected
        $response = $this->postJson('/visitor-passes', [
            'visit_date' => now()->addDay()->format('Y-m-d'),
            'visited_person' => 'John Doe',
            'unit' => 'Test Unit',
            'module' => 'Test Module',
            'visit_purpose' => 'Testing',
            'duration_type' => 'custom', // Custom duration but no days specified
            'visitor_name' => 'Test Visitor',
            'id_number' => 'ID123456',
            'organization' => 'Test Organization',
            'category' => 'S-T',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['duration_days']);
    }
}
