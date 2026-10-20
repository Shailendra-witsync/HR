<?php

namespace App\Http\Requests;

class StoreRoleRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['name' => ['required', 'string', 'max:100', 'unique:roles,name']];
    }

    public function messages(): array
    {
        return [
            ...parent::messages(),
            'name.unique' => 'A role with this name already exists.',
        ];
    }
}
