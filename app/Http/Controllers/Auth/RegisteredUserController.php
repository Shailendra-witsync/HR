<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(private AuthService $auth) {}

    public function create(): Response
    {
        abort_if(User::query()->exists(), 404);

        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $this->auth->register($request->validated());

        $request->session()->regenerate();

        return to_route('dashboard');
    }
}
