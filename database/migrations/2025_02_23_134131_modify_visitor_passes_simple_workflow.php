<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('visitor_passes', function (Blueprint $table) {
            $table->dropColumn('status');

            $table->enum('status', [
                'awaiting',
                'declined',
                'started',
                'in_progress',
                'accepted'
            ])->default('awaiting');

            $table->timestamp('status_changed_at')->nullable();
            $table->foreignId('status_changed_by')->nullable()->constrained('users');
        });
    }

    public function down(): void
    {
        Schema::table('visitor_passes', function (Blueprint $table) {
            $table->dropColumn(['status', 'status_changed_at', 'status_changed_by']);
            $table->string('status')->default('pending');
        });
    }
};
