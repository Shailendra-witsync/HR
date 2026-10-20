<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => fake()->unique()->bothify('HR-####'),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional()->firstName(),
            'last_name' => fake()->lastName(),
            'department' => fake()->randomElement(['Human Resources', 'Finance', 'Engineering', 'Operations']),
            'designation' => fake()->jobTitle(),
            'official_email' => fake()->unique()->companyEmail(),
            'date_of_joining' => fake()->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'status' => 'active',
        ];
    }
}
