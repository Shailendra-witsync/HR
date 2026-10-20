<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class HrFormRequest extends FormRequest
{
    public function messages(): array
    {
        return [
            '*.required' => 'The :attribute field is required.',
            '*.required_if' => 'The :attribute field is required.',
            '*.string' => 'The :attribute must be text.',
            '*.email' => 'Enter a valid email address.',
            '*.regex' => 'Enter a valid email address.',
            '*.boolean' => 'Choose a valid option for :attribute.',
            '*.date' => 'Enter a valid date for :attribute.',
            '*.in' => 'Choose a valid option for :attribute.',
            '*.exists' => 'The selected :attribute is not available.',
            'unique' => 'This :attribute is already in use.',
            '*.same' => 'The :attribute does not match the password.',
            '*.min' => 'The :attribute must be at least :min characters.',
            '*.max' => 'The :attribute may not be greater than :max characters.',
            '*.array' => 'The :attribute selection is invalid.',
        ];
    }

    public function attributes(): array
    {
        return [
            'employee_id' => 'employee ID',
            'first_name' => 'first name',
            'middle_name' => 'middle name',
            'last_name' => 'last name',
            'official_email' => 'official email',
            'date_of_joining' => 'date of joining',
            'hr_category' => 'HR category',
            'country_of_residence' => 'country of residence',
            'residential_address' => 'residential address',
            'permanent_address' => 'permanent address',
            'permanent_address_country' => 'permanent address country',
            'contact_number' => 'contact number',
            'marital_status' => 'marital status',
            'parent_id' => 'department',
            'role_id' => 'role',
            'is_active' => 'account status',
            'password_confirmation' => 'password confirmation',
            'permissions' => 'permissions',
        ];
    }
}
