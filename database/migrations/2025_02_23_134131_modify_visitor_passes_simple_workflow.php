<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('visitor_passes', function (Blueprint $table) {
            // Modify the existing status column to use enum with our expanded workflow statuses
            $table->enum('status', [
                'awaiting',      // Initial state when created
                'pending_chef',  // Submitted and waiting for chef approval
                'started',       // Chef approved, sent to Service des Permis
                'in_progress',   // Service des Permis reviewed, ready for final approval
                'accepted',      // Final approval by Barriere/Gendarmerie
                'declined'       // Rejected at any stage
            ])->default('awaiting')->change();

            // Add a simple tracking column
            $table->timestamp('status_changed_at')->nullable();

            // Make sure we have created_by column
            if (!Schema::hasColumn('visitor_passes', 'created_by')) {
                $table->unsignedBigInteger('created_by')->nullable();
                $table->foreign('created_by')->references('id')->on('users');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitor_passes', function (Blueprint $table) {
            $table->string('status')->default('pending')->change();
            $table->dropColumn('status_changed_at');

            if (Schema::hasColumn('visitor_passes', 'created_by')) {
                $table->dropForeign(['created_by']);
                $table->dropColumn('created_by');
            }
        });
    }
};
