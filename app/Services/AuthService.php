<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthService
{
    public function __construct(private UserRepositoryInterface $users) {}

    /**
     * @param  array{email: string, password: string, remember?: bool}  $credentials
     */
    public function attempt(array $credentials): bool
    {
        return Auth::attempt(
            ['email' => $credentials['email'], 'password' => $credentials['password'], 'is_active' => true],
            $credentials['remember'] ?? false,
        );
    }

    /**
     * @param  array{name: string, email: string, password: string}  $attributes
     */
    public function register(array $attributes): User
    {
        $user = DB::transaction(function () use ($attributes): User {
            $administratorRole = Role::query()
                ->where('name', 'Administrator')
                ->lockForUpdate()
                ->firstOrFail();

            if (User::query()->exists()) {
                abort(403, 'New accounts can only be created by an administrator.');
            }

            return $this->users->create([
                ...$attributes,
                'role_id' => $administratorRole->id,
                'is_active' => true,
            ]);
        });
        Auth::login($user);

        return $user;
    }

    public function logout(): void
    {
        Auth::logout();
    }
}
