<?php

namespace App\Http\Requests;

class StoreManagedUserRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255', 'regex:/^[^\s@]+@[^\s@]+$/', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'password_confirmation' => ['required', 'same:password'],
            'role_id' => ['required', 'exists:roles,id'],
        ];
    }

    public function messages(): array
    {
        return [
            ...parent::messages(),
            'email.regex' => 'Enter a valid email or username.',
            'email.unique' => 'An account with this email already exists.',
        ];
    }
}
