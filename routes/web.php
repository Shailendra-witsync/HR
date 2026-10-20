<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ManageAccessController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('login.store');
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('register.store');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', DashboardController::class)
        ->middleware('permission:dashboard.view')
        ->name('dashboard');

    Route::get('/employees', [EmployeeController::class, 'index'])
        ->middleware('permission:list_employees.view|modify_employees.view')->name('employees.index');
    Route::get('/employees/create', [EmployeeController::class, 'create'])
        ->middleware('permission:add_employees.view')->name('employees.create');
    Route::post('/employees', [EmployeeController::class, 'store'])
        ->middleware('permission:add_employees.manage')->name('employees.store');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])
        ->middleware('permission:list_employees.view')->name('employees.show');
    Route::get('/employees/{employee}/edit', [EmployeeController::class, 'edit'])
        ->middleware('permission:modify_employees.view')->name('employees.edit');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])
        ->middleware('permission:modify_employees.manage')->name('employees.update');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])
        ->middleware('permission:modify_employees.manage')->name('employees.destroy');

    Route::get('/settings', [SettingsController::class, 'index'])
        ->middleware('permission:settings.view')->name('settings.index');
    Route::post('/settings/codifications', [SettingsController::class, 'store'])
        ->middleware('permission:settings.manage')->name('settings.codifications.store');
    Route::put('/settings/codifications/{codification}', [SettingsController::class, 'update'])
        ->middleware('permission:settings.manage')->name('settings.codifications.update');
    Route::delete('/settings/codifications/{codification}', [SettingsController::class, 'destroy'])
        ->middleware('permission:settings.manage')->name('settings.codifications.destroy');

    Route::get('/manage-access', [ManageAccessController::class, 'index'])
        ->middleware('permission:manage_access.view')->name('manage-access.index');
    Route::post('/manage-access/roles', [ManageAccessController::class, 'storeRole'])
        ->middleware('permission:manage_access.manage')->name('manage-access.roles.store');
    Route::put('/manage-access/roles/{role}/permissions', [ManageAccessController::class, 'updateRolePermissions'])
        ->middleware('permission:manage_access.manage')->name('manage-access.roles.permissions');
    Route::delete('/manage-access/roles/{role}', [ManageAccessController::class, 'destroyRole'])
        ->middleware('permission:manage_access.manage')->name('manage-access.roles.destroy');
    Route::post('/manage-access/users', [ManageAccessController::class, 'storeUser'])
        ->middleware('permission:manage_access.manage')->name('manage-access.users.store');
    Route::put('/manage-access/users/{user}', [ManageAccessController::class, 'updateUser'])
        ->middleware('permission:manage_access.manage')->name('manage-access.users.update');
});
