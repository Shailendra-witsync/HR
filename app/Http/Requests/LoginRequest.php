<?php

namespace App\Http\Requests;

class LoginRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'max:255', 'regex:/^[^\s@]+@[^\s@]+$/'],
            'password' => ['required', 'string', 'max:255'],
            'remember' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            ...parent::messages(),
            'email.required' => 'Enter your email or username.',
            'email.regex' => 'Enter a valid email or username.',
            'password.required' => 'Enter your password.',
            'auth' => 'These credentials do not match our records.',
        ];
    }
}
