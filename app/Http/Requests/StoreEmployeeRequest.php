<?php

namespace App\Http\Requests;

class StoreEmployeeRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'string', 'max:30', 'unique:employees,employee_id'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'department' => ['required', 'string', 'max:120'],
            'designation' => ['required', 'string', 'max:120'],
            'official_email' => ['required', 'email', 'max:255', 'unique:employees,official_email'],
            'date_of_joining' => ['required', 'date'],
            'status' => ['required', 'in:active,inactive'],
            'gender' => ['nullable', 'in:male,female,other,prefer_not_to_say'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'country_of_residence' => ['nullable', 'string', 'max:100'],
            'residential_address' => ['nullable', 'string', 'max:2000'],
            'permanent_address' => ['nullable', 'string', 'max:2000'],
            'permanent_address_country' => ['nullable', 'string', 'max:100'],
            'religion' => ['nullable', 'string', 'max:100'],
            'contact_number' => ['nullable', 'string', 'max:30'],
            'marital_status' => ['nullable', 'in:married,single'],
            'hr_category' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            ...parent::messages(),
            'employee_id.unique' => 'This employee ID is already assigned to another employee.',
            'official_email.unique' => 'This official email is already assigned to another employee.',
        ];
    }
}
