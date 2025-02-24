<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('visitor_passes', function (Blueprint $table) {
            // Drop the existing status column first
            $table->dropColumn('status');

            // Add the new enum status column
            $table->enum('status', [
                'awaiting',
                'declined',
                'started',
                'in_progress',
                'accepted'
            ])->default('awaiting');

            // Add tracking columns if they don't exist
            if (!Schema::hasColumn('visitor_passes', 'status_changed_at')) {
                $table->timestamp('status_changed_at')->nullable();
            }

            if (!Schema::hasColumn('visitor_passes', 'status_changed_by')) {
                $table->foreignId('status_changed_by')->nullable()->constrained('users');
            }
        });
    }

    public function down(): void
    {
        Schema::table('visitor_passes', function (Blueprint $table) {
            $table->dropForeign(['status_changed_by']);
            $table->dropColumn(['status', 'status_changed_at', 'status_changed_by']);
            $table->string('status')->default('pending');
        });
    }
};
