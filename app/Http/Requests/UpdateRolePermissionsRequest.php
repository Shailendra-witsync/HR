<?php

namespace App\Http\Requests;

use App\Support\HrModules;

class UpdateRolePermissionsRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'permissions' => ['required', 'array:'.implode(',', HrModules::names())],
            'permissions.*' => ['array'],
            'permissions.*.view' => ['sometimes', 'boolean'],
            'permissions.*.manage' => ['sometimes', 'boolean'],
        ];
    }
}
