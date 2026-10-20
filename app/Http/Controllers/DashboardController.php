<?php

namespace App\Http\Controllers;

use App\Services\EmployeeService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private EmployeeService $employees) {}

    public function __invoke(): Response
    {
        $summary = $this->employees->dashboardSummary();

        return Inertia::render('Dashboard', [
            'counts' => $summary['counts'],
            'recent' => $summary['recent']->map(fn ($employee) => [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'full_name' => $employee->full_name,
                'official_email' => $employee->official_email,
                'department' => $employee->department,
                'designation' => $employee->designation,
                'status' => $employee->status,
            ])->values(),
        ]);
    }
}
