<?php

namespace App\Http\Requests;

use App\Models\HrCodification;
use Illuminate\Validation\Rule;

class UpdateHrCodificationRequest extends HrFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /** @var HrCodification $codification */
        $codification = $this->route('codification');
        $type = $this->input('type', $codification->type);

        return [
            'type' => ['required', Rule::in(['department', 'designation', 'category'])],
            'name' => ['required', 'string', 'max:120', Rule::unique('hr_codifications')->where('type', $type)->ignore($codification->id)],
            'parent_id' => [
                Rule::requiredIf($type === 'designation'),
                'nullable',
                Rule::exists('hr_codifications', 'id')->where('type', 'department'),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            ...parent::messages(),
            'name.unique' => 'A codification with this name already exists in this category.',
            'parent_id.required' => 'Select a department for this designation.',
            'type.in' => 'Choose Departments, Designations, or HR Categories.',
        ];
    }
}
