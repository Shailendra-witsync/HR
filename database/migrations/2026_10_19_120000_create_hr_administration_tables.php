<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        Schema::create('role_permissions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->string('module', 40);
            $table->boolean('can_view')->default(false);
            $table->boolean('can_manage')->default(false);
            $table->timestamps();
            $table->unique(['role_id', 'module']);
        });

        Schema::create('hr_codifications', function (Blueprint $table): void {
            $table->id();
            $table->string('type', 30);
            $table->string('name', 120);
            $table->foreignId('parent_id')->nullable()->constrained('hr_codifications')->restrictOnDelete();
            $table->timestamps();
            $table->unique(['type', 'name']);
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->foreignId('role_id')->nullable()->after('password')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('role_id');
        });

        $now = now();
        $roleId = DB::table('roles')->insertGetId([
            'name' => 'Administrator',
            'is_system' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        foreach (['dashboard', 'add_employees', 'modify_employees', 'list_employees', 'manage_access', 'reports', 'settings'] as $module) {
            DB::table('role_permissions')->insert([
                'role_id' => $roleId,
                'module' => $module,
                'can_view' => true,
                'can_manage' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $firstUser = DB::table('users')->orderBy('id')->value('id');
        if ($firstUser !== null) {
            DB::table('users')->where('id', $firstUser)->update(['role_id' => $roleId]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('role_id');
            $table->dropColumn('is_active');
        });

        Schema::dropIfExists('hr_codifications');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('roles');
    }
};
