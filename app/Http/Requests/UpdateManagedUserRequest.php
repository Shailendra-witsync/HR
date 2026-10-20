<?php

namespace App\Http\Requests;

class UpdateManagedUserRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role_id' => ['required', 'exists:roles,id'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
