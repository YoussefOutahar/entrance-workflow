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
        $tables = ['visitor_passes', 'files', 'groups', 'permissions'];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                if (!Schema::hasColumn($table->getTable(), 'created_by')) {
                    $table->foreignId('created_by')->nullable()->constrained('users');
                }
                if (!Schema::hasColumn($table->getTable(), 'updated_by')) {
                    $table->foreignId('updated_by')->nullable()->constrained('users');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = ['visitor_passes', 'files', 'groups', 'permissions'];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropForeign(['created_by']);
                $table->dropForeign(['updated_by']);
                $table->dropColumn(['created_by', 'updated_by']);
            });
        }
    }
};
