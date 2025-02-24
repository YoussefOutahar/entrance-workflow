<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('visitor_passes', function (Blueprint $table) {
            $table->id();
            $table->date('visit_date');
            $table->string('visited_person');
            $table->string('unit');
            $table->string('module');
            $table->string('visit_purpose');
            $table->enum('duration_type', ['full_day', 'custom']);
            $table->integer('duration_days')->nullable();
            $table->string('visitor_name');
            $table->string('id_number');
            $table->string('organization')->nullable();
            $table->enum('category', ['S-T', 'Ch', 'E']);
            $table->string('status');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->boolean('hierarchy_approval')->default(false);
            $table->boolean('spp_approval')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_passes');
    }
};
