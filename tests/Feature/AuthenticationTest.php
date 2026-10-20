<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_login_and_registration_pages(): void
    {
        $this->get(route('login'))->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Login', false));
        $this->get(route('register'))->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Register', false));
    }

    public function test_guest_is_redirected_to_login_from_dashboard_and_employee_pages(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
        $this->get(route('employees.index'))->assertRedirect(route('login'));
    }

    public function test_registration_creates_a_hashed_user_and_signs_them_in(): void
    {
        $response = $this->post(route('register.store'), [
            'name' => 'HR Manager',
            'email' => 'manager@example.com',
            'password' => 'SecurePass123',
            'password_confirmation' => 'SecurePass123',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'email' => 'manager@example.com',
            'role_id' => Role::query()->where('name', 'Administrator')->value('id'),
            'is_active' => true,
        ]);
        $this->assertTrue(Hash::check('SecurePass123', User::query()->where('email', 'manager@example.com')->value('password')));
    }

    public function test_registration_shows_password_confirmation_error_on_confirmation_field(): void
    {
        $this->from(route('register'))->post(route('register.store'), [
            'name' => 'HR Manager',
            'email' => 'manager@example.com',
            'password' => 'SecurePass123',
            'password_confirmation' => 'DifferentPass123',
        ])->assertRedirect(route('register'))->assertSessionHasErrors('password_confirmation');

        $this->assertDatabaseCount('users', 0);
    }

    public function test_registration_is_closed_after_the_first_administrator_is_created(): void
    {
        User::factory()->create(['email' => 'manager@example.com']);

        $this->get(route('register'))->assertNotFound();
        $this->post(route('register.store'), [
            'name' => 'Another Manager',
            'email' => 'another@example.com',
            'password' => 'SecurePass123',
            'password_confirmation' => 'SecurePass123',
        ])->assertForbidden();

        $this->assertDatabaseCount('users', 1);
    }

    public function test_user_can_log_in_and_is_redirected_to_dashboard(): void
    {
        $user = User::factory()->create(['password' => 'SecurePass123']);

        $response = $this->from(route('employees.index'))->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'SecurePass123',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_can_log_in_with_an_email_address_without_a_domain_suffix(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@witsync',
            'password' => 'Admin@123',
        ]);

        $this->post(route('login.store'), [
            'email' => 'admin@witsync',
            'password' => 'Admin@123',
        ])->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($user);
    }

    public function test_invalid_login_is_rejected(): void
    {
        User::factory()->create();

        $response = $this->from(route('login'))->post(route('login.store'), [
            'email' => 'wrong@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertRedirect(route('login'))
            ->assertSessionHasErrors([
                'email' => 'These credentials do not match our records.',
            ]);
        $this->assertGuest();
    }

    public function test_inactive_user_cannot_log_in(): void
    {
        User::factory()->create([
            'email' => 'inactive@example.com',
            'password' => 'SecurePass123',
            'is_active' => false,
        ]);

        $this->from(route('login'))->post(route('login.store'), [
            'email' => 'inactive@example.com',
            'password' => 'SecurePass123',
        ])->assertRedirect(route('login'))->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_authenticated_user_can_log_out(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('logout'));

        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }

    public function test_authenticated_users_are_redirected_away_from_login_and_registration(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get(route('login'))->assertRedirect(route('dashboard'));
        $this->get(route('register'))->assertRedirect(route('dashboard'));
    }
}
