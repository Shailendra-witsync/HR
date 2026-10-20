<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'is_system'])]
class Role extends Model
{
    protected function casts(): array
    {
        return ['is_system' => 'boolean'];
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(RolePermission::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function allows(string $module, string $action): bool
    {
        $permission = $this->permissions->firstWhere('module', $module);

        return $action === 'manage'
            ? (bool) $permission?->can_manage
            : (bool) $permission?->can_view || (bool) $permission?->can_manage;
    }
}
