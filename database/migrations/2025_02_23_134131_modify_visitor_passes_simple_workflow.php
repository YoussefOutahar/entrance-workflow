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
            // Modify the existing status column to use enum
            $table->enum('status', [
                'awaiting',
                'declined',
                'started',
                'in_progress',
                'accepted'
            ])->default('awaiting')->change();

            // Add a simple tracking column
            $table->timestamp('status_changed_at')->nullable();
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
        });
    }
};
