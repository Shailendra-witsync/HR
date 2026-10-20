<?php

namespace App\Services;

use App\Models\Employee;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmployeeService
{
    public function __construct(private EmployeeRepositoryInterface $employees) {}

    /**
     * @param  array{employee_id?: string|null, name?: string|null, designation?: string|null, search?: string|null}  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        return $this->employees->paginate($filters);
    }

    /**
     * @return list<string>
     */
    public function designations(): array
    {
        return $this->employees->designations();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Employee
    {
        return $this->employees->create($attributes);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Employee $employee, array $attributes): Employee
    {
        return $this->employees->update($employee, $attributes);
    }

    public function delete(Employee $employee): void
    {
        $this->employees->delete($employee);
    }

    /**
     * @return array{counts: array{total: int, active: int, inactive: int, joined_this_month: int}, recent: Collection<int, Employee>}
     */
    public function dashboardSummary(): array
    {
        return [
            'counts' => $this->employees->dashboardCounts(),
            'recent' => $this->employees->recent(),
        ];
    }
}
