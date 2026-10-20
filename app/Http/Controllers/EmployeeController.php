<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeIndexRequest;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Services\EmployeeService;
use App\Services\HrAdministrationService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function __construct(
        private EmployeeService $employees,
        private HrAdministrationService $administration,
    ) {}

    public function index(EmployeeIndexRequest $request): Response
    {
        $employees = $this->employees->paginate($request->validated());
        $employees->through(fn (Employee $employee) => [
            'id' => $employee->id,
            'employee_id' => $employee->employee_id,
            'first_name' => $employee->first_name,
            'middle_name' => $employee->middle_name,
            'last_name' => $employee->last_name,
            'full_name' => $employee->full_name,
            'department' => $employee->department,
            'designation' => $employee->designation,
            'official_email' => $employee->official_email,
            'date_of_joining' => $employee->date_of_joining->toDateString(),
            'status' => $employee->status,
        ]);

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'designations' => $this->employees->designations(),
            'filters' => $request->validated(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Employees/Form', [
            'employee' => null,
            'designations' => $this->employees->designations(),
            'codificationOptions' => $this->codificationOptions(),
        ]);
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $this->employees->create($request->validated());

        return to_route('employees.index')->with('status', 'Employee added successfully.');
    }

    public function show(Employee $employee): Response
    {
        return Inertia::render('Employees/Show', [
            'employee' => $this->employeeData($employee),
        ]);
    }

    public function edit(Employee $employee): Response
    {
        return Inertia::render('Employees/Form', [
            'employee' => $this->employeeData($employee),
            'designations' => $this->employees->designations(),
            'codificationOptions' => $this->codificationOptions(),
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $this->employees->update($employee, $request->validated());

        return to_route('employees.index')->with('status', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $this->employees->delete($employee);

        return to_route('employees.index')->with('status', 'Employee removed successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function employeeData(Employee $employee): array
    {
        return [
            ...$employee->only([
                'id',
                'employee_id',
                'first_name',
                'middle_name',
                'last_name',
                'department',
                'designation',
                'official_email',
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
            ]),
            'full_name' => $employee->full_name,
            'date_of_joining' => $employee->date_of_joining->toDateString(),
        ];
    }

    /**
     * @return array{departments: array<int, string>, designations: array<int, string>, categories: array<int, string>}
     */
    private function codificationOptions(): array
    {
        $codifications = $this->administration->codifications();

        return [
            'departments' => collect($codifications['department'] ?? [])->pluck('name')->all(),
            'designations' => collect($codifications['designation'] ?? [])->pluck('name')->all(),
            'categories' => collect($codifications['category'] ?? [])->pluck('name')->all(),
        ];
    }
}
