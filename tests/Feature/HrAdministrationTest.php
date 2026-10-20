<?php

namespace Tests\Feature;

use App\Models\HrCodification;
use App\Models\Role;
use App\Models\User;
use App\Support\HrModules;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HrAdministrationTest extends TestCase
{
    use RefreshDatabase;

    private User $administrator;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::query()->where('is_system', true)->firstOrFail();
        $this->administrator = User::factory()->create(['role_id' => $role->id]);
        $this->assertTrue($this->administrator->is_active);
        $this->assertTrue($this->administrator->hasPermission('settings', 'view'));
        $this->actingAs($this->administrator);
    }

    public function test_settings_lists_and_persists_hr_codifications(): void
    {
        $this->get(route('settings.index'))->assertInertia(fn (Assert $page) => $page
            ->component('Settings/Index', false)
            ->has('codifications'));

        $this->post(route('settings.codifications.store'), [
            'type' => 'department',
            'name' => 'Engineering',
        ])->assertRedirect(route('settings.index'));

        $department = HrCodification::query()->where('name', 'Engineering')->firstOrFail();
        $this->post(route('settings.codifications.store'), [
            'type' => 'designation',
            'name' => 'Software Engineer',
            'parent_id' => $department->id,
        ])->assertRedirect(route('settings.index'));

        $this->post(route('settings.codifications.store'), [
            'type' => 'designation',
            'name' => 'Software Engineer',
            'parent_id' => $department->id,
        ])->assertSessionHasErrors([
            'name' => 'A codification with this name already exists in this category.',
        ]);

        $this->assertDatabaseHas('hr_codifications', [
            'type' => 'designation',
            'name' => 'Software Engineer',
            'parent_id' => $department->id,
        ]);

        $this->delete(route('settings.codifications.destroy', $department))
            ->assertSessionHasErrors('codification');
    }

    public function test_roles_and_users_can_be_managed_and_permissions_are_enforced(): void
    {
        $this->post(route('manage-access.roles.store'), ['name' => 'Recruiter'])
            ->assertRedirect(route('manage-access.index'));

        $role = Role::query()->where('name', 'Recruiter')->firstOrFail();
        $permissions = collect(HrModules::names())->mapWithKeys(fn ($module) => [
            $module => [
                'view' => in_array($module, ['list_employees', 'modify_employees'], true),
                'manage' => false,
            ],
        ])->all();

        $this->put(route('manage-access.roles.permissions', $role), [
            'permissions' => $permissions,
        ])->assertRedirect(route('manage-access.index'));

        $this->post(route('manage-access.users.store'), [
            'name' => 'Recruiter User',
            'email' => 'recruiter@example.com',
            'password' => 'SecurePass123',
            'password_confirmation' => 'SecurePass123',
            'role_id' => $role->id,
        ])->assertRedirect(route('manage-access.index'));

        $recruiter = User::query()->where('email', 'recruiter@example.com')->firstOrFail();
        $this->assertTrue($recruiter->hasPermission('list_employees', 'view'));
        $this->assertFalse($recruiter->hasPermission('dashboard', 'view'));

        $this->actingAs($recruiter)->get(route('employees.index'))->assertOk();
        $this->get(route('employees.index', ['view' => 'modify']))->assertOk();
        $this->get(route('dashboard'))->assertForbidden();
    }

    public function test_unprivileged_user_cannot_access_hr_administration(): void
    {
        $role = Role::query()->create(['name' => 'Read only']);
        foreach (HrModules::names() as $module) {
            $role->permissions()->create(['module' => $module]);
        }

        $user = User::factory()->create(['role_id' => $role->id]);

        $this->actingAs($user)
            ->get(route('settings.index'))
            ->assertForbidden();
    }
}
