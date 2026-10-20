<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('gender', 30)->nullable();
            $table->string('nationality', 100)->nullable();
            $table->string('country_of_residence', 100)->nullable();
            $table->text('residential_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->string('permanent_address_country', 100)->nullable();
            $table->string('religion', 100)->nullable();
            $table->string('contact_number', 30)->nullable();
            $table->string('marital_status', 20)->nullable();
            $table->string('hr_category', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'gender',
                'nationality',
                'country_of_residence',
                'residential_address',
                'permanent_address',
                'permanent_address_country',
                'religion',
                'contact_number',
                'marital_status',
                'hr_category',
            ]);
        });
    }
};
