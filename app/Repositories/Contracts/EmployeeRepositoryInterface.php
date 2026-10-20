<?php

namespace App\Repositories\Contracts;

use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface EmployeeRepositoryInterface
{
    /**
     * @param  array{employee_id?: string|null, name?: string|null, designation?: string|null, search?: string|null}  $filters
     */
    public function paginate(array $filters): LengthAwarePaginator;

    /**
     * @return list<string>
     */
    public function designations(): array;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Employee;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Employee $employee, array $attributes): Employee;

    public function delete(Employee $employee): void;

    /**
     * @return array{total: int, active: int, inactive: int, joined_this_month: int}
     */
    public function dashboardCounts(): array;

    /**
     * @return Collection<int, Employee>
     */
    public function recent(int $limit = 5): Collection;
}
