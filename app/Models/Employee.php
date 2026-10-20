<?php

namespace App\Models;

use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'employee_id',
    'first_name',
    'middle_name',
    'last_name',
    'department',
    'designation',
    'official_email',
    'date_of_joining',
    'status',
    'gender',
    'nationality',
    'country_of_residence',
    'residential_address',
    'permanent_address',
    'permanent_address_country',
    'religion',
    'contact_number',
    'marital_status',
    'hr_category',
])]
class Employee extends Model
{
    /** @use HasFactory<EmployeeFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'date_of_joining' => 'date',
        ];
    }

    protected function fullName(): Attribute
    {
        return Attribute::get(fn (): string => trim(implode(' ', array_filter([
            $this->first_name,
            $this->middle_name,
            $this->last_name,
        ]))));
    }
}
