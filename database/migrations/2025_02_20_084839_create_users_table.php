<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // Basic Info
            $table->string('username')->unique();  // sAMAccountName in AD
            $table->string('email')->unique();     // mail in AD
            $table->string('password');

            // Name Components
            $table->string('display_name');        // displayName in AD
            $table->string('given_name');          // givenName in AD
            $table->string('surname');             // sn in AD
            $table->string('initials')->nullable(); // initials in AD

            // Organization Info
            $table->string('employee_id')->nullable();    // employeeID in AD
            $table->string('company')->nullable();        // company in AD
            $table->string('department')->nullable();     // department in AD
            $table->string('title')->nullable();         // title in AD
            $table->string('manager_id')->nullable();    // manager in AD

            // Contact Info
            $table->string('office_phone')->nullable();   // telephoneNumber in AD
            $table->string('mobile_phone')->nullable();   // mobile in AD
            $table->string('office_location')->nullable(); // physicalDeliveryOfficeName in AD
            $table->string('street_address')->nullable(); // streetAddress in AD
            $table->string('city')->nullable();          // l in AD
            $table->string('state')->nullable();         // st in AD
            $table->string('postal_code')->nullable();   // postalCode in AD
            $table->string('country')->nullable();       // c in AD

            // Account Status
            $table->boolean('is_active')->default(true);  // userAccountControl in AD
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('password_last_set')->nullable(); // pwdLastSet in AD
            $table->timestamp('account_expires_at')->nullable(); // accountExpires in AD

            // System Fields
            $table->string('guid')->nullable();          // objectGUID in AD
            $table->string('distinguished_name')->nullable(); // distinguishedName in AD
            $table->json('group_memberships')->nullable(); // memberOf in AD

            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes(); // For account deletions
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
