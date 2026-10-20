<?php

namespace App\Http\Requests;

class EmployeeIndexRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['nullable', 'string', 'max:30'],
            'name' => ['nullable', 'string', 'max:150'],
            'designation' => ['nullable', 'string', 'max:120'],
            'search' => ['nullable', 'string', 'max:150'],
        ];
    }
}
