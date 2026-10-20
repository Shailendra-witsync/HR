<?php

namespace App\Repositories;

use App\Models\Employee;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class EloquentEmployeeRepository implements EmployeeRepositoryInterface
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Employee::query()
            ->when($filters['employee_id'] ?? null, fn ($query, $employeeId) => $query->where('employee_id', 'like', "%{$employeeId}%"))
            ->when($filters['name'] ?? null, function ($query, $name): void {
                $query->where(function ($query) use ($name): void {
                    $query->where('first_name', 'like', "%{$name}%")
                        ->orWhere('middle_name', 'like', "%{$name}%")
                        ->orWhere('last_name', 'like', "%{$name}%");
                });
            })
            ->when($filters['designation'] ?? null, fn ($query, $designation) => $query->where('designation', 'like', "%{$designation}%"))
            ->when($filters['search'] ?? null, function ($query, $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('official_email', 'like', "%{$search}%")
                        ->orWhere('department', 'like', "%{$search}%");
                });
            })
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(10)
            ->withQueryString();
    }

    public function designations(): array
    {
        return Employee::query()
            ->select('designation')
            ->distinct()
            ->orderBy('designation')
            ->pluck('designation')
            ->all();
    }

    public function create(array $attributes): Employee
    {
        return Employee::query()->create($attributes);
    }

    public function update(Employee $employee, array $attributes): Employee
    {
        $employee->update($attributes);

        return $employee->refresh();
    }

    public function delete(Employee $employee): void
    {
        $employee->delete();
    }

    public function dashboardCounts(): array
    {
        return [
            'total' => Employee::query()->count(),
            'active' => Employee::query()->where('status', 'active')->count(),
            'inactive' => Employee::query()->where('status', 'inactive')->count(),
            'joined_this_month' => Employee::query()
                ->whereBetween('date_of_joining', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
                ->count(),
        ];
    }

    public function recent(int $limit = 5): Collection
    {
        return Employee::query()
            ->latest('created_at')
            ->limit($limit)
            ->get();
    }
}
