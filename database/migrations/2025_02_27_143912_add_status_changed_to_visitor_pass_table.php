<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusChangedAtToVisitorPassesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('visitor_passes', function (Blueprint $table) {
            if (!Schema::hasColumn('visitor_passes', 'status_changed_at')) {
                $table->timestamp('status_changed_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitor_passes', function (Blueprint $table) {
            if (Schema::hasColumn('visitor_passes', 'status_changed_at')) {
                $table->dropColumn('status_changed_at');
            }
        });
    }
}
