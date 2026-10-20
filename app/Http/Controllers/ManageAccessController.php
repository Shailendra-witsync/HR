<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreManagedUserRequest;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateManagedUserRequest;
use App\Http\Requests\UpdateRolePermissionsRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\HrAdministrationService;
use App\Support\HrModules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ManageAccessController extends Controller
{
    public function __construct(private HrAdministrationService $administration) {}

    public function index(Request $request): Response
    {
        return Inertia::render('ManageAccess/Index', [
            'modules' => HrModules::ALL,
            'roles' => $this->administration->roles(),
            'users' => $this->administration->users(),
            'canManage' => $request->user()->hasPermission('manage_access', 'manage'),
        ]);
    }

    public function storeRole(StoreRoleRequest $request): RedirectResponse
    {
        $this->administration->createRole($request->validated('name'));

        return to_route('manage-access.index')->with('status', 'Role created. Set its permissions in the matrix.');
    }

    public function updateRolePermissions(UpdateRolePermissionsRequest $request, Role $role): RedirectResponse
    {
        $this->administration->updateRolePermissions($role, $request->validated('permissions'));

        return to_route('manage-access.index')->with('status', 'Role permissions updated.');
    }

    public function destroyRole(Role $role): RedirectResponse
    {
        $this->administration->deleteRole($role);

        return to_route('manage-access.index')->with('status', 'Role deleted.');
    }

    public function storeUser(StoreManagedUserRequest $request): RedirectResponse
    {
        $this->administration->createUser($request->validated());

        return to_route('manage-access.index')->with('status', 'User account created.');
    }

    public function updateUser(UpdateManagedUserRequest $request, User $user): RedirectResponse
    {
        $this->administration->updateUser($user, $request->validated(), $request->user());

        return to_route('manage-access.index')->with('status', 'User access updated.');
    }
}
