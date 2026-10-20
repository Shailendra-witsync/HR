<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = getenv('HR_ADMIN_PASSWORD') ?: env('HR_ADMIN_PASSWORD');
        if (! is_string($password) || strlen($password) < 8) {
            throw new RuntimeException('Set HR_ADMIN_PASSWORD to a value of at least 8 characters before seeding the administrator.');
        }

        DB::transaction(function () use ($password): void {
            $role = Role::query()->where('name', 'Administrator')->firstOrFail();
            $email = getenv('HR_ADMIN_EMAIL') ?: env('HR_ADMIN_EMAIL', 'admin@hr.local');

            User::query()->updateOrCreate(
                ['email' => $email],
                [
                    'name' => getenv('HR_ADMIN_NAME') ?: env('HR_ADMIN_NAME', 'HR Administrator'),
                    'password' => $password,
                    'role_id' => $role->id,
                    'is_active' => true,
                ],
            );

        });

        $this->command?->info('Administrator account created or updated with the configured credentials.');
    }
}
