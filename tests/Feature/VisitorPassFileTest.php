<?php

namespace Tests\Feature;

use App\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VisitorPassFileTest extends VisitorPassWorkflowTest
{
    public function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_can_upload_file_to_visitor_pass(): void
    {
        $this->withoutExceptionHandling();

        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Create a fake file
        $file = UploadedFile::fake()->create('document.pdf', 1000);

        // Upload the file
        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/files", [
            'files' => [$file]
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['files']);

        // Verify file was stored
        $filePath = $response->json('files.0.path');
        Storage::disk('public')->assertExists($filePath);

        // Verify database record
        $this->assertDatabaseHas('files', [
            'visitor_pass_id' => $pass->id,
            'name' => 'document.pdf',
            'type' => 'application/pdf',
        ]);
    }

    public function test_can_delete_file_from_visitor_pass(): void
    {
        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Create a file record
        $file = UploadedFile::fake()->create('document.pdf', 1000);
        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/files", [
            'files' => [$file]
        ]);

        $fileId = $response->json('files.0.id');
        $filePath = $response->json('files.0.path');

        // Delete the file
        $response = $this->deleteJson("/files/{$fileId}");
        $response->assertStatus(204); // No content

        // Verify file was removed from storage
        Storage::disk('public')->assertMissing($filePath);

        // Verify database record was deleted
        $this->assertDatabaseMissing('files', [
            'id' => $fileId
        ]);
    }

    public function test_file_validation_enforces_allowed_types(): void
    {
        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Try to upload an invalid file type
        $file = UploadedFile::fake()->create('script.js', 1000);

        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/files", [
            'files' => [$file]
        ]);

        $response->assertStatus(422); // Validation error
        $response->assertJsonValidationErrors(['files.0']);
    }

    public function test_file_validation_enforces_max_size(): void
    {
        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Create a file that's too large (size is in KB, so 11MB)
        $file = UploadedFile::fake()->create('document.pdf', 11000);

        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/files", [
            'files' => [$file]
        ]);

        $response->assertStatus(422); // Validation error
        $response->assertJsonValidationErrors(['files.0']);
    }

    public function test_multiple_files_can_be_uploaded(): void
    {
        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Create multiple fake files
        $file1 = UploadedFile::fake()->create('document1.pdf', 1000);
        $file2 = UploadedFile::fake()->create('document2.jpg', 1000);
        $file3 = UploadedFile::fake()->create('document3.docx', 1000);

        // Upload the files
        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/files", [
            'files' => [$file1, $file2, $file3]
        ]);

        $response->assertStatus(201);

        // Assert we have 3 files in the response
        $this->assertCount(3, $response->json('files'), 'Should have 3 files in the response');

        // Verify database records
        $this->assertEquals(
            3,
            File::where('visitor_pass_id', $pass->id)->count(),
            'Should have 3 files in the database'
        );
    }

    public function test_activity_is_logged_when_files_are_uploaded(): void
    {
        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Create a fake file
        $file = UploadedFile::fake()->create('document.pdf', 1000);

        // Upload the file
        Sanctum::actingAs($user);
        $this->postJson("/visitor-passes/{$pass->id}/files", [
            'files' => [$file]
        ]);

        // Verify activity was logged
        $this->assertDatabaseHas('activities', [
            'subject_type' => get_class($pass),
            'subject_id' => $pass->id,
            'type' => 'file_uploaded',
            'user_id' => $user->id,
        ]);
    }

    public function test_activity_is_logged_when_files_are_deleted(): void
    {
        // Create a pass
        $user = $this->createUser('user', 'it-department');
        $pass = $this->createTestVisitorPass($user);

        // Create a file record
        $file = UploadedFile::fake()->create('document.pdf', 1000);
        Sanctum::actingAs($user);
        $response = $this->postJson("/visitor-passes/{$pass->id}/files", [
            'files' => [$file]
        ]);

        $fileId = $response->json('files.0.id');

        // Delete the file
        $this->deleteJson("/files/{$fileId}");

        // Verify activity was logged
        $this->assertDatabaseHas('activities', [
            'subject_type' => get_class($pass),
            'subject_id' => $pass->id,
            'type' => 'file_deleted',
            'user_id' => $user->id,
        ]);
    }
}
