<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['role_id', 'module', 'can_view', 'can_manage'])]
class RolePermission extends Model
{
    protected function casts(): array
    {
        return ['can_view' => 'boolean', 'can_manage' => 'boolean'];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}
