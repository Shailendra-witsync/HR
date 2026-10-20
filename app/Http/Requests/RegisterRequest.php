<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return User::query()->doesntExist();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255', 'regex:/^[^\s@]+@[^\s@]+$/', 'unique:users,email'],
            'password' => ['required', Password::min(8)],
            'password_confirmation' => ['required', 'same:password'],
        ];
    }

    public function messages(): array
    {
        return [
            ...parent::messages(),
            'password.min' => 'The password must be at least 8 characters.',
        ];
    }
}
