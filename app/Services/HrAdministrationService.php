<?php

namespace App\Services;

use App\Models\HrCodification;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\User;
use App\Support\HrModules;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class HrAdministrationService
{
    public function codifications(): array
    {
        return HrCodification::query()
            ->with('parent:id,name')
            ->orderBy('type')
            ->orderBy('name')
            ->get()
            ->groupBy('type')
            ->map(fn ($items) => $items->map(fn (HrCodification $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'parent_id' => $item->parent_id,
                'parent_name' => $item->parent?->name,
            ])->values())
            ->all();
    }

    public function departments(): array
    {
        return HrCodification::query()->where('type', 'department')->orderBy('name')->get(['id', 'name'])->toArray();
    }

    public function storeCodification(array $attributes): HrCodification
    {
        return HrCodification::query()->create($attributes);
    }

    public function updateCodification(HrCodification $item, array $attributes): HrCodification
    {
        $item->update($attributes);

        return $item;
    }

    public function deleteCodification(HrCodification $item): void
    {
        if ($item->children()->exists()) {
            throw ValidationException::withMessages([
                'codification' => 'Move or remove this department’s designations before deleting it.',
            ]);
        }

        $item->delete();
    }

    public function roles(): array
    {
        return Role::query()
            ->withCount('users')
            ->with('permissions')
            ->orderByDesc('is_system')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'is_system' => $role->is_system,
                'users_count' => $role->users_count,
                'permissions' => $role->permissions->mapWithKeys(fn (RolePermission $permission) => [
                    $permission->module => [
                        'view' => $permission->can_view,
                        'manage' => $permission->can_manage,
                    ],
                ]),
            ])
            ->all();
    }

    public function users(): array
    {
        return User::query()
            ->with('role:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'role_name' => $user->role?->name,
                'is_active' => $user->is_active,
            ])
            ->all();
    }

    public function createRole(string $name): Role
    {
        return DB::transaction(function () use ($name): Role {
            $role = Role::query()->create(['name' => $name]);

            foreach (HrModules::names() as $module) {
                $role->permissions()->create(['module' => $module]);
            }

            return $role;
        });
    }

    public function updateRolePermissions(Role $role, array $permissions): void
    {
        if ($role->is_system) {
            throw ValidationException::withMessages(['role' => 'Administrator permissions cannot be changed.']);
        }

        DB::transaction(function () use ($role, $permissions): void {
            foreach (HrModules::names() as $module) {
                $values = $permissions[$module] ?? [];
                $role->permissions()->updateOrCreate(
                    ['module' => $module],
                    [
                        'can_view' => (bool) ($values['view'] ?? false) || (bool) ($values['manage'] ?? false),
                        'can_manage' => (bool) ($values['manage'] ?? false),
                    ],
                );
            }
        });
    }

    public function deleteRole(Role $role): void
    {
        if ($role->is_system || $role->users()->exists()) {
            throw ValidationException::withMessages([
                'role' => 'This role is protected or is still assigned to users.',
            ]);
        }

        $role->delete();
    }

    public function createUser(array $attributes): User
    {
        return User::query()->create($attributes);
    }

    public function updateUser(User $user, array $attributes, User $actor): void
    {
        DB::transaction(function () use ($user, $attributes, $actor): void {
            $nextRoleId = $attributes['role_id'] ?? $user->role_id;
            $nextActive = $attributes['is_active'] ?? $user->is_active;

            if ($user->is($actor) && (! $nextActive || $nextRoleId !== $user->role_id)) {
                throw ValidationException::withMessages(['user' => 'You cannot change your own access or deactivate your account.']);
            }

            $isRemovingAdmin = $user->role?->is_system
                && ($nextRoleId !== $user->role_id || ! $nextActive);
            if ($isRemovingAdmin && User::query()
                ->where('role_id', $user->role_id)
                ->where('is_active', true)
                ->count() <= 1) {
                throw ValidationException::withMessages(['user' => 'At least one active Administrator account must remain.']);
            }

            $user->update($attributes);
        });
    }
}
