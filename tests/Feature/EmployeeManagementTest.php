<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EmployeeManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $adminRoleId = Role::query()->where('is_system', true)->value('id');
        $this->actingAs(User::factory()->create(['role_id' => $adminRoleId]));
        $this->assertTrue(auth()->user()->is_active);
        $this->assertTrue(auth()->user()->hasPermission('dashboard', 'view'));
    }

    public function test_employee_directory_is_the_home_page(): void
    {
        $response = $this->get('/');

        $response->assertRedirect(route('dashboard'));
        $this->get(route('dashboard'))->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard', false));
    }

    public function test_employee_forms_and_details_page_render(): void
    {
        $employee = Employee::factory()->create();

        $this->get(route('employees.create'))->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Form', false)->where('employee', null));
        $this->get(route('employees.edit', $employee))->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Form', false)->where('employee.id', $employee->id));
        $this->get(route('employees.show', $employee))->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Show', false)->where('employee.full_name', $employee->full_name));
    }

    public function test_dashboard_shows_employee_summary_and_recent_records(): void
    {
        $recentEmployee = Employee::factory()->create([
            'employee_id' => 'HR-1001',
            'date_of_joining' => now()->toDateString(),
            'status' => 'active',
        ]);
        Employee::factory()->create(['status' => 'inactive']);

        $this->get(route('dashboard'))->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard', false)
            ->where('counts.total', 2)
            ->where('counts.active', 1)
            ->where('counts.inactive', 1)
            ->where('counts.joined_this_month', 1)
            ->where('recent.0.employee_id', 'HR-1001')
            ->where('recent.0.full_name', $recentEmployee->full_name));
    }

    public function test_employee_can_be_created_and_listed(): void
    {
        $employee = Employee::factory()->make([
            'gender' => 'female',
            'nationality' => 'Omani',
            'contact_number' => '+968 90000000',
            'marital_status' => 'single',
            'hr_category' => 'Permanent',
        ])->toArray();

        $response = $this->post(route('employees.store'), $employee);

        $response->assertRedirect(route('employees.index'));
        $this->assertDatabaseHas('employees', [
            'employee_id' => $employee['employee_id'],
            'official_email' => $employee['official_email'],
            'gender' => 'female',
            'nationality' => 'Omani',
            'contact_number' => '+968 90000000',
            'marital_status' => 'single',
            'hr_category' => 'Permanent',
        ]);
        $this->get(route('employees.index'))->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index', false)
            ->where('employees.data.0.employee_id', $employee['employee_id'])
            ->where('employees.total', 1));
    }

    public function test_employee_can_be_updated_without_changing_unique_values(): void
    {
        $employee = Employee::factory()->create();

        $response = $this->put(route('employees.update', $employee), [
            ...$employee->only([
                'employee_id',
                'first_name',
                'middle_name',
                'last_name',
                'department',
                'designation',
                'official_email',
                'status',
            ]),
            'date_of_joining' => $employee->date_of_joining->format('Y-m-d'),
            'designation' => 'HR Manager',
        ]);

        $response->assertRedirect(route('employees.index'));
        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'designation' => 'HR Manager',
        ]);
    }

    public function test_duplicate_employee_id_is_rejected(): void
    {
        $employee = Employee::factory()->create();
        $duplicate = Employee::factory()->make([
            'employee_id' => $employee->employee_id,
        ])->toArray();

        $response = $this->post(route('employees.store'), $duplicate);

        $response->assertSessionHasErrors([
            'employee_id' => 'This employee ID is already assigned to another employee.',
        ]);
        $this->assertDatabaseCount('employees', 1);
    }

    public function test_employee_directory_can_be_searched(): void
    {
        $matching = Employee::factory()->create([
            'employee_id' => 'HR-1010',
            'designation' => 'People Manager',
        ]);
        Employee::factory()->create(['employee_id' => 'HR-2020', 'designation' => 'Accountant']);

        $response = $this->get(route('employees.index', ['designation' => 'People']));

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index', false)
            ->where('employees.data.0.employee_id', $matching->employee_id)
            ->where('employees.total', 1));
    }

    public function test_employee_directory_can_be_searched_by_name_and_employee_id(): void
    {
        $matching = Employee::factory()->create([
            'employee_id' => 'HR-4321',
            'first_name' => 'Sana',
            'last_name' => 'Khan',
        ]);
        Employee::factory()->create([
            'employee_id' => 'HR-9999',
            'first_name' => 'Alex',
            'last_name' => 'Smith',
        ]);

        $this->get(route('employees.index', ['name' => 'Sana']))->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index', false)
            ->where('employees.data.0.employee_id', $matching->employee_id)
            ->where('employees.total', 1));

        $this->get(route('employees.index', ['employee_id' => '4321']))->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Index', false)
            ->where('employees.data.0.employee_id', $matching->employee_id)
            ->where('employees.total', 1));
    }

    public function test_employee_can_be_removed(): void
    {
        $employee = Employee::factory()->create();

        $response = $this->delete(route('employees.destroy', $employee));

        $response->assertRedirect(route('employees.index'));
        $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
    }
}
